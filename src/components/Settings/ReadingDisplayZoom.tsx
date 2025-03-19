import React from "react";

import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import Decrease from "../assets/icons/text_decrease.svg";
import Increase from "../assets/icons/text_increase.svg";
import ZoomOut from "../assets/icons/zoom_out.svg";
import ZoomIn from "../assets/icons/zoom_in.svg";

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

  return (
    <>
    <NumberFieldWrapper
      className={ settingsStyles.readerSettingsGroup }
      defaultValue={ 1 } 
      value={ fontSize } 
      onChangeCallback={ async(value) => await applyZoom(value) } 
      label={ isFXL ? Locale.reader.settings.zoom.title : Locale.reader.settings.fontSize.title }
      range={ getSizeRange() || [0.7, 2.5] }
      step={ getSizeStep() || 0.1 }
      steppers={{
        decrementIcon: isFXL ? ZoomOut : Decrease,
        decrementLabel: isFXL ? Locale.reader.settings.zoom.decrease : Locale.reader.settings.fontSize.decrease,
        incrementIcon: isFXL ? ZoomIn : Increase,
        incrementLabel: isFXL ? Locale.reader.settings.zoom.increase : Locale.reader.settings.fontSize.increase
      }}
      format={{ style: "percent" }} 
      wheelDisabled={ true }
      virtualKeyboardDisabled={ true }
    /> 
    </>
  );
};