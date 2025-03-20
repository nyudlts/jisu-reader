import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import { 
  ActionComponentVariant, 
  ActionKeys, 
  IActionComponentContainer, 
  IActionComponentTrigger 
} from "@/models/actions";
import { 
  defaultSpacingSettingsMain, 
  defaultSpacingSettingsOrder, 
  defaultTextSettingsMain, 
  defaultTextSettingsOrder, 
  ISettingsMapObject, 
  SettingsContainerKeys, 
  SettingsKeys, 
  SpacingSettingsKeys, 
  TextSettingsKeys 
} from "@/models/settings";

import settingsStyles from "./assets/styles/readerSettings.module.css";

import TuneIcon from "./assets/icons/match_case.svg";

import { SheetWithType } from "./Sheets/SheetWithType";
import { ActionIcon } from "./ActionTriggers/ActionIcon";
import { OverflowMenuItem } from "./ActionTriggers/OverflowMenuItem";

import { ReadingDisplayAlign } from "./Settings/ReadingDisplayAlign";
import { ReadingDisplayCol } from "./Settings/ReadingDisplayCol";
import { ReadingDisplayFontFamily } from "./Settings/ReadingDisplayFontFamily";
import { ReadingDisplayFontWeight } from "./Settings/ReadingDisplayFontWeight";
import { ReadingDisplayHyphens } from "./Settings/ReadingDisplayHyphens";
import { ReadingDisplayLayout } from "./Settings/ReadingDisplayLayout";
import { ReadingDisplayLineHeight } from "./Settings/ReadingDisplayLineHeight";
import { ReadingDisplaySpacing } from "./Settings/ReadingDisplaySpacing";
import { ReadingDisplayText, ReadingDisplayTextContainer } from "./Settings/ReadingDisplayText";
import { ReadingDisplayTheme } from "./Settings/ReadingDisplayTheme";
import { ReadingDisplayZoom } from "./Settings/ReadingDisplayZoom";

import { useDocking } from "@/hooks/useDocking";

import { setHovering, setSettingsContainer } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";

const SettingsMap: { [key in SettingsKeys]: ISettingsMapObject } = {
  [SettingsKeys.align]: {
    Comp: ReadingDisplayAlign
  },
  [SettingsKeys.columns]: {
    Comp: ReadingDisplayCol
  },
  [SettingsKeys.fontFamily]: {
    Comp: ReadingDisplayFontFamily
  },
  [SettingsKeys.fontWeight]: {
    Comp: ReadingDisplayFontWeight
  },
  [SettingsKeys.hyphens]: {
    Comp: ReadingDisplayHyphens
  },
  [SettingsKeys.layout]: {
    Comp: ReadingDisplayLayout
  },
  [SettingsKeys.lineHeight]: {
    Comp: ReadingDisplayLineHeight
  },
  [SettingsKeys.spacing]: {
    Comp: ReadingDisplaySpacing
  },
  [SettingsKeys.text]: {
    Comp: ReadingDisplayText
  },
  [SettingsKeys.theme]: {
    Comp: ReadingDisplayTheme,
    props: {
      mapArrowNav: 2
    }
  },
  [SettingsKeys.zoom]: {
    Comp: ReadingDisplayZoom
  }
}

export const SettingsActionContainer: React.FC<IActionComponentContainer> = ({ triggerRef }) => {
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const contains = useAppSelector(state => state.reader.settingsContainer);
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

  const setInitial = useCallback(() => {
    dispatch(setSettingsContainer(SettingsContainerKeys.initial));
  }, [dispatch]);

  const isTextNested = (key: SettingsKeys) => {
    return [
      RSPrefs.settings.text?.main || defaultTextSettingsMain,
      RSPrefs.settings.text?.displayOrder || defaultTextSettingsOrder,
    ].some(arr => arr.includes(key as unknown as TextSettingsKeys));
  };

  const isSpacingNested = (key: SettingsKeys) => {
    return [
      RSPrefs.settings.spacing?.main || defaultSpacingSettingsMain,
      RSPrefs.settings.spacing?.displayOrder || defaultSpacingSettingsOrder,
    ].some(arr => arr.includes(key as unknown as SpacingSettingsKeys));
  };

  const renderSettings = useCallback(() => {
    switch (contains) {
      case SettingsContainerKeys.text:
        return <ReadingDisplayTextContainer />;

      case SettingsContainerKeys.initial:
      default:
        return (
          <>
            {
              settingItems.current
                .filter((key: SettingsKeys) => !(isTextNested(key) || isSpacingNested(key)))
                .map((key: SettingsKeys) => {
                  const setting = SettingsMap[key];
                  return <setting.Comp key={ key } { ...setting.props } />;
                })
            }
          </>
        );
    }
  }, [contains]);

  // Reset when closed
  useEffect(() => {
    if (!actionState.isOpen) setInitial();
  }, [actionState.isOpen, setInitial]);

  return(
    <>
    <SheetWithType 
      sheetType={ sheetType }
      sheetProps={ {
        id: ActionKeys.settings,
        triggerRef: triggerRef,
        heading: contains === SettingsContainerKeys.initial 
          ? Locale.reader.settings.heading 
          : Locale.reader.settings.text.title,
        className: settingsStyles.readerSettings,
        placement: "bottom", 
        isOpen: actionState.isOpen || false,
        onOpenChangeCallback: setOpen, 
        onClosePressCallback: () => { contains === SettingsContainerKeys.initial ? setOpen(false) : setInitial() },
        docker: docking.getDocker()
      } }
    >
      { renderSettings() }
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