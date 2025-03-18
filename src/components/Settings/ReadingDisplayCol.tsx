import React, { useCallback } from "react";

import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import AutoLayoutIcon from "../assets/icons/document_scanner.svg";
import OneColIcon from "../assets/icons/article.svg";
import TwoColsIcon from "../assets/icons/menu_book.svg";

import { RadioGroup, Radio, Label } from "react-aria-components";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayCol = () => {
  const isPaged = useAppSelector(state => state.reader.isPaged);
  const colCount = useAppSelector(state => state.settings.colCount) || "auto";
  const scrollable = !isPaged;

  const { applyColCount } = useEpubNavigator();

  const handleChange = useCallback(async (value: string) => {
    await applyColCount(value);
  }, [applyColCount]);

  return (
    <>
    <RadioGroup 
      orientation="horizontal" 
      value={`${ colCount }`} 
      onChange={ async (val: string) => await handleChange(val) }
      className={ settingsStyles.readerSettingsGroup }
      isDisabled={ scrollable }
    >
      <Label className={ settingsStyles.readerSettingsLabel }>{ Locale.reader.settings.column.title }</Label>
      <div className={ settingsStyles.readerSettingsRadioWrapper }>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value="auto" 
        >
          <AutoLayoutIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.column.auto }</span>
        </Radio>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value="1" 
        >
          <OneColIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.column.one }</span>
        </Radio>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value="2" 
        >
          <TwoColsIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.column.two }</span>
        </Radio>
      </div>
    </RadioGroup>
    </>
  );
}