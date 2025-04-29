"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import { Locator } from "@readium/shared";
import { ActionComponentVariant, ActionKeys, IActionComponentContainer, IActionComponentTrigger } from "@/models/actions";

import searchStyles from "./assets/styles/nyuSearch.module.css";
import "./assets/styles/nyuDisclosure.css"; // Import regular CSS file for Disclosure styling

import LocationIcon from "./assets/icons/nyu_search.svg";

import { ActionIcon } from "./ActionTriggers/NYUActionIcon";
import { SheetWithType } from "./Sheets/SheetWithType";
import { OverflowMenuItem } from "./ActionTriggers/OverflowMenuItem";
import { Button, Disclosure, Form, Heading, Input, Key, Link as AriaLink, TextField, DisclosurePanel } from "react-aria-components";
import { ListBox, ListBoxItem } from "react-aria-components";
import {
  Tree,
  TreeItem,
  TreeItemContent
} from "react-aria-components";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { useDocking } from "@/hooks/useDocking";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";
import { SheetTypes } from "@/models/sheets";
import { DecoratorRequest } from "@/readium/ts-toolkit/navigator-html-injectables/src/modules/Decorator";

interface SearchResult {
  id: string;
  href: string;
  bookTitle: string;
  chapterTitle: string;
  bookID: string;
}

interface Highlighting {
  [key: string]: {
    content: string[];
  };
}

interface JsonResponse {
  response: {
    numFound: number;
    docs: SearchResult[];
  };
  highlighting: Highlighting;
}

