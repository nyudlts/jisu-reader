import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { 
  defaultWordSpacing, 
  IAdvancedDisplayProps, 
  SettingsRangeVariant 
} from "@/models/settings";

import { NumberFieldWrapper } from "./Wrappers/NumberFieldWrapper";
import { SliderWrapper } from "./Wrappers/SliderWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayWordSpacing: React.FC<IAdvancedDisplayProps> = ({ 
  standalone = true
}) => {
  const wordSpacing = useAppSelector(state => state.settings.wordSpacing);
  const wordSpacingRangeConfig = {
    variant: RSPrefs.settings.spacing?.wordSpacing?.variant ?? defaultWordSpacing.variant,
    range: RSPrefs.settings.spacing?.wordSpacing?.range ?? defaultWordSpacing.range,
    step: RSPrefs.settings.spacing?.wordSpacing?.step ?? defaultWordSpacing.step
  };

  const { applyWordSpacing } = useEpubNavigator();

  return (
    <>
    { wordSpacingRangeConfig.variant === SettingsRangeVariant.numberField 
      ? <NumberFieldWrapper 
        standalone={ standalone }
        { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
        defaultValue={ 0 } 
        value={ wordSpacing || 0 } 
        onChangeCallback={ async(value) => await applyWordSpacing(value) } 
        label={ Locale.reader.settings.wordSpacing.title }
        range={ wordSpacingRangeConfig.range }
        step={ wordSpacingRangeConfig.step }
        steppers={{
          decrementLabel: Locale.reader.settings.wordSpacing.decrease,
          incrementLabel: Locale.reader.settings.wordSpacing.increase
        }}
        format={{ style: "percent" }} 
        isWheelDisabled={ true }
        virtualKeyboardDisabled={ true }
      />
      : <SliderWrapper
        standalone={ standalone }
        { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
        defaultValue={ 0 } 
        value={ wordSpacing || 0 } 
        onChangeCallback={ async(value) => await applyWordSpacing(value) } 
        label={ Locale.reader.settings.wordSpacing.title }
        range={ wordSpacingRangeConfig.range }
        step={ wordSpacingRangeConfig.step }
        format={{ style: "percent" }}
      /> 
    }
    </>
  )
}