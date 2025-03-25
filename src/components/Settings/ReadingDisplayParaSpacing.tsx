import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { 
  defaultParaSpacing, 
  IAdvancedDisplayProps, 
  SettingsRangeVariant 
} from "@/models/settings";

import { NumberFieldWrapper } from "./Wrappers/NumberFieldWrapper";
import { SliderWrapper } from "./Wrappers/SliderWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayParaSpacing: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const paraSpacing = useAppSelector(state => state.settings.paraSpacing);
  const paraSpacingRangeConfig = {
    variant: RSPrefs.settings.spacing?.paraSpacing?.variant ?? defaultParaSpacing.variant,
    range: RSPrefs.settings.spacing?.paraSpacing?.range ?? defaultParaSpacing.range,
    step: RSPrefs.settings.spacing?.paraSpacing?.step ?? defaultParaSpacing.step
  };

  const { applyParaSpacing } = useEpubNavigator();

  return (
    <>
    { paraSpacingRangeConfig.variant === SettingsRangeVariant.numberField 
      ? <NumberFieldWrapper 
        standalone={ standalone }
        { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
        defaultValue={ 0 } 
        value={ paraSpacing || 0 } 
        onChangeCallback={ async(value) => await applyParaSpacing(value) } 
        label={ Locale.reader.settings.paraSpacing.title }
        range={ paraSpacingRangeConfig.range }
        step={ paraSpacingRangeConfig.step }
        steppers={{
          decrementLabel: Locale.reader.settings.paraSpacing.decrease,
          incrementLabel: Locale.reader.settings.paraSpacing.increase
        }}
        format={{
          signDisplay: "exceptZero",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }} 
        isWheelDisabled={ true }
        virtualKeyboardDisabled={ true }
      />
      : <SliderWrapper
        standalone={ standalone }
        { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
        defaultValue={ 0 } 
        value={ paraSpacing || 0 } 
        onChangeCallback={ async(value) => await applyParaSpacing(value) } 
        label={ Locale.reader.settings.paraSpacing.title }
        range={ paraSpacingRangeConfig.range }
        step={ paraSpacingRangeConfig.step }
        format={{
          signDisplay: "exceptZero",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }}
      /> 
    }
    </>
  )
}