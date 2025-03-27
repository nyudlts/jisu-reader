import { useCallback, useRef } from "react";

import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { defaultLineHeights, IAdvancedDisplayProps } from "@/models/settings";
import { ReadingDisplayLineHeightOptions } from "@/models/layout";

import { SwitchWrapper } from "./Wrappers/SwitchWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setPublisherStyles } from "@/lib/settingsReducer";

export const ReadingDisplayPublisherStyles: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const publisherStyles = useAppSelector(state => state.settings.publisherStyles);

  const lineHeight = useAppSelector(state => state.settings.lineHeight);
  const paraIndent = useAppSelector(state => state.settings.paraIndent);
  const paraSpacing = useAppSelector(state => state.settings.paraSpacing);
  const letterSpacing = useAppSelector(state => state.settings.letterSpacing);
  const wordSpacing = useAppSelector(state => state.settings.wordSpacing);

  const dispatch = useAppDispatch();

  const lineHeightOptions = useRef({
    [ReadingDisplayLineHeightOptions.publisher]: null,
    [ReadingDisplayLineHeightOptions.small]: RSPrefs.settings.spacing?.lineHeight?.[ReadingDisplayLineHeightOptions.small] || defaultLineHeights[ReadingDisplayLineHeightOptions.small],
    [ReadingDisplayLineHeightOptions.medium]: RSPrefs.settings.spacing?.lineHeight?.[ReadingDisplayLineHeightOptions.medium] || defaultLineHeights[ReadingDisplayLineHeightOptions.medium],
    [ReadingDisplayLineHeightOptions.large]: RSPrefs.settings.spacing?.lineHeight?.[ReadingDisplayLineHeightOptions.large] || defaultLineHeights[ReadingDisplayLineHeightOptions.large],
  });

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (isSelected: boolean) => {
    const values = isSelected ? 
    {
      lineHeight: null,
      paraIndent: null,
      paraSpacing: null,
      letterSpacing: null,
      wordSpacing: null,
      publisherStyles: true
    } : 
    {
      lineHeight: lineHeight === ReadingDisplayLineHeightOptions.publisher 
        ? null 
        : lineHeightOptions.current[lineHeight as keyof typeof ReadingDisplayLineHeightOptions],
      paraIndent,
      paraSpacing,
      letterSpacing,
      wordSpacing,
      publisherStyles: false
    };
    await submitPreferences(values);

    dispatch(setPublisherStyles(getSetting("publisherStyles")));
  }, [submitPreferences, getSetting, dispatch, lineHeight, paraIndent, paraSpacing, letterSpacing, wordSpacing]);

  return(
    <>
    <SwitchWrapper 
      { ...(standalone ? { 
        className: settingsStyles.readerSettingsGroup
      } : {}) }
      label={ Locale.reader.settings.publisherStyles.label }
      onChangeCallback={ async (isSelected: boolean) => await updatePreference(isSelected) }
      isSelected={ publisherStyles }
    />
    </>
  )
}