import { useEffect } from "react";

import Locale from "../../resources/locales/en.json";

import { IAdvancedDisplayProps } from "@/models/settings";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { RangeSliderWrapper } from "./Wrappers/RangeSliderWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { usePrevious } from "@/hooks/usePrevious";

import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayLineLength: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const lineLength = useAppSelector(state => state.settings.lineLength);
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const previousStrategy = usePrevious(layoutStrategy);
  const colCount = useAppSelector(state => state.settings.colCount);
  const previousColCount = usePrevious(colCount);

  const { 
    applyLineLength,
    getLengthStep,
    getLengthRange,
    getBaseLength
  } = useEpubNavigator();

  const lineLengthRangeConfig = {
    range: getLengthRange() || [20, 100],
    step: getLengthStep() || 1
  }

  useEffect(() => {
    if (previousStrategy === layoutStrategy) return;
        
    const applyRefLineLength = async () => {
      await applyLineLength(getBaseLength());
    };  
    applyRefLineLength();
  }, [layoutStrategy, previousStrategy, applyLineLength, getBaseLength]);

  useEffect(() => {
    if (previousColCount === colCount) return;

    const applyRefLineLength = async () => {
      await applyLineLength(getBaseLength());
    };  
    applyRefLineLength();
  }, [colCount, previousColCount, applyLineLength, getBaseLength]);

  return(
    <>
    <RangeSliderWrapper
        standalone={ standalone }
        { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
        defaultValue={ getBaseLength() } 
        value={ lineLength || getBaseLength() } 
        onChangeCallback={ async(value) => await applyLineLength(value) } 
        label={ Locale.reader.settings.lineLength.title }
        thumbLabels={ [Locale.reader.settings.lineLength.minimal, Locale.reader.settings.lineLength.maximal] }
        range={ lineLengthRangeConfig.range }
        step={ lineLengthRangeConfig.step }
      /> 
    </>
  )
}