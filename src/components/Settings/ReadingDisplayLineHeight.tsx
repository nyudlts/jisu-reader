import React, { useCallback } from "react";

import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { ReadingDisplayLineHeightOptions } from "@/models/layout";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import SmallIcon from "../assets/icons/density_small.svg";
import MediumIcon from "../assets/icons/density_medium.svg";
import LargeIcon from "../assets/icons/density_large.svg";

import { RadioGroup, Radio, Label } from "react-aria-components";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayLineHeight = () => {
  const lineHeight = useAppSelector(state => state.settings.lineHeight);

  const { applyLineHeight } = useEpubNavigator();

  const handleChange = useCallback(async (value: string) => {
    await applyLineHeight(value);
  }, [applyLineHeight]);

  return (
    <>
    <RadioGroup 
      orientation="horizontal" 
      value={`${ lineHeight }`} 
      onChange={ async (val: string) => await handleChange(val) }
      className={ settingsStyles.readerSettingsGroup }
    >
      <Label className={ settingsStyles.readerSettingsLabel }>{ Locale.reader.settings.lineHeight.title }</Label>
      <div className={ settingsStyles.readerSettingsRadioWrapper }>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ ReadingDisplayLineHeightOptions.small } 
        >
          <SmallIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.lineHeight.small }</span>
        </Radio>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ ReadingDisplayLineHeightOptions.medium } 
        >
          <MediumIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.lineHeight.medium }</span>
        </Radio>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ ReadingDisplayLineHeightOptions.large }
        >
          <LargeIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.lineHeight.large }</span>
        </Radio>
      </div>
    </RadioGroup>
    </>
  );
}