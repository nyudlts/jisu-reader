import { useCallback, useEffect } from "react";

import Locale from "../../resources/locales/en.json";

import { RSPaginationStrategy } from "@/models/layout";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import FitIcon from "../assets/icons/fit_width.svg";
import RangeIcon from "../assets/icons/arrow_range.svg";
import AddColumnIcon from "../assets/icons/add_column_right.svg";

import { Label, Radio, RadioGroup } from "react-aria-components";
import { ReadingDisplayMaxChars } from "./ReadingDisplayMaxChars";

import { useAppSelector } from "@/lib/hooks";
import { useEpubNavigator } from "@/hooks/useEpubNavigator";

export const ReadingDisplayPaginationStrategy = () => {
  const paginationStrategy = useAppSelector(state => state.reader.paginationStrategy);
  const isPaged = useAppSelector(state => state.reader.isPaged);
  const colCount = useAppSelector(state => state.reader.colCount);

  const { applyPaginationStrategy } = useEpubNavigator();

  const handleChange = useCallback(async (value: string) => {
    await applyPaginationStrategy(value as RSPaginationStrategy);
  }, [applyPaginationStrategy]);

  useEffect(() => {
    if (colCount !== "auto" && paginationStrategy === RSPaginationStrategy.columns) {
      handleChange(RSPaginationStrategy.lineLength);
    }
  }, [colCount, paginationStrategy, handleChange]);

  return(
    <>
    <RadioGroup 
      orientation="horizontal" 
      value={ paginationStrategy } 
      onChange={ async (val: string) => await handleChange(val) } 
      className={ settingsStyles.readerSettingsGroup }
    >
      <Label className={ settingsStyles.readerSettingsLabel }>{ Locale.reader.settings.paginationStrategy.title }</Label>
      <div className={ settingsStyles.readerSettingsRadioWrapper }>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ RSPaginationStrategy.margin } 
          id={ RSPaginationStrategy.margin } 
          isDisabled={ !isPaged }
        >
          <FitIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.paginationStrategy.margin }</span>
        </Radio>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ RSPaginationStrategy.lineLength } 
          id={ RSPaginationStrategy.lineLength } 
          isDisabled={ !isPaged }
        >
          <RangeIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.paginationStrategy.lineLength }</span>
        </Radio>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ RSPaginationStrategy.columns } 
          id={ RSPaginationStrategy.columns } 
          isDisabled={ !isPaged || colCount !== "auto" } 
        >
          <AddColumnIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.paginationStrategy.columns }</span>
        </Radio>
      </div>
    </RadioGroup>
    <ReadingDisplayMaxChars />
    </>
  )
}