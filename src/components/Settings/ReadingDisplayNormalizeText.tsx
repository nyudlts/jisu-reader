import { useCallback, useEffect } from "react";

import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { IAdvancedDisplayProps } from "@/models/settings";

import { SwitchWrapper } from "./Wrappers/SwitchWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setNormalizeText } from "@/lib/settingsReducer";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const ReadingDisplayNormalizeText: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const normalizeText = useAppSelector(state => state.settings.normalizeText);
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: boolean) => {
    await submitPreferences({ textNormalization: value });

    dispatch(setNormalizeText(getSetting("textNormalization")));
  }, [submitPreferences, getSetting, dispatch]);

  return(
    <>
    <SwitchWrapper 
      { ...(standalone ? { 
        className: settingsStyles.readerSettingsGroup, 
        heading: Locale.reader.settings.normalizeText.title 
      } : {}) }
      label={ Locale.reader.settings.normalizeText.label }
      onChangeCallback={ async (isSelected: boolean) => await updatePreference(isSelected) }
      isSelected={ normalizeText ?? false }
    />
    </>
  )
}