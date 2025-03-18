import React, { useRef } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import { ActionComponentVariant, ActionKeys, IActionComponentContainer, IActionComponentTrigger } from "@/models/actions";
import { SettingsKeys } from "@/models/settings";

import settingsStyles from "./assets/styles/readerSettings.module.css";

import TuneIcon from "./assets/icons/match_case.svg";

import { SheetWithType } from "./Sheets/SheetWithType";
import { ActionIcon } from "./ActionTriggers/ActionIcon";
import { OverflowMenuItem } from "./ActionTriggers/OverflowMenuItem";
import { ReadingDisplayCol } from "./Settings/ReadingDisplayCol";
import { ReadingDisplayLayout } from "./Settings/ReadingDisplayLayout";
import { ReadingDisplayTheme } from "./Settings/ReadingDisplayTheme";
import { ReadingDisplayZoom } from "./Settings/ReadingDisplayZoom";
import { ReadingDisplayFontFamily } from "./Settings/ReadingDisplayFontFamily";
import { ReadingDisplayLineHeight } from "./Settings/ReadingDisplayLineHeight";

import { useDocking } from "@/hooks/useDocking";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";

const SettingsMap = {
  [SettingsKeys.columns]: {
    comp: ReadingDisplayCol
  },
  [SettingsKeys.fontFamily]: {
    comp: ReadingDisplayFontFamily
  },
  [SettingsKeys.layout]: {
    comp: ReadingDisplayLayout
  },
  [SettingsKeys.lineHeight]: {
    comp: ReadingDisplayLineHeight
  },
  [SettingsKeys.theme]: {
    comp: ReadingDisplayTheme,
    props: {
      mapArrowNav: 2
    }
  },
  [SettingsKeys.zoom]: {
    comp: ReadingDisplayZoom
  }
}

export const SettingsActionContainer: React.FC<IActionComponentContainer> = ({ triggerRef }) => {
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.settings]);
  const dispatch = useAppDispatch();

  const settingItems = useRef(isFXL ? RSPrefs.settings.fxlOrder : RSPrefs.settings.reflowOrder);
  
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
      { 
        settingItems.current.map((key: SettingsKeys) => {
          const setting = SettingsMap[key];
          return <setting.comp key={ key } { ...("props" in setting ? setting.props : {}) } />;
        })
      }
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