import { useCallback } from "react";

import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { 
  defaultParaIndent, 
  IAdvancedDisplayProps, 
  SettingsRangeVariant 
} from "@/models/settings";

import { NumberFieldWrapper } from "./Wrappers/NumberFieldWrapper";
import { SliderWrapper } from "./Wrappers/SliderWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setParaIndent, setPublisherStyles } from "@/lib/settingsReducer";

export const ReadingDisplayParaIndent: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const paraIndent = useAppSelector(state => state.settings.paraIndent);
  const paraIndentRangeConfig = {
      variant: RSPrefs.settings.spacing?.paraIndent?.variant ?? defaultParaIndent.variant,
      range: RSPrefs.settings.spacing?.paraIndent?.range ?? defaultParaIndent.range,
      step: RSPrefs.settings.spacing?.paraIndent?.step ?? defaultParaIndent.step
    };
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number) => {
    await submitPreferences({
      publisherStyles: false, 
      paragraphIndent: value
    });

    dispatch(setParaIndent(getSetting("paragraphIndent")));
    dispatch(setPublisherStyles(getSetting("publisherStyles")));
  }, [submitPreferences, getSetting, dispatch]);

  return (
    <>
    { paraIndentRangeConfig.variant === SettingsRangeVariant.numberField 
      ? <NumberFieldWrapper 
        standalone={ standalone }
        { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
        defaultValue={ 0 } 
        value={ paraIndent || 0 } 
        onChangeCallback={ async(value) => await updatePreference(value) } 
        label={ Locale.reader.settings.paraIndent.title }
        range={ paraIndentRangeConfig.range }
        step={ paraIndentRangeConfig.step }
        steppers={{
          decrementLabel: Locale.reader.settings.paraIndent.decrease,
          incrementLabel: Locale.reader.settings.paraIndent.increase
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
        value={ paraIndent || 0 } 
        onChangeCallback={ async(value) => await updatePreference(value) } 
        label={ Locale.reader.settings.paraIndent.title }
        range={ paraIndentRangeConfig.range }
        step={ paraIndentRangeConfig.step }
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