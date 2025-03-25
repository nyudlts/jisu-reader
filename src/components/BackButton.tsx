import { RSPrefs } from "@/preferences";

import Locale from "../resources/locales/en.json";

import { IBackButton } from "@/models/actions";
import { LayoutDirection } from "@/models/layout";

import readerSharedUI from "./assets/styles/readerSharedUI.module.css";

import ArrowLeftIcon from "./assets/icons/arrow_back.svg";
import ArrowRightIcon from "./assets/icons/arrow_forward.svg";

import { Button, Tooltip, TooltipTrigger } from "react-aria-components";

import { useAppSelector } from "@/lib/hooks";

import classNames from "classnames";

export const BackButton = ({
  ref,
  className,
  label,
  onPressCallback
}: IBackButton) => {
  const isRTL = useAppSelector(state => state.reader.direction) === LayoutDirection.rtl;
  
  return (
    <>
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
        ref={ ref }
        className={ classNames(className, readerSharedUI.backButton) } 
        aria-label={ label || Locale.reader.app.back.trigger } 
        onPress={ onPressCallback }
      >
        { isRTL 
          ? <ArrowRightIcon aria-hidden="true" focusable="false" /> 
          : <ArrowLeftIcon aria-hidden="true" focusable="false" /> 
        }
      </Button>
      <Tooltip
        className={ readerSharedUI.tooltip }
        placement="bottom" 
        offset={ RSPrefs.theming.icon.tooltipOffset || 0 }
      >
        { Locale.reader.app.back.tooltip }
      </Tooltip>
    </TooltipTrigger>
    </>
  )
}