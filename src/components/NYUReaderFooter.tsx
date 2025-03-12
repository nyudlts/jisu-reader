import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Locale from "../resources/locales/en.json";
import readerFooterStyles from "./assets/styles/nyuReaderFooter.module.css";
import readerStateStyles from "./assets/styles/readerStates.module.css";
import chapterTitleStyles from "./assets/styles/progression.module.css";
import classNames from "classnames";
import { Locator } from "@readium/shared";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {Input} from 'react-aria-components';
import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { ProgressionOf } from "./ProgressionOf";

interface ChaptersResult {
  chars: string;
  href: string;
  chapterTitle: string;
}

interface ChapterRanges {
  start: number;
  end: number;
  chapter: ChaptersResult;
}

interface JsonResponse {
  response: {
    numFound: number;
    docs: ChaptersResult[];
  };
}

export const ReaderFooter = () => {
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
  const dispatch = useAppDispatch();

  //progress bar values
  const stateProgression = useAppSelector(state => state.publication.progression.totalProgression) ?? 0;
  const chapterHref = useAppSelector(state => state.publication.chapterHref);
  const [footerTitle, setFooterTitle] = useState<string | undefined>(undefined);
  const [localProgress, setLocalProgress] = useState(stateProgression);
  const [shouldUpdate, setShouldUpdate] = useState(0);
  const isDev = process.env.NODE_ENV === "development";
  const NYU_PRESS_API = isDev ? 'http://localhost:3001' : 'http://35.95.95.96:3001';
  const searchParams = useSearchParams();
  const [chapters, setChapters] = useState<ChaptersResult[]>([]);
  const [chapterRanges, setChapterRanges] = useState<ChapterRanges[]>([]);
  const { go } = useEpubNavigator();

  useEffect(() => {
    console.log("PK stateProgression", stateProgression, shouldUpdate);
    if (shouldUpdate === 0) {
      setLocalProgress(stateProgression);
    } else {
      setShouldUpdate(shouldUpdate - 1);
    }
  }, [stateProgression]);

  useEffect(() => {
    if (chapterHref) {
      setFooterTitle(getChapterTitleByHref(chapterHref));
    }
  }, [chapterHref]);

  useEffect(() => {
    //on first run, get the chapter list from API
    const bookUrl = searchParams.get("book");
    const bookID = getBookIDFromUrl(bookUrl!); 
    if (bookID)
      callChaptersAPI(bookID);

  }, []);

  useEffect(() => {
      const totalLength = chapters.reduce((sum, ch) => sum + parseInt(ch.chars), 0);1
  
      if (chapters && chapters.length)  {
        const ranges = chapters.map((chapter, index) => {
          const start = index === 0 ? 0 : chapters.slice(0, index).reduce((sum, ch) => sum + parseInt(ch.chars), 0) / totalLength;
          const end = start + parseInt(chapter.chars) / totalLength;
          return { chapter:chapter, start:start, end:end };
        });
  
        setChapterRanges(ranges);
      }
  
    }, [chapters]);

  const getChapterTitleByHref = (href: string): string | undefined => {
    const chapter = chapters.find(ch => ch.href === href);
    return chapter ? chapter.chapterTitle : undefined; 
  }

  function getBookIDFromUrl(url: string): string {
    return url.split('/').pop() ?? '';
  }

  const callChaptersAPI = async (term: string) => {
    try {
      const response = await fetch(`${NYU_PRESS_API}/chapters?q=${term}`);
      const data: JsonResponse = await response.json();
      if (!data) {
        console.error("No chapters found for this book");
        return;
      }
      setChapters(data.response.docs);
     
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }; 

  const getChapterFromProgress = (progress:number) => {
    
    for (const range of chapterRanges) {
      if (progress >= range.start && progress < range.end) {
        const chapterPercentage = (progress - range.start) / (range.end - range.start);
        return { href: range.chapter.href, prog: chapterPercentage, title: range.chapter.chapterTitle };
      }
    }
    // Default to end of last chapter
    const lastItem = chapterRanges[chapterRanges.length - 1];
    return { href: lastItem.chapter.href, prog: lastItem.end, title: lastItem.chapter.chapterTitle }; 
    
  };

  const goToProgression = () => {
    setShouldUpdate(2);
    const { href, prog, title } = getChapterFromProgress(localProgress);

    const locatorData = {
      href: href,
      type: "application/xhtml+xml",
      "locations": {
          "progression": prog
      }
    };

    const myLocator = Locator.deserialize(locatorData);
    go(myLocator! , true, () => {});
  }

  const setHover = () => {
    dispatch(setHovering(true));
  };

  const removeHover = () => {
    dispatch(setHovering(false));
  };

  const handleClassNameFromState = () => {
    let className = "";
    if (isImmersive && isHovering) {
      className = readerStateStyles.immersiveHovering;
    } else if (isImmersive) {
      className = readerStateStyles.immersive;
    }
    return className
  };

  return(
    <>
    <footer className={ classNames(readerFooterStyles.bottomBar, handleClassNameFromState()) }>
        <div className={ classNames(readerFooterStyles.progressRow, handleClassNameFromState()) }>
          <Input
            type="range"
            className={ classNames(readerFooterStyles.progressSlider, handleClassNameFromState()) }
            min="0"
            max="1"
            step={0.01}
            value={localProgress} 
            onChange={(event) => {
              setLocalProgress(Number(event.target.value));
            }}
            onPointerUp={goToProgression}
            
          />
        </div>
        <div className={ classNames(readerFooterStyles.infoRow, handleClassNameFromState()) }>
          <div id={ chapterTitleStyles.current } aria-label={ Locale.reader.app.nyuFooterTitle.label }>
            { footerTitle ? footerTitle: "" }
          </div>
          <div className={ classNames(readerFooterStyles.pageControls, handleClassNameFromState()) }>
            <span className={ classNames(readerFooterStyles.nyuPageNumber, handleClassNameFromState()) }>
              <ProgressionOf />
            </span>
            <button
              title="Bookmark"
              aria-label="Add Bookmark"
              className={ classNames(readerFooterStyles.bookmarkButton, handleClassNameFromState()) }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="22px"
                fill="#555"
              >
                <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}