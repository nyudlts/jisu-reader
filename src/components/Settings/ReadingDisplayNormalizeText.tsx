import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { IAdvancedDisplayProps } from "@/models/settings";

import { SwitchWrapper } from "./Wrappers/SwitchWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { useAppSelector } from "@/lib/hooks";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const ReadingDisplayNormalizeText: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const normalizeText = useAppSelector(state => state.settings.normalizeText);

  const { applyNormalizeText } = useEpubNavigator();

  return(
    <>
    <SwitchWrapper 
      { ...(standalone ? { 
        className: settingsStyles.readerSettingsGroup, 
        heading: Locale.reader.settings.normalizeText.title 
      } : {}) }
      label={ Locale.reader.settings.normalizeText.label }
      onChangeCallback={ async (isSelected: boolean) => await applyNormalizeText(isSelected) }
      isSelected={ normalizeText ?? false }
    />
    </>
  )
}