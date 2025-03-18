import React from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../resources/locales/en.json";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";
import settingsStyles from "../assets/styles/readerSettings.module.css";

import Decrease from "../assets/icons/text_decrease.svg";
import Increase from "../assets/icons/text_increase.svg";
import ZoomOut from "../assets/icons/zoom_out.svg";
import ZoomIn from "../assets/icons/zoom_in.svg";

import { Button, Group, Tooltip, TooltipTrigger } from "react-aria-components";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayZoom = () => {
  const fontSize = useAppSelector((state) => state.settings.fontSize);
  const isFXL = useAppSelector((state) => state.publication.isFXL);
  
  const { 
    incrementSize, 
    decrementSize,
    getSizeRange 
  } = useEpubNavigator();

  return (
    <Group 
      className={ settingsStyles.readerSettingsGroup }
      aria-labelledby="displaySizeTitle" 
    >
      <div 
        className={ settingsStyles.readerSettingsGroupTitle }
        id="displaySizeTitle"
      >
        { isFXL ? Locale.reader.settings.zoom.title : Locale.reader.settings.fontSize.title }
      </div>

      <div className={ settingsStyles.readerSettingsGroupWrapper }>
        <TooltipTrigger
          { ...(RSPrefs.theming.icon.tooltipDelay 
            ? { 
              delay: RSPrefs.theming.icon.tooltipDelay,
              closeDelay: RSPrefs.theming.icon.tooltipDelay
            } 
            : {}
          )}
        >
          <Button 
            className={ readerSharedUI.icon }
            aria-label={ isFXL ? Locale.reader.settings.zoom.decrease : Locale.reader.settings.fontSize.decrease }
            onPress={ async() => {
              await decrementSize();
            } }
            isDisabled={ getSizeRange() !== null && fontSize === getSizeRange()?.[0] }
          >
            { isFXL 
              ? <ZoomOut aria-hidden="true" focusable="false" /> 
              : <Decrease aria-hidden="true" focusable="false" /> 
            }
          </Button>
          <Tooltip
            className={ readerSharedUI.tooltip }
            placement={ "bottom" } 
            offset={ RSPrefs.theming.icon.tooltipOffset || 0 }
          >
            { isFXL ? Locale.reader.settings.zoom.decreaseTooltip : Locale.reader.settings.fontSize.decreaseTooltip }
          </Tooltip>
        </TooltipTrigger>

        <span className={ settingsStyles.readerSettingsGroupValue }>
          { `${Math.round((fontSize ?? 1) * 100)}%` }
        </span>

        <TooltipTrigger
          { ...(RSPrefs.theming.icon.tooltipDelay 
            ? { 
              delay: RSPrefs.theming.icon.tooltipDelay,
              closeDelay: RSPrefs.theming.icon.tooltipDelay
            } 
            : {}
          )}
        >
          <Button 
            className={ readerSharedUI.icon }
            aria-label={ isFXL ? Locale.reader.settings.zoom.increase : Locale.reader.settings.fontSize.increase }
            onPress={ async () => {
              await incrementSize();
            } }
            isDisabled={ getSizeRange() !== null && fontSize === getSizeRange()?.[1] }
          >
            { isFXL 
              ? <ZoomIn aria-hidden="true" focusable="false" /> 
              : <Increase aria-hidden="true" focusable="false" />
            }
          </Button>
          <Tooltip
            className={ readerSharedUI.tooltip }
            placement={ "bottom" } 
            offset={ RSPrefs.theming.icon.tooltipOffset || 0 }
          >
            { isFXL ? Locale.reader.settings.zoom.increaseTooltip : Locale.reader.settings.fontSize.increaseTooltip }
          </Tooltip>
        </TooltipTrigger>
      </div>
    </Group>
  );
};