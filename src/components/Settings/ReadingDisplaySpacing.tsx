import React from "react";

import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { ReadingDisplayLineHeight } from "./ReadingDisplayLineHeight";
import { AdvancedIcon } from "./Wrappers/AdvancedIcon";

import classNames from "classnames";

export const ReadingDisplaySpacing = () => {
  return (
    <>
    <div className={ classNames(settingsStyles.readerSettingsGroup, settingsStyles.readerSettingsAdvancedGroup) }>
      <ReadingDisplayLineHeight standalone={ false } />
      <AdvancedIcon
        isDisabled={ true }
        className={ settingsStyles.readerSettingsAdvancedIcon }
        ariaLabel={ Locale.reader.settings.spacing.advanced.trigger }
        placement="top"
        tooltipLabel={ Locale.reader.settings.spacing.advanced.tooltip }
        onPressCallback={ () => {} }
      />
    </div>
    </>
  );
}