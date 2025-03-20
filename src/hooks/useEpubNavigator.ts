import { use, useCallback, useMemo, useRef } from "react";

import Locale from "../resources/locales/en.json";
import { RSPrefs } from "@/preferences";

import { ScrollBackTo } from "@/models/preferences";
import { ReadingDisplayAlignOptions, ReadingDisplayFontFamilyOptions, ReadingDisplayLineHeightOptions, RSLayoutStrategy } from "@/models/layout";
import { ColorScheme, ThemeKeys } from "@/models/theme";
import { defaultLineHeights } from "@/models/settings";

import { EPUBLayout, Link, Locator, Publication } from "@readium/shared";
import { EpubNavigator, EpubNavigatorListeners, EpubPreferences, FrameManager, FXLFrameManager, IEpubDefaults, IEpubPreferences, LayoutStrategy, TextAlignment, Theme } from "@readium/navigator";

import { ScrollAffordance } from "@/helpers/scrollAffordance";
import { localData } from "@/helpers/localData";

import { useAppDispatch } from "@/lib/hooks";
import { setProgression } from "@/lib/publicationReducer";
import { setPaged } from "@/lib/readerReducer";
import { setAlign, setColCount, setFontFamily, setFontSize, setFontWeight, setHyphens, setLayoutStrategy, setLineHeight } from "@/lib/settingsReducer";
import { setTheme } from "@/lib/themeReducer";

type cbb = (ok: boolean) => void;

// Module scoped, singleton instance of navigator
let navigatorInstance: EpubNavigator | null = null;

export interface IEpubNavigatorConfig {
  container: HTMLDivElement | null;
  publication: Publication;
  listeners: EpubNavigatorListeners;
  positionsList?: Locator[];
  initialPosition?: Locator;
  preferences?: IEpubPreferences;
  defaults?: IEpubDefaults;
  localDataKey: string;
}

