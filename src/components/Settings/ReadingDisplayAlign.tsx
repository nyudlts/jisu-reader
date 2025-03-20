import React, { useCallback } from "react";

import Locale from "../../resources/locales/en.json";

import { LayoutDirection, ReadingDisplayAlignOptions } from "@/models/layout";
import { IAdvancedDisplayProps } from "@/models/settings";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import BookIcon from "../assets/icons/book.svg";
import LeftAlignIcon from "../assets/icons/format_align_left.svg";
import RightAlignIcon from "../assets/icons/format_align_right.svg";
import JustifyIcon from "../assets/icons/format_align_justify.svg";

import { RadioGroup, Radio, Label } from "react-aria-components";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayAlign: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const isRTL = useAppSelector(state => state.reader.direction) === LayoutDirection.rtl;
  const textAlign = useAppSelector(state => state.settings.align);

  const { applyTextAlign } = useEpubNavigator();

  const handleChange = useCallback(async (value: string) => {
    await applyTextAlign(value as ReadingDisplayAlignOptions);
  }, [applyTextAlign]);

  return (
    <>
    <RadioGroup 
      { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
      { ...(!standalone ? { "aria-label": Locale.reader.settings.align.title } : {}) }
      orientation="horizontal" 
      value={ textAlign } 
      onChange={ async (val: string) => await handleChange(val) }
    >
      { standalone && <Label className={ settingsStyles.readerSettingsLabel }>
          { Locale.reader.settings.align.title }
        </Label>
      }
      <div className={ settingsStyles.readerSettingsRadioWrapper }>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ ReadingDisplayAlignOptions.publisher } 
        >
          <BookIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.align.publisher }</span>
        </Radio>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ ReadingDisplayAlignOptions.start } 
        >
          { isRTL ? (
            <>
              <RightAlignIcon aria-hidden="true" focusable="false" />
              <span>{Locale.reader.settings.align.right}</span>
            </>
          ) : (
            <>
              <LeftAlignIcon aria-hidden="true" focusable="false" />
              <span>{Locale.reader.settings.align.left}</span>
            </>
          ) }
        </Radio>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ ReadingDisplayAlignOptions.justify } 
        >
          <JustifyIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.align.justify }</span>
        </Radio>
      </div>
    </RadioGroup>
    </>
  );
}