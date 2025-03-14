import React from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import { ActionComponentVariant, ActionKeys, IActionComponentContainer, IActionComponentTrigger } from "@/models/actions";

import settingsStyles from "./assets/styles/readerSettings.module.css";

import TuneIcon from "./assets/icons/match_case.svg";

import { SheetWithType } from "./Sheets/SheetWithType";
import { ActionIcon } from "./ActionTriggers/ActionIcon";
import { OverflowMenuItem } from "./ActionTriggers/OverflowMenuItem";
import { ReadingDisplayCol } from "./Settings/ReadingDisplayCol";
import { ReadingDisplayLayout } from "./Settings/ReadingDisplayLayout";
import { ReadingDisplayTheme } from "./Settings/ReadingDisplayTheme";

import { useDocking } from "@/hooks/useDocking";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";
import { ReadingDisplayZoom } from "./Settings/ReadingDisplayZoom";
import { ReadingDisplayPaginationStrategy } from "./Settings/ReadingDisplayPaginationStrategy";
import { ReadingDisplayFontFamily } from "./Settings/ReadingDisplayFontFamily";

export const SettingsActionContainer: React.FC<IActionComponentContainer> = ({ triggerRef }) => {
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.settings]);
  const dispatch = useAppDispatch();
  
  const docking = useDocking(ActionKeys.settings);
  const sheetType = docking.sheetType;

  const setOpen = (value: boolean) => {    
    dispatch(setActionOpen({
      key: ActionKeys.settings,
      isOpen: value
    }));

    // hover false otherwise it tends to stay on close button press…
    if (!value) dispatch(setHovering(false));
  }

  return(
    <>
    <SheetWithType 
      sheetType={ sheetType }
      sheetProps={ {
        id: ActionKeys.settings,
        triggerRef: triggerRef,
        heading: Locale.reader.settings.heading,
        className: settingsStyles.readerSettings,
        placement: "bottom", 
        isOpen: actionState.isOpen || false,
        onOpenChangeCallback: setOpen, 
        onClosePressCallback: () => setOpen(false),
        docker: docking.getDocker()
      } }
    >
      { !isFXL && <ReadingDisplayZoom /> }
      { !isFXL && <ReadingDisplayFontFamily />}
      <ReadingDisplayTheme mapArrowNav={ 2 } />
      <ReadingDisplayLayout />
      <ReadingDisplayCol />
      { !isFXL && <ReadingDisplayPaginationStrategy /> }
    </SheetWithType>
    </>
  )
}

export const SettingsAction: React.FC<IActionComponentTrigger> = ({ variant }) => {
  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.settings]);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {    
    dispatch(setActionOpen({
      key: ActionKeys.settings,
      isOpen: value
    }));

    // hover false otherwise it tends to stay on close button press…
    if (!value) dispatch(setHovering(false));
  }

  return(
    <>
    { (variant && variant === ActionComponentVariant.menu) 
      ? <OverflowMenuItem 
          label={ Locale.reader.settings.trigger }
          SVG={ TuneIcon }
          shortcut={ RSPrefs.actions.keys[ActionKeys.settings].shortcut } 
          id={ ActionKeys.settings }
          onActionCallback={ () => setOpen(!actionState.isOpen) }
        />
      : <ActionIcon 
          visibility={ RSPrefs.actions.keys[ActionKeys.settings].visibility }
          ariaLabel={ Locale.reader.settings.trigger }
          SVG={ TuneIcon } 
          placement="bottom" 
          tooltipLabel={ Locale.reader.settings.tooltip } 
          onPressCallback={ () => setOpen(!actionState.isOpen) }
        />
    }
    </>
  )
}