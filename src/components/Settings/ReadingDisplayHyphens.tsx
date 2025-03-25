import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { IAdvancedDisplayProps } from "@/models/settings";
import { ReadingDisplayAlignOptions } from "@/models/layout";

import { SwitchWrapper } from "./Wrappers/SwitchWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppSelector } from "@/lib/hooks";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const ReadingDisplayHyphens: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const hyphens = useAppSelector(state => state.settings.hyphens);
  const textAlign = useAppSelector(state => state.settings.align);

  const { applyHyphens } = useEpubNavigator();

  return(
    <>
    <SwitchWrapper 
      { ...(standalone ? { 
        className: settingsStyles.readerSettingsGroup, 
        heading: Locale.reader.settings.hyphens.title 
      } : {}) }
      label={ Locale.reader.settings.hyphens.label }
      onChangeCallback={ async (isSelected: boolean) => await applyHyphens(isSelected) }
      isSelected={ hyphens ?? false }
      isDisabled={ textAlign === ReadingDisplayAlignOptions.publisher }
    />
    </>
  )
}