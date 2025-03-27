"use client";

import { useCallback, useEffect, useRef } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import "./assets/styles/reader.css";
import arrowStyles from "./assets/styles/arrowButton.module.css";

import { StaticBreakpoints } from "@/models/staticBreakpoints";
import { ScrollBackTo } from "@/models/preferences";
import { ActionKeys } from "@/models/actions";
import { ThemeKeys } from "@/models/theme";
import { ICache } from "@/models/reader";

import { I18nProvider } from "react-aria";

import {
  BasicTextSelection,
  FrameClickEvent,
} from "@readium/navigator-html-injectables";
import { 
  EpubNavigatorListeners, 
  FrameManager, 
  FXLFrameManager, 
  LayoutStrategy 
} from "@readium/navigator";
import { 
  Link,
  Locator, 
  Manifest, 
  Publication, 
  Fetcher, 
  HttpFetcher, 
  EPUBLayout, 
  ReadingProgression 
} from "@readium/shared";

import { ReaderWithDock } from "./ReaderWithPanels";

import { ReaderHeader } from "./ReaderHeader";
import { ArrowButton } from "./ArrowButton";
import { ReaderFooter } from "./NYUReaderFooter";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useTheming } from "@/hooks/useTheming";
import { usePrevious } from "@/hooks/usePrevious";

import Peripherals from "@/helpers/peripherals";
import { CUSTOM_SCHEME, ScrollActions } from "@/helpers/scrollAffordance";
import { localData } from "@/helpers/localData";
import { getPlatformModifier } from "@/helpers/keyboard/getMetaKeys";
import { createTocTree } from "@/helpers/toc/createTocTree";
import { getPageListItems } from "@/helpers/pageList/getPageListItems";
import { extractAccessibilityInfo } from "@/helpers/a11y/a11yInfo";

import { 
  setImmersive, 
  setHovering, 
  toggleImmersive, 
  setPlatformModifier, 
  setDirection, 
  setArrows 
} from "@/lib/readerReducer";
import { 
  setFXL, 
  setRTL, 
  setProgression, 
  setRunningHead, 
  setTocTree, setPageList, setPublishers, setAuthors, setIdentifier, setCoverUrl, setChapterHref, setA11yInfo 
} from "@/lib/publicationReducer";
import { toggleActionOpen } from "@/lib/actionsReducer";
import { useAppSelector, useAppDispatch, useAppStore } from "@/lib/hooks";

import debounce from "debounce";
import { setTheme } from "@/lib/themeReducer";
import { DecoratorRequest } from "@/readium/ts-toolkit/navigator-html-injectables/src/modules/Decorator";