export const NYUSearchContainer: React.FC<IActionComponentContainer> = ({ triggerRef }) => {
  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.nyuSearch]);
  const dispatch = useAppDispatch();
  const { getCframes, go } = useEpubNavigator();

  const isDev = process.env.NODE_ENV === "development";
  const NYU_PRESS_API = isDev ? 'http://localhost:3001' : 'http://18.205.45.14:3001';  //'http://35.95.95.96:3001';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [highlighting, setHighlighting] = useState<Highlighting>({});
  const [groupedResults, setGroupedResults] = useState<Record<string, SearchResult[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [numFound, setNumFound] = useState(-1);
  const [booksFound, setBooksFound] = useState(0);
  const currentTitle = useAppSelector(state => state.publication.runningHead);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const docking = useDocking(ActionKeys.nyuSearch);
  const sheetType = docking.sheetType;

  const setOpen = (value: boolean) => {
    dispatch(setActionOpen({ 
      key: ActionKeys.nyuSearch,
      isOpen: value 
    }));
  }

  useEffect(() => {
    //on first run, check if there is a search term in the URL
    const urlSearchTerm = searchParams.get("search");
    //if so, set the searchTerm and call the search API
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
      callSearchAPI(urlSearchTerm);
    }
  }, []);

  const handleAction = (key: Key) => {
    const keyString = key.toString();
    const [chapterID, highlightNum] = keyString.split("-").map(Number);
    const snippet = highlighting[chapterID].content[highlightNum];
    const context = extractContextSnippet(snippet);
    const before = context?.before;
    const after = context?.after;
    const highlight = context?.highlight;
    const searchResult = findResultById(chapterID.toString(), results);
    const href = searchResult?.href || "";
    const title = searchResult?.bookTitle || "";
    const bookID = searchResult?.bookID || "";

    //create locator to find the highligh in the book
    const locatorData = {
      href: href,
      type: "application/xhtml+xml",
      "locations": {
          "progression": 0.750
      },
      text: {after: after, before: before, highlight: highlight}
    };

    function getBookIDFromUrl(url: string): string | undefined {
      if (!url) return undefined;
      return url.split('/').pop() ?? '';
    }

    const bookParam = searchParams.get("book");
    const urlBookID = getBookIDFromUrl(bookParam!);

    // If the bookID is the same as the current title just go to the locator
    // If not, create a deep link to the new book
    if (bookID === urlBookID) {  
      const searchLocator = Locator.deserialize(locatorData);
      go(searchLocator! , true, () => {highlightSearchTerm(searchLocator!)});

    } else {
      const host = typeof window !== "undefined" ? `${window.location.origin}${pathname}` : "";
      const bookUrl = searchParams.get("book"); // Extract "book" param from URL
      const newBookUrl = bookUrl!.replace(/\/[^/]+$/, `/${bookID}`);
      const encodedLocator = encodeURIComponent(JSON.stringify(locatorData));

      const deepLink = `${host}?book=${newBookUrl}&locator=${encodedLocator}&search=${searchTerm}`;

      window.location.href = deepLink;
    }

  };

  const highlightSearchTerm = (searchLocator: Locator) => {
    //highlight the search term on the page
    const _cframes = getCframes();
    if (_cframes)
    {
      _cframes.forEach((cframe) => {
        if (cframe) {
          cframe.msg?.send("decorate", {
            group: "tts",
            action: "update",
            decoration: {
              id: "tts",
              locator: searchLocator,
            },
          } as DecoratorRequest);
        }
      });
    }
  }

  const findResultById = (id: string, results: SearchResult[]): SearchResult | undefined => {
    return results.find((result) => result.id === id);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default browser page refresh.
    e.preventDefault();

    // Get form data as an object.
    let searchForm = Object.fromEntries(new FormData(e.currentTarget));
    setSearchTerm(`${searchForm.term}`);
    callSearchAPI(`${searchForm.term}`);

  };

  const callSearchAPI = async (term: string) => {
    try {
      const response = await fetch(`${NYU_PRESS_API}/search?q=${term}`);
      const data: JsonResponse = await response.json();
      setNumFound(data.response.numFound);
      setResults(data.response.docs);   
      setHighlighting(data.highlighting);
      const grouped = groupByBookTitle(data.response.docs);
      const numBooks = Object.keys(grouped).length;
      setBooksFound(numBooks);
      setGroupedResults(grouped);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }; 

  const groupByBookTitle = (data: SearchResult[]): Record<string, SearchResult[]> => {
    return data.reduce((acc: Record<string, SearchResult[]>, item) => {
      if (!acc[item.bookTitle]) {
        acc[item.bookTitle] = [];
      }
      acc[item.bookTitle].push(item);
      return acc;
    }, {});
  };

  const currentTitleFirst = Object.entries(groupedResults).sort(([keyA], [keyB]) => {
    if (keyA === currentTitle) return -1; 
    if (keyB === currentTitle) return 1;
    return 0; 
  });

  // Function to extract the first occurrence of [BEFORE] and [AFTER]
  const extractContextSnippet = (snippet: string, beforeWords = 18, afterWords = 10) => {
    const match = snippet.match(/\[BEFORE\](.*?)\[AFTER\]/); // Find the first match
    if (!match) return null; // If no highlighted term found, return null

    const searchTerm = match[1]; // Extract search term
    const words = snippet.split(/\s+/); // Split text into words

    // Find the index of the first occurrence of `[BEFORE]search-term[AFTER]`
    const searchIndex = words.findIndex(word => word.includes(`[BEFORE]${searchTerm}[AFTER]`));
    if (searchIndex === -1) return null; // If no match, return null

    // Get words before and after, ensuring we don't go out of bounds
    const startIdx = Math.max(0, searchIndex - beforeWords);
    const endIdx = Math.min(words.length, searchIndex + afterWords + 1);
    const contextWords = words.slice(startIdx, endIdx).join(" ");

    return {
      before: words.slice(startIdx, searchIndex).join(" "),
      highlight: searchTerm,
      after: words.slice(searchIndex + 1, endIdx).join(" "),
      formattedSnippet: contextWords.replace(/\[BEFORE\](.*?)\[AFTER\]/, `<em class="search-highlight">$1</em>`),
    };
  };

  const getResultsString = () => {
    if (numFound === -1) return "";
    if (numFound === 0) return Locale.reader.nyuSearch.noResults;
    if (booksFound === 1) return `${Locale.reader.nyuSearch.resultsPre} ${numFound} ${Locale.reader.nyuSearch.resultsMid} ${booksFound} ${Locale.reader.nyuSearch.resultsOne}`;
    if (booksFound > 1) return `${Locale.reader.nyuSearch.resultsPre} ${numFound} ${Locale.reader.nyuSearch.resultsMid} ${booksFound} ${Locale.reader.nyuSearch.resultsMany}`;
      
  }

  const makeSafeID = (str: string) => {
    return str.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  };

  return(
    <>
    <SheetWithType 
      sheetType={ sheetType }
      sheetProps={ {
        id: ActionKeys.nyuSearch,
        triggerRef: triggerRef, 
        heading: Locale.reader.nyuSearch.heading,
        className: searchStyles.nyuSearch,
        placement: "bottom",
        isOpen: actionState.isOpen || false,
        onOpenChangeCallback: setOpen,
        onClosePressCallback: () => setOpen(false),
        docker: docking.getDocker()
      } }
    >
      <Form onSubmit={onSubmit} aria-label="Search Form" className={ searchStyles.searchForm }>
        <TextField name="term" className={ searchStyles.inputContainer } defaultValue={searchTerm}>
          <Input className={ searchStyles.inputField } aria-label="Search Input" />
        </TextField>
        <Button type="submit" aria-label="Search Button"  className={ searchStyles.submitButton }>{Locale.reader.nyuSearch.buttonLabel}</Button>
      </Form>

      {numFound !== -1 && <div className={ searchStyles.numFound }>{ getResultsString() }</div>}

      <div className={ searchStyles.booksContainer }>
        {currentTitleFirst.map(([bookTitle, chapters]) => (
          <Disclosure key={bookTitle} defaultExpanded={true}>
            <div key={bookTitle} id={makeSafeID(bookTitle)} className={ searchStyles.bookTitleContainer }>
              <div key={bookTitle} className={ searchStyles.bookTitleHeader }>
                <Heading key={bookTitle} className={ searchStyles.bookTitle } aria-label="Book Title">
                <Button slot="trigger" aria-label="Book Title Disclosure">
                  <svg viewBox="0 0 24 24">
                    <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                  {bookTitle}
                </Button>
                </Heading>
              </div>
              <DisclosurePanel>
              {chapters.map((chapter) => (
                <div key={chapter.id}>
                  <div key={chapter.id} className={ searchStyles.chapterTitle } aria-label="Chapter Title">
                    {chapter.chapterTitle}
                  </div>

                  {/* Add the highlights returned for each chapter as a ListBox */}
                  <ListBox key={chapter.chapterTitle} aria-label={`Search Results for ${chapter.chapterTitle}`}>
                    {highlighting[chapter.id]?.content.map((highlight, index) => (
                      <ListBoxItem key={index} className={ searchStyles.listboxItem } onAction={() => handleAction(`${chapter.id}-${index}`)}>
                        <p dangerouslySetInnerHTML={{ __html: extractContextSnippet(highlight)?.formattedSnippet as string}} />
                      </ListBoxItem>
                    ))}
                  </ListBox>
                </div>
              ))}
              </DisclosurePanel>
            </div>
          </Disclosure>
        ))}
      </div>
    </SheetWithType>
    </>
  )
}

export const NYUSearchAction: React.FC<IActionComponentTrigger> = ({ variant }) => {
  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.nyuSearch]);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {
    dispatch(setActionOpen({ 
      key: ActionKeys.nyuSearch,
      isOpen: value 
    }));
  }

  return(
    <>
    { (variant && variant === ActionComponentVariant.menu) 
      ? <OverflowMenuItem 
          label={ Locale.reader.toc.trigger }
          SVG={ LocationIcon } 
          shortcut={ RSPrefs.actions.keys[ActionKeys.nyuSearch].shortcut }
          id={ ActionKeys.nyuSearch }
          onActionCallback={ () => setOpen(!actionState.isOpen) }
        />
      : <ActionIcon 
          visibility={ RSPrefs.actions.keys[ActionKeys.nyuSearch].visibility }
          ariaLabel={ Locale.reader.toc.trigger } 
          SVG={ LocationIcon } 
          placement="bottom"
          tooltipLabel={ Locale.reader.toc.tooltip } 
          onPressCallback={ () => setOpen(!actionState.isOpen) }
        />
    }
    </>
  )
}