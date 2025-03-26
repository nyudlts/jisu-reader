import { useCallback } from "react";

import { RSPrefs } from "@/preferences";

import { RSLayoutStrategy } from "@/models/layout";

import Locale from "../../resources/locales/en.json";

import { IAdvancedDisplayProps } from "@/models/settings";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { NumberFieldWrapper } from "./Wrappers/NumberFieldWrapper";

import { ReadingDisplayMaxChars } from "./ReadingDisplayMaxChars";
import { ReadingDisplayMinChars } from "./ReadingDisplayMinChars";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTmpMaxChars, setTmpMinChars } from "@/lib/settingsReducer";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const ReadingDisplayLineLengths: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const colCount = useAppSelector(state => state.settings.colCount);
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const tmpLineLengths = useAppSelector(state => state.settings.tmpLineLengths);
  const min = tmpLineLengths[0];
  const optimal = tmpLineLengths[1];
  const max = tmpLineLengths[2];

  const dispatch = useAppDispatch();

  const { 
    applyLineLengths,
    getLineLengths,
    getLengthStep,
    getLengthRange
  } = useEpubNavigator();

  const lineLengthRangeConfig = {
    range: getLengthRange() || [20, 100],
    step: getLengthStep() || 1
  }

  const handleChange = useCallback(async (type: "min" | "optimal" | "max", value: number) => {
    switch(type) {
      case "min":
        await applyLineLengths([value, optimal, max]);
        dispatch(setTmpMinChars(false));
        break;
      case "optimal":
        await applyLineLengths([min, value, max]);
        break;
      case "max":
        await applyLineLengths([min, optimal, value]);
        dispatch(setTmpMaxChars(false));
        break;
      default:
        break;
    }
  }, [applyLineLengths, min, optimal, max, dispatch]);

  return(
    <>
    <NumberFieldWrapper
      standalone={ standalone }
      { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
      defaultValue={ getLineLengths().minimal || lineLengthRangeConfig.range[0] } 
      value={ tmpLineLengths[0] } 
      onChangeCallback={ async(value) => await handleChange("min", value) } 
      label={ Locale.reader.layoutStrategy.minimalLineLength.title }
      steppers={{
        decrementLabel: Locale.reader.layoutStrategy.minimalLineLength.decrease,
        incrementLabel: Locale.reader.layoutStrategy.minimalLineLength.increase
      }}
      range={ [lineLengthRangeConfig.range[0], optimal || RSPrefs.typography.optimalLineLength] }
      step={ lineLengthRangeConfig.step }
      isDisabled={ layoutStrategy !== RSLayoutStrategy.columns && colCount !== "2" }
    /> 
    <ReadingDisplayMinChars />

    <NumberFieldWrapper
      standalone={ standalone }
      { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
      defaultValue={ getLineLengths().optimal } 
      value={ tmpLineLengths[1] } 
      onChangeCallback={ async(value) => await handleChange("optimal", value) } 
      label={ Locale.reader.layoutStrategy.optimalLineLength.title }
      steppers={{
        decrementLabel: Locale.reader.layoutStrategy.optimalLineLength.decrease,
        incrementLabel: Locale.reader.layoutStrategy.optimalLineLength.increase
      }}
      range={ lineLengthRangeConfig.range }
      step={ lineLengthRangeConfig.step }
    /> 
    
    <NumberFieldWrapper
      standalone={ standalone }
      { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
      defaultValue={ getLineLengths().maximal || lineLengthRangeConfig.range[1] } 
      value={ tmpLineLengths[2] } 
      onChangeCallback={ async(value) => await handleChange("max", value) }
      label={ Locale.reader.layoutStrategy.maximalLineLength.title }
      steppers={{
        decrementLabel: Locale.reader.layoutStrategy.maximalLineLength.decrease,
        incrementLabel: Locale.reader.layoutStrategy.maximalLineLength.increase
      }}
      range={ [optimal || RSPrefs.typography.optimalLineLength, lineLengthRangeConfig.range[1]] }
      step={ lineLengthRangeConfig.step }
      isDisabled={ layoutStrategy !== RSLayoutStrategy.lineLength }
    /> 
    <ReadingDisplayMaxChars />
    </>
  )
}