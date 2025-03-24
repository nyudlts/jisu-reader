import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { IAdvancedDisplayProps } from "@/models/settings";
import { fontWeightRangeConfig } from "@readium/navigator";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppSelector } from "@/lib/hooks";
import { SliderWrapper } from "./Wrappers/SliderWrapper";

export const ReadingDisplayFontWeight: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const fontFamily = useAppSelector(state => state.settings.fontFamily);
  const fontWeight = useAppSelector(state => state.settings.fontWeight);

  const { applyFontWeight } = useEpubNavigator();

  return(
    <>
    <SliderWrapper
      { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
      defaultValue={ 400 } 
      value={ fontWeight } 
      onChangeCallback={ async(value) => await applyFontWeight(value) } 
      label={ Locale.reader.settings.fontWeight.title }
      range={ fontWeightRangeConfig.range }
      step={ fontWeightRangeConfig.step }
      isDisabled={ fontFamily === "publisher" }
      standalone={ standalone }
    /> 
    </>
  )
}