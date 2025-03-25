import React from "react";

import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { SettingsRangeVariant } from "@/models/settings";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import Decrease from "../assets/icons/text_decrease.svg";
import Increase from "../assets/icons/text_increase.svg";
import ZoomOut from "../assets/icons/zoom_out.svg";
import ZoomIn from "../assets/icons/zoom_in.svg";

import { SliderWrapper } from "./Wrappers/SliderWrapper";
import { NumberFieldWrapper } from "./Wrappers/NumberFieldWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayZoom = () => {
  const fontSize = useAppSelector((state) => state.settings.fontSize);
  const isFXL = useAppSelector((state) => state.publication.isFXL);
  
  const { 
    applyZoom, 
    getSizeStep, 
    getSizeRange 
  } = useEpubNavigator();

  const zoomRangeConfig = {
    variant: RSPrefs.settings.zoom?.variant || SettingsRangeVariant.numberField,
    range: getSizeRange() || [0.7, 2.5],
    step: getSizeStep() || 0.1
  }

  return (
    <>
    { zoomRangeConfig.variant === SettingsRangeVariant.numberField 
      ? <NumberFieldWrapper
        standalone={ true }
        className={ settingsStyles.readerSettingsGroup }
        defaultValue={ 1 } 
        value={ fontSize } 
        onChangeCallback={ async(value) => await applyZoom(value) } 
        label={ isFXL ? Locale.reader.settings.zoom.title : Locale.reader.settings.fontSize.title }
        range={ zoomRangeConfig.range }
        step={ zoomRangeConfig.step }
        steppers={{
          decrementIcon: isFXL ? ZoomOut : Decrease,
          decrementLabel: isFXL ? Locale.reader.settings.zoom.decrease : Locale.reader.settings.fontSize.decrease,
          incrementIcon: isFXL ? ZoomIn : Increase,
          incrementLabel: isFXL ? Locale.reader.settings.zoom.increase : Locale.reader.settings.fontSize.increase
        }}
        format={{ style: "percent" }} 
        isWheelDisabled={ true }
        virtualKeyboardDisabled={ true }
      />
      : <SliderWrapper
        standalone={ true }
        className={ settingsStyles.readerSettingsGroup }
        defaultValue={ 1 } 
        value={ fontSize } 
        onChangeCallback={ async(value) => await applyZoom(value) } 
        label={ isFXL ? Locale.reader.settings.zoom.title : Locale.reader.settings.fontSize.title }
        range={ zoomRangeConfig.range }
        step={ zoomRangeConfig.step }
        format={{ style: "percent" }} 
      />
    } 
    </>
  );
};