export const useEpubNavigator = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const containerParent = useRef<HTMLElement | null>(null);
  const publication = useRef<Publication | null>(null);
  const localDataKey = useRef<string | null>(null);

  const scrollAffordanceTop = useRef(new ScrollAffordance({ pref: RSPrefs.scroll.topAffordance, placement: "top" }));
  const scrollAffordanceBottom = useRef(new ScrollAffordance({ pref: RSPrefs.scroll.bottomAffordance, placement: "bottom" }));

  const dispatch = useAppDispatch();

  // Warning: this is using an internal member that will become private, do not rely on it
  // See https://github.com/readium/playground/issues/25
  const mountScroll = useCallback(() => {
    navigatorInstance?._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
      if (frameManager) {        
        scrollAffordanceTop.current.render(frameManager.window.document);
        scrollAffordanceBottom.current.render(frameManager.window.document)
      }
    });
  }, []);

  // Warning: this is using an internal member that will become private, do not rely on it
  // See https://github.com/readium/playground/issues/25
  const unmountScroll = useCallback(() => {
    navigatorInstance?._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
      if (frameManager) {
        scrollAffordanceTop.current.destroy(frameManager.window.document);
        scrollAffordanceBottom.current.destroy(frameManager.window.document)
      }
    });
  }, []);

  const applyScroll = useCallback(async (scroll: boolean) => {
    if (navigatorInstance === null || navigatorInstance.layout === EPUBLayout.fixed) return;
    if (!scroll) unmountScroll();
    await navigatorInstance?.submitPreferences(new EpubPreferences({
      scroll: scroll
    }));
    if (scroll) mountScroll();
    dispatch(setPaged(!scroll));
  }, [dispatch, mountScroll, unmountScroll]);

  const listThemeProps = useCallback((t: ThemeKeys, colorScheme?: ColorScheme) => {
    if (t === ThemeKeys.auto && colorScheme) {
      t = colorScheme === ColorScheme.dark ? ThemeKeys.dark : ThemeKeys.light;
    }

    let themeProps = {};

    switch(t) {
      case ThemeKeys.auto:
        break;
      case ThemeKeys.light:
        themeProps = {
          theme: Theme.day,
          backgroundColor: null,
          textColor: null,
          linkColor: null,
          selectionBackgroundColor: null,
          selectionTextColor: null,
          visitedColor: null
        };
        break;
      case ThemeKeys.sepia:
        themeProps = {
          theme: Theme.sepia,
          backgroundColor: null,
          textColor: null,
          linkColor: null,
          selectionBackgroundColor: null,
          selectionTextColor: null,
          visitedColor: null
        };
        break;
      case ThemeKeys.dark:
        themeProps = {
          theme: Theme.night,
          backgroundColor: null,
          textColor: null,
          linkColor: null,
          selectionBackgroundColor: null,
          selectionTextColor: null,
          visitedColor: null
        };
        break;
      default:
        themeProps = {
          theme: Theme.custom,
          backgroundColor: RSPrefs.theming.themes.keys[t].background,
          textColor: RSPrefs.theming.themes.keys[t].text,
          linkColor: RSPrefs.theming.themes.keys[t].link,
          selectionBackgroundColor: RSPrefs.theming.themes.keys[t].select,
          selectionTextColor: RSPrefs.theming.themes.keys[t].onSelect,
          visitedColor: RSPrefs.theming.themes.keys[t].visited
        };
        break;
    }
    return themeProps;
  }, []);

  const applyTheme = useCallback(async (t: ThemeKeys, colorScheme?: ColorScheme) => {
    const themeProps = listThemeProps(t, colorScheme);
    await navigatorInstance?.submitPreferences(new EpubPreferences(themeProps));
    dispatch(setTheme(t));
  }, [dispatch, listThemeProps]);

  const applyConstraint = useCallback(async (constraint: number) => {
    await navigatorInstance?.submitPreferences(new EpubPreferences({
      constraint: constraint
    }))
  }, []);

  const applyColCount = useCallback(async (count: string) => {    
    const colCount = count === "auto" ? null : Number(count);
    
    await navigatorInstance?.submitPreferences(new EpubPreferences({
      columnCount: colCount
    }));

    dispatch(setColCount(count));
  }, [dispatch]);

  const applyLayoutStrategy = useCallback(async (strategy: RSLayoutStrategy) => {
    await navigatorInstance?.submitPreferences(new EpubPreferences({
      layoutStrategy: strategy as unknown as LayoutStrategy
    }));

    dispatch(setLayoutStrategy(strategy));
  }, [dispatch]);

  // TMP for testing purposes
  const nullifyMaxChars = useCallback(async (b: boolean) => {
    await navigatorInstance?.submitPreferences(new EpubPreferences({
      maximalLineLength: b ? null : RSPrefs.typography.maximalLineLength
    }));
  }, []);

  const applyZoom = useCallback(async (value: number) => {
    await navigatorInstance?.submitPreferences(new EpubPreferences({
      fontSize: value
    }));
    dispatch(setFontSize(navigatorInstance?.settings.fontSize));
  }, [dispatch]);

  const getSizeStep = useCallback(() => {
    const editor = navigatorInstance?.preferencesEditor;
    if (editor) {
      return editor.fontSize.step;
    }
    return null;
  }, []);

  const getSizeRange = useCallback(() => {
    const editor = navigatorInstance?.preferencesEditor;
    if (editor) {
      return editor.fontSize.supportedRange;
    }
    return null;
  }, []);

  const applyFontWeight = useCallback(async (value: number) => {
    await navigatorInstance?.submitPreferences(new EpubPreferences({
      fontWeight: value
    }));
    dispatch(setFontWeight(value));
  }, [dispatch]);

  const applyFontFamily = useCallback(async (fontFamily: { id: keyof typeof ReadingDisplayFontFamilyOptions, value: string | null }) => {
    await navigatorInstance?.submitPreferences(new EpubPreferences({
      fontFamily: fontFamily.value
    }));
    dispatch(setFontFamily(fontFamily.id));
  }, [dispatch]);

  const handleProgression = useCallback((locator: Locator) => {
    const relativeRef = locator.title || Locale.reader.app.progression.referenceFallback;
      
    dispatch(setProgression( { currentPositions: navigatorInstance?.currentPositionNumbers, relativeProgression: locator.locations.progression, currentChapter: relativeRef, totalProgression: locator.locations.totalProgression }));
  }, [dispatch]);

  const applyLineHeight = useCallback(async (value: string) => {
    const computedValue: number = RSPrefs.settings.spacing?.lineHeight?.[value as ReadingDisplayLineHeightOptions] ?? 
          (value === ReadingDisplayLineHeightOptions.small 
            ? defaultLineHeights[ReadingDisplayLineHeightOptions.small] 
            : value === ReadingDisplayLineHeightOptions.medium 
              ? defaultLineHeights[ReadingDisplayLineHeightOptions.medium] 
              : defaultLineHeights[ReadingDisplayLineHeightOptions.large]
          );

    await navigatorInstance?.submitPreferences(new EpubPreferences({
      publisherStyles: false,
      lineHeight: computedValue
    }));
    dispatch(setLineHeight(value));
  }, [dispatch]);

  const applyTextAlign = useCallback(async (value: ReadingDisplayAlignOptions) => {
    const textAlign: TextAlignment | null = value === ReadingDisplayAlignOptions.publisher 
      ? null 
      : value === ReadingDisplayAlignOptions.start 
        ? TextAlignment.start 
        : TextAlignment.justify;

    const hyphens = textAlign === null 
      ? null 
      : (navigatorInstance?.settings.hyphens ?? textAlign === TextAlignment.justify);

    await navigatorInstance?.submitPreferences(new EpubPreferences({
      publisherStyles: false,
      textAlign: textAlign,
      hyphens: hyphens
    }));
    dispatch(setAlign(value));
    dispatch(setHyphens(hyphens));
  }, [dispatch]);

  const applyHyphens = useCallback(async (value: boolean) => {
    await navigatorInstance?.submitPreferences(new EpubPreferences({
      publisherStyles: false,
      hyphens: value
    }));
    dispatch(setHyphens(value));
  }, [dispatch]);

  // Warning: this is using an internal member that will become private, do not rely on it
  // See https://github.com/readium/playground/issues/25
  const scrollBackTo = useCallback((position: ScrollBackTo) => {
    if (position !== ScrollBackTo.untouched) {
      navigatorInstance?._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
        if (frameManager) {
          const scrollingEl = frameManager.window.document.scrollingElement;
          if (position === ScrollBackTo.top) {
            scrollingEl?.scrollTo(0, 0);
          } else {
            scrollingEl?.scrollTo(0, scrollingEl.scrollHeight);
          }
        }
      });
    }
  }, []);

  // [TMP] Working around positionChanged not firing consistently for FXL
  // We’re observing the FXLFramePoolManager spine div element’s style
  // and checking whether its translate3d has changed.
  // Sure IntersectionObserver should be the obvious one to use here,
  // observing iframes instead of the style attribute on the spine element
  // but there’s additional complexity to handle as a spread = 2 iframes
  // And keeping in sync while the FramePool is re-aligning on resize can be suboptimal
  const FXLPositionChanged = useMemo(() => new MutationObserver((mutationsList: MutationRecord[]) => {
    for (const mutation of mutationsList) {
      const re = /translate3d\(([^)]+)\)/;
      const newVal = (mutation.target as HTMLElement).getAttribute(mutation.attributeName as string);
      const oldVal = mutation.oldValue;
      if (newVal?.split(re)[1] !== oldVal?.split(re)[1]) {
        const locator = navigatorInstance?.currentLocator;
        if (locator) {
          handleProgression(locator);
          if (localDataKey.current) localData.set(localDataKey.current, locator)
        }
      }
    }
  }), [handleProgression]);

  const EpubNavigatorLoad = useCallback((config: IEpubNavigatorConfig, cb: Function) => {
    if (config.container) {
      container.current = config.container;
      containerParent.current = container.current? container.current.parentElement : null;
      
      publication.current = config.publication;
      localDataKey.current = config.localDataKey;

      navigatorInstance = new EpubNavigator(
        config.container, 
        config.publication, 
        config.listeners, 
        config.positionsList, 
        config.initialPosition, 
        { preferences: config.preferences || {}, defaults: config.defaults || {} }
      );

      navigatorInstance.load().then(() => {
        cb();

        if (navigatorInstance?.layout === EPUBLayout.fixed) {
          // @ts-ignore
          FXLPositionChanged.observe((navigatorInstance?.pool.spineElement as HTMLElement), {
            attributeFilter: ["style"], 
            attributeOldValue: true
          });
        }
      });
    }
  }, [FXLPositionChanged]);

  const EpubNavigatorDestroy = useCallback((cb: Function) => {
    cb();

    if (navigatorInstance?.layout === EPUBLayout.fixed) {
      FXLPositionChanged.disconnect();
    }
    navigatorInstance?.destroy;
  }, [FXLPositionChanged]);

  const goRight = useCallback((animated: boolean, callback: cbb) => {
    navigatorInstance?.goRight(animated, callback);
  }, []);

  const goLeft = useCallback((animated: boolean, callback: cbb) => {
    navigatorInstance?.goLeft(animated, callback)
  }, []);

  const goBackward = useCallback((animated: boolean, callback: cbb) => {
    navigatorInstance?.goBackward(animated, callback);
  }, []);

  const goForward = useCallback((animated: boolean, callback: cbb) => {
    navigatorInstance?.goForward(animated, callback);
  }, []);

  const goLink = useCallback((link: Link, animated: boolean, callback: cbb) => {
    navigatorInstance?.goLink(link, animated, callback);
  }, []);

  const go = useCallback((locator: Locator, animated: boolean, callback: cbb) => {
    navigatorInstance?.go(locator, animated, callback);
  }, []);

  const navLayout = useCallback(() => {
    return navigatorInstance?.layout;
  }, []);

  const currentLocator = useCallback(() => {
    return navigatorInstance?.currentLocator;
  }, []);

  // Warning: this is an internal member that will become private, do not rely on it
  // See https://github.com/readium/playground/issues/25
  const getCframes = useCallback(() => {
    return navigatorInstance?._cframes;
  }, []);

  return { 
    EpubNavigatorLoad, 
    EpubNavigatorDestroy, 
    goRight, 
    goLeft, 
    goBackward, 
    goForward,
    goLink, 
    go, 
    applyScroll,
    scrollBackTo, 
    listThemeProps, 
    applyTheme, 
    applyConstraint, 
    applyColCount, 
    applyLayoutStrategy,
    applyFontWeight,
    applyFontFamily, 
    applyLineHeight,
    applyTextAlign, 
    applyHyphens, 
    nullifyMaxChars,
    applyZoom,
    getSizeStep, 
    getSizeRange,
    handleProgression,
    navLayout, 
    currentLocator,
    getCframes
  }
}