export const Reader = ({ rawManifest, selfHref, locatorParam }: { rawManifest: object, selfHref: string, locatorParam: string }) => {
  const container = useRef<HTMLDivElement>(null);
  const publication = useRef<Publication | null>(null);
  const localDataKey = useRef(`${selfHref}-current-location`);
  const arrowsWidth = useRef(2 * ((RSPrefs.theming.arrow.size || 40) + (RSPrefs.theming.arrow.offset || 0)));

  const align = useAppSelector(state => state.settings.align);
  const colCount = useAppSelector(state => state.settings.colCount);
  const fontFamily = useAppSelector(state => state.settings.fontFamily);
  const fontSize = useAppSelector(state => state.settings.fontSize);
  const fontWeight = useAppSelector(state => state.settings.fontWeight);
  const hyphens = useAppSelector(state => state.settings.hyphens);
  const isPaged = useAppSelector(state => state.reader.isPaged);
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const letterSpacing = useAppSelector(state => state.settings.letterSpacing);
  const lineLength = useAppSelector(state => state.settings.lineLength);
  const lineHeight = useAppSelector(state => state.settings.lineHeight);
  const normalizeText = useAppSelector(state => state.settings.normalizeText);
  const paraIndent = useAppSelector(state => state.settings.paraIndent);
  const paraSpacing = useAppSelector(state => state.settings.paraSpacing);
  const publisherStyles = useAppSelector(state => state.settings.publisherStyles);
  const wordSpacing = useAppSelector(state => state.settings.wordSpacing);
  const theme = useAppSelector(state => state.theming.theme);
  const previousTheme = usePrevious(theme);
  const colorScheme = useAppSelector(state => state.theming.colorScheme);
  const reducedMotion = useAppSelector(state => state.theming.prefersReducedMotion);

  const staticBreakpoint = useAppSelector(state => state.theming.staticBreakpoint);
  const arrowsOccupySpace = staticBreakpoint && 
    (staticBreakpoint === StaticBreakpoints.large || staticBreakpoint === StaticBreakpoints.xLarge);
  
  const isImmersive = useAppSelector(state => state.reader.isImmersive);

  // We need to use a cache so that we can use updated values
  // without re-rendering the component, and reloading EpubNavigator
  const cache = useRef<ICache>({
    isImmersive: isImmersive,
    arrowsOccupySpace: arrowsOccupySpace || false,
    settings: {
      align: align,
      colCount: colCount,
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: fontWeight,
      hyphens: hyphens,
      layoutStrategy: layoutStrategy,
      letterSpacing: letterSpacing,
      lineHeight: lineHeight,
      lineLength: lineLength,
      normalizeText: normalizeText,
      paginated: isPaged,
      paraIndent: paraIndent,
      paraSpacing: paraSpacing,
      publisherStyles: publisherStyles,
      theme: theme,
      wordSpacing: wordSpacing
    },
    colorScheme: colorScheme,
    reducedMotion: reducedMotion
  });

  const atPublicationStart = useAppSelector(state => state.publication.atPublicationStart);
  const atPublicationEnd = useAppSelector(state => state.publication.atPublicationEnd);

  const dispatch = useAppDispatch();

  const fs = useFullscreen();

  // The reason why we’re not using theming for states e.g theming.theme 
  // instead of useAppSelector is that theming will move to a higher-level component 
  // and not reside in Reader anymore so we would eventually have to use Redux states
  const theming = useTheming();

  const { 
    EpubNavigatorLoad, 
    EpubNavigatorDestroy,
    go,  
    goLeft, 
    goRight, 
    goBackward, 
    goForward, 
    scrollBackTo, 
    listThemeProps, 
    handleProgression,
    navLayout,
    currentLocator,
    getCframes,
    applyScroll,
    submitPreferences
  } = useEpubNavigator();

  const activateImmersiveOnAction = useCallback(() => {
    if (!cache.current.isImmersive) dispatch(setImmersive(true));
  }, [dispatch]);

  const toggleIsImmersive = useCallback(() => {
    // If tap/click in iframe, then header/footer no longer hoovering 
    dispatch(setHovering(false));
    dispatch(setArrows(false));
    dispatch(toggleImmersive());
  }, [dispatch]);

  useEffect(() => {
    cache.current.isImmersive = isImmersive;
  }, [isImmersive]);

  // Warning: this is using navigator’s internal methods that will become private, do not rely on them
  // See https://github.com/readium/playground/issues/25
  const handleTap = (event: FrameClickEvent) => {
    const _cframes = getCframes();
    if (_cframes && cache.current.settings.paginated) {
      const oneQuarter = ((_cframes.length === 2 ? _cframes[0]!.window.innerWidth + _cframes[1]!.window.innerWidth : _cframes![0]!.window.innerWidth) * window.devicePixelRatio) / 4;
    
      if (event.x < oneQuarter) {
        goLeft(!cache.current.reducedMotion, activateImmersiveOnAction);
      } 
      else if (event.x > oneQuarter * 3) {
        goRight(!cache.current.reducedMotion, activateImmersiveOnAction);
      } else if (oneQuarter <= event.x && event.x <= oneQuarter * 3) {
        toggleIsImmersive();
      }
    } else {
      toggleIsImmersive();
    }
  };

  const initReadingEnv = async () => {
    if (navLayout() === EPUBLayout.fixed) {
      // [TMP] Working around positionChanged not firing consistently for FXL
      // Init’ing so that progression can be populated on first spread loaded
      const cLoc = currentLocator();
      if (cLoc) handleProgression(cLoc);
    }
  };

  const p = new Peripherals(useAppStore(), {
    moveTo: (direction) => {
      switch(direction) {
        case "right":
          if (cache.current.settings.paginated) goRight(!cache.current.reducedMotion, activateImmersiveOnAction);
          break;
        case "left":
          if (cache.current.settings.paginated) goLeft(!cache.current.reducedMotion, activateImmersiveOnAction);
          break;
        case "up":
        case "home":
          // Home should probably go to first column/page of chapter in reflow?
          if (!cache.current.settings.paginated) activateImmersiveOnAction();
          break;
        case "down":
        case "end":
          // End should probably go to last column/page of chapter in reflow?
          if (!cache.current.settings.paginated) activateImmersiveOnAction();
          break;
        default:
          break;
      }
    },
    goProgression: (shiftKey) => {
      if (cache.current.settings?.paginated) {
        shiftKey 
          ? goBackward(!cache.current.reducedMotion, activateImmersiveOnAction) 
          : goForward(!cache.current.reducedMotion, activateImmersiveOnAction);
      } else {
        activateImmersiveOnAction();
      }
    },
    toggleAction: (actionKey) => {  
      switch (actionKey) {
        case ActionKeys.fullscreen:
          fs.handleFullscreen();
          break;
        case ActionKeys.settings:
        case ActionKeys.toc:
          dispatch(toggleActionOpen({
            key: actionKey
          }))
          break;
        case ActionKeys.jumpToPosition:
        default:
          break
      }
    }
  });

  const listeners: EpubNavigatorListeners = {
    frameLoaded: async function (_wnd: Window): Promise<void> {
      await initReadingEnv();
      // Warning: this is using navigator’s internal methods that will become private, do not rely on them
      // See https://github.com/readium/playground/issues/25
      const _cframes = getCframes();
      _cframes?.forEach(
        (frameManager: FrameManager | FXLFrameManager | undefined) => {
          if (frameManager) p.observe(frameManager.window);
        }
      );
      p.observe(window);
    },
    positionChanged: async function (locator: Locator): Promise<void> {
      window.focus();

      // This can’t be relied upon with FXL to handleProgression at the moment,
      // Only reflowable snappers will register the "progress" event
      // that triggers positionChanged every time the progression changes
      // in FXL, only first_visible_locator will, which is why it triggers when
      // the spread has not been shown yet, but won’t if you just slid to them.
      if (navLayout() === EPUBLayout.reflowable) {
        // Due to the lack of injection API we need to force scroll 
        // to mount/unmount scroll affordances ATM
        
        const debouncedHandleProgression = debounce(
          async () => {
            // TMP: To mount/unmount scroll affordances in the absence of the injection API. 
            // We need to debounce because of swipe, which has a 150ms animation in Column Snapper, 
            // otherwise the iframe will stay hidden since we must change the ReadingProgression,
            // that requires re-loading the frame pool
            const currentLocator = localData.get(localDataKey.current);
            if (currentLocator?.href !== locator.href) {
              await applyScroll(!cache.current.settings.paginated);
            }
            //NYU Press set chapter href in redux, used in NYUReaderFooter
            dispatch(setChapterHref(locator.href)); 
            handleProgression(locator);
            localData.set(localDataKey.current, locator);
          }, 250);
        debouncedHandleProgression();
      }
    },
    tap: function (_e: FrameClickEvent): boolean {
      handleTap(_e);
      return true;
    },
    click: function (_e: FrameClickEvent): boolean {
      return true;
    },
    zoom: function (_scale: number): void {},
    miscPointer: function (_amount: number): void {},
    customEvent: function (_key: string, _data: unknown): void {},
    handleLocator: function (locator: Locator): boolean {
      const href = locator.href;

      // Scroll Affordances
      // That’s not great though
      if (href.includes(CUSTOM_SCHEME)) {
        if (href.includes(ScrollActions.prev)) {
          goLeft(false, () => { scrollBackTo(RSPrefs.scroll.backTo) }); 
        } else if (href.includes(ScrollActions.next)) {
          goRight(false, () => { scrollBackTo(ScrollBackTo.top) });
        }
      } else if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        if (confirm(`Open "${href}" ?`)) window.open(href, "_blank");
      } else {
        console.warn("Unhandled locator", locator);
      }
      return false;
    },
    textSelected: function (_selection: BasicTextSelection): void {},
  };

  const applyConstraint = useCallback(async (value: number) => {
    await submitPreferences({
      constraint: value
    })
  }, [submitPreferences]);

  // Handling side effects on Navigator

  useEffect(() => {
    cache.current.settings.paginated = isPaged;

    const handleConstraint = async (value: number) => {
      await applyConstraint(value)
    }

    if (isPaged) {
      handleConstraint(arrowsOccupySpace ? arrowsWidth.current : 0)
        .catch(console.error);
    } else {
      handleConstraint(0)
        .catch(console.error);
    }
  }, [isPaged, arrowsOccupySpace, applyConstraint]);

  useEffect(() => {
    cache.current.settings.align = align;
  }, [align]);

  useEffect(() => {
    cache.current.settings.colCount = colCount;
  }, [colCount]);

  useEffect(() => {
    cache.current.settings.fontFamily = fontFamily;
  }, [fontFamily]);

  useEffect(() => {
    cache.current.settings.fontSize = fontSize;
  }, [fontSize]);

  useEffect(() => {
    cache.current.settings.fontWeight = fontWeight;
  }, [fontWeight]);

  useEffect(() => {
    cache.current.settings.hyphens = hyphens;
  }, [hyphens]);

  useEffect(() => {
    cache.current.settings.layoutStrategy = layoutStrategy;
  }, [layoutStrategy]);

  useEffect(() => {
    cache.current.settings.letterSpacing = letterSpacing;
  }, [letterSpacing]);

  useEffect(() => {
    cache.current.settings.lineHeight = lineHeight;
  }, [lineHeight]);

  useEffect(() => {
    cache.current.settings.lineLength = lineLength;
  }, [lineLength]);

  useEffect(() => {
    cache.current.settings.normalizeText = normalizeText;
  }, [normalizeText]);

  useEffect(() => {
    cache.current.settings.paraIndent = paraIndent;
  }, [paraIndent]);

  useEffect(() => {
    cache.current.settings.paraSpacing = paraSpacing;
  }, [paraSpacing]);

  useEffect(() => {
    cache.current.settings.theme = theme;
  }, [theme]);

  useEffect(() => {
    cache.current.settings.wordSpacing = wordSpacing;
  }, [wordSpacing]);

  useEffect(() => {
    cache.current.arrowsOccupySpace = arrowsOccupySpace || false;
  }, [arrowsOccupySpace]);

  useEffect(() => {
    cache.current.reducedMotion = reducedMotion;
  }, [reducedMotion]);

  // Theme can also change on colorScheme change so
  // we have to handle this side-effect but we can’t
  // from the ReadingDisplayTheme component since it
  // would have to be mounted for this to work
  useEffect(() => {
    if (cache.current.colorScheme !== colorScheme) {
      cache.current.colorScheme = colorScheme;
    }

    // Protecting against re-applying on theme change
    if (theme !== ThemeKeys.auto && previousTheme !== theme) return;

    const applyCurrentTheme = async () => {
      const themeProps = listThemeProps(theme, colorScheme);
      await submitPreferences(themeProps);
      dispatch(setTheme(theme));
    };

    applyCurrentTheme()
      .catch(console.error);
  }, [theme, previousTheme, colorScheme, listThemeProps, submitPreferences, dispatch]);

  useEffect(() => {
    RSPrefs.direction && dispatch(setDirection(RSPrefs.direction));
    dispatch(setPlatformModifier(getPlatformModifier()));
  }, [dispatch]);

  useEffect(() => {
    const handleConstraint = async () => {
      await applyConstraint(arrowsOccupySpace ? arrowsWidth.current : 0)
    }
    handleConstraint()
      .catch(console.error);
  }, [arrowsOccupySpace, applyConstraint]);

  useEffect(() => {
    const fetcher: Fetcher = new HttpFetcher(undefined, selfHref);
    const manifest = Manifest.deserialize(rawManifest)!;
    manifest.setSelfLink(selfHref);

    publication.current = new Publication({
      manifest: manifest,
      fetcher: fetcher,
    });    

    dispatch(setRTL(publication.current.metadata.effectiveReadingProgression === ReadingProgression.rtl));
    dispatch(setFXL(publication.current.metadata.getPresentation()?.layout === EPUBLayout.fixed));

    const pubTitle = publication.current.metadata.title.getTranslation("en");
    const author = publication.current.metadata.authors?.items[0].name.getTranslation("en");
    const publisher = publication.current.metadata.publishers?.items[0].name.getTranslation("en");
    const identifier = publication.current.metadata.identifier;
    const coverLink = publication.current.manifest.resources?.findWithRel("cover") as Link | undefined;
    const contentsLink = publication.current.manifest.resources?.findWithRel("contents") as Link | undefined;
    const a11yInfo = extractAccessibilityInfo(publication.current);

    //gets the url of a resource from a link
    const getResourceUrl = async (link?: Link): Promise<string | null> => {
      if (!link) {
        return null;
      }
      const resource = await publication.current!.get(link);
      const plainResource = JSON.parse(JSON.stringify(resource));
      return plainResource.url;
    };

    //get the url of the book cover
    getResourceUrl(coverLink).then((coverUrl) => {
      dispatch(setCoverUrl(coverUrl));
    });

    //get the url of the table of contents and extract the page-list
    getResourceUrl(contentsLink).then((contentsUrl) => {
      if (contentsUrl) {
        //the nav document page-list may not have href values with the full path needed for EpubNavigator
        //so pass in a samplePath from the fist reading list item to rebase the path if needed 
        const readingOrderPath = publication.current!.manifest.readingOrder.items[0].href;
        getPageListItems(contentsUrl,readingOrderPath).then((items) => {
          dispatch(setPageList(items));
        });
      }
    });

    dispatch(setRunningHead(pubTitle));
    dispatch(setProgression({ currentPublication: pubTitle }));
    dispatch(setPublishers(publisher));
    dispatch(setAuthors(author));
    dispatch(setIdentifier(identifier));
    dispatch(setA11yInfo(a11yInfo));
    let positionsList: Locator[] | undefined;

    // Create a heirarchical tree structure for the table of contents
    // where each entry has a unique id property and store this on the publication state
    let idCounter = 0;
    const idGenerator = () => `toc-${++idCounter}`;
    const tocTree = createTocTree(publication.current.tableOfContents?.items || [], idGenerator);
    dispatch(setTocTree(tocTree));

    const fetchPositions = async () => {
      positionsList = await publication.current?.positionsFromManifest();
      if (positionsList && positionsList.length > 0) dispatch(setProgression( { totalPositions: positionsList.length }));
    };

    fetchPositions()
      .catch(console.error)
      .then(() => {
        const initialPosition = localData.get(localDataKey.current);
        const initialConstraint = cache.current.arrowsOccupySpace ? arrowsWidth.current : 0;
        const themeProps = listThemeProps(cache.current.settings.theme, cache.current.colorScheme);

         //NYU Press if a locatorParam was passed as a deeplink, send the reader there
        if (locatorParam !== "") {  
          const deepLinkData = JSON.parse(decodeURIComponent(locatorParam));
          const deepLinkLocator = Locator.deserialize(deepLinkData);
  
          EpubNavigatorLoad({
            container: container.current, 
          publication: publication.current!,
          listeners: listeners, 
          positionsList: positionsList,
          initialPosition: initialPosition,
          preferences: {
            pageGutter: RSPrefs.typography.pageGutter,
            optimalLineLength: RSPrefs.typography.optimalLineLength,
            minimalLineLength: RSPrefs.typography.minimalLineLength,
            maximalLineLength: RSPrefs.typography.maximalLineLength,
            constraint: initialConstraint,
            layoutStrategy: RSPrefs.typography.layoutStrategy as unknown as LayoutStrategy,
            ...themeProps
          },
          localDataKey: localDataKey.current,
            }, () =>  goDeepLink(deepLinkLocator));
      
        } else {
  
          EpubNavigatorLoad({
            container: container.current, 
          publication: publication.current!,
          listeners: listeners, 
          positionsList: positionsList,
          initialPosition: initialPosition,
          preferences: {
            pageGutter: RSPrefs.typography.pageGutter,
            optimalLineLength: RSPrefs.typography.optimalLineLength,
            minimalLineLength: RSPrefs.typography.minimalLineLength,
            maximalLineLength: RSPrefs.typography.maximalLineLength,
            constraint: initialConstraint,
            layoutStrategy: RSPrefs.typography.layoutStrategy as unknown as LayoutStrategy,
            ...themeProps
          },
          localDataKey: localDataKey.current,
          }, () => p.observe(window));

          //NYU Press fixes init position bug TODO: remove when fixed in navigator
          go(initialPosition , true, () => {});
        }
      });

    return () => {
      EpubNavigatorDestroy(() => p.destroy());
    };
  }, [rawManifest, selfHref]);

   //NYU Press if a locatorParam was passed as a deeplink, send the reader there
  const goDeepLink = (deepLinkLocator:Locator | undefined) => {
    p.observe(window);
    setTimeout(() => {
      if (deepLinkLocator) {
        go(deepLinkLocator! , true, () => {});

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
                  locator: deepLinkLocator,
                },
              } as DecoratorRequest);
            }
          });
        }
      }
    }, 300);
  }

  return (
    <>
    <I18nProvider locale={  RSPrefs.locale  }>
    <main>
      <ReaderWithDock>
        <div id="reader-main">
          <ReaderHeader />

        { isPaged 
          ? <nav className={ arrowStyles.container } id={ arrowStyles.left }>
              <ArrowButton 
                direction="left" 
                occupySpace={ arrowsOccupySpace || false }
                disabled={ atPublicationStart } 
                onPressCallback={ () => goLeft(!reducedMotion, activateImmersiveOnAction) }
              />
          </nav> 
          : <></> }

          <article id="wrapper" aria-label={ Locale.reader.app.publicationWrapper }>
            <div id="container" ref={ container }></div>
          </article>

        { isPaged 
          ? <nav className={ arrowStyles.container } id={ arrowStyles.right }>
              <ArrowButton 
                direction="right" 
                occupySpace={ arrowsOccupySpace || false }
                disabled={ atPublicationEnd } 
                onPressCallback={ () => goRight(!reducedMotion, activateImmersiveOnAction) }
              />
            </nav> 
          : <></> }

        { isPaged ? <ReaderFooter /> : <></> }
        </div>
    </ReaderWithDock>
  </main>
  </I18nProvider>
  </>
)};