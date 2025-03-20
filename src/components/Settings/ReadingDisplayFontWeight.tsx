import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { IAdvancedDisplayProps } from "@/models/settings";
import { fontWeightRangeConfig } from "@readium/navigator";

import MinusIcon from "../assets/icons/remove.svg";
import PlusIcon from "../assets/icons/add.svg";

import { NumberFieldWrapper } from "./Wrappers/NumberFieldWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayFontWeight: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const fontFamily = useAppSelector(state => state.settings.fontFamily);
  const fontWeight = useAppSelector(state => state.settings.fontWeight);

  const { applyFontWeight } = useEpubNavigator();

  return(
    <>
    <NumberFieldWrapper
      { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
      defaultValue={ 400 } 
      value={ fontWeight } 
      onChangeCallback={ async(value) => await applyFontWeight(value) } 
      label={ Locale.reader.settings.fontWeight.title }
      range={ fontWeightRangeConfig.range }
      step={ fontWeightRangeConfig.step }
      steppers={{
        decrementIcon: MinusIcon,
        decrementLabel: Locale.reader.settings.fontWeight.decrease,
        incrementIcon: PlusIcon,
        incrementLabel: Locale.reader.settings.fontWeight.increase
      }}
      wheelDisabled={ true }
      virtualKeyboardDisabled={ true }
      disabled={ fontFamily === "publisher" }
      standalone={ standalone }
    /> 
    </>
  )
}