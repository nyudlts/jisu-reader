import React, { useCallback, useRef } from "react";
import Image from "next/image";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import { ActionKeys, IActionsItem, IActionsMapObject } from "@/models/actions";
import { ThemeKeys } from "@/models/theme";

import readerStateStyles from "./assets/styles/readerStates.module.css";
import readerHeaderStyles from "./assets/styles/nyuReaderHeader.module.css";

import { FullscreenAction } from "./NYUFullscreenAction";
import { JumpToPositionAction } from "./JumpToPositionAction";
import { SettingsAction, SettingsActionContainer } from "./NYUSettingsAction";
import { TocAction, TocActionContainer } from "./NYUTocAction";
//import { NYUSearchAction, NYUSearchContainer } from "./NYUSearchAction";
import { RunningHead } from "./RunningHead";
import { ActionsWithCollapsibility } from "./ActionsWithCollapsibility";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import classNames from "classnames";

const ActionsMap: { [key in ActionKeys]: IActionsMapObject } = {
  [ActionKeys.fullscreen]: {
    trigger: FullscreenAction
  },
  [ActionKeys.jumpToPosition]: {
    trigger: JumpToPositionAction
  },
  [ActionKeys.settings]: {
    trigger: SettingsAction,
    container: SettingsActionContainer
  },
  [ActionKeys.toc]: {
    trigger: TocAction,
    container: TocActionContainer
  }
}

/*
,
  [ActionKeys.nyuSearch]: {
    trigger: NYUSearchAction,
    container: NYUSearchContainer
  }
*/

export const ReaderHeader = () => {
  const actionsOrder = useRef(RSPrefs.actions.displayOrder);
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
  const scheme = useAppSelector((state) => state.theming.colorScheme);
  const theme = useAppSelector((state) => state.theming.theme);

  // Switch the header based on the theme, auto = NYU Theme 
  let headerID = (theme === ThemeKeys.auto) ? "top-bar-nyu" : "top-bar";
  const headerClassName = (theme === ThemeKeys.auto) ? readerHeaderStyles.nyuHeader : readerHeaderStyles.header;
  let logoSrc = "/nyu-logo-dark.svg";

  // Switch the logo based on the theme, auto = NYU Theme 
  if (theme === ThemeKeys.auto) {
    headerID = "nyu-top-bar";
    logoSrc = "/nyu-logo.svg";
  } else if (theme === ThemeKeys.contrast1) {
    logoSrc = "/nyu-logo-yellow.svg";
  } else if (theme === ThemeKeys.dark || theme === ThemeKeys.contrast2) {
    logoSrc = "/nyu-logo.svg";
  }

  const dispatch = useAppDispatch();

  const setHover = () => {
    dispatch(setHovering(true));
  };

  const removeHover = () => {
    dispatch(setHovering(false));
  };

  const handleClassNameFromState = () => {
    let className = "";
    if (isImmersive && isHovering) {
      className = readerStateStyles.immersiveHovering;
    } else if (isImmersive) {
      className = readerStateStyles.immersive;
    }
    return className
  };

  const listActionItems = useCallback(() => {
    const actionsItems: IActionsItem[] = [];

    actionsOrder.current.map((key: ActionKeys) => {
      actionsItems.push({
        Trigger: ActionsMap[key].trigger,
        Container: ActionsMap[key].container,
        key: key
      });
    });
    
    return actionsItems;
  }, []);

  return (
    <>
    <header 
      className={ classNames(headerClassName, handleClassNameFromState()) } 
      id={ headerID } 
      aria-label={ Locale.reader.app.header.label } 
      onMouseEnter={ setHover } 
      onMouseLeave={ removeHover }
    >
      <div className={ readerHeaderStyles.logoWrapper }>
        <Image src={logoSrc} alt="NYU Libraries Logo" width={200} height={60} />
      </div>
      <RunningHead syncDocTitle={ true } />
      
      <ActionsWithCollapsibility 
        id="reader-header-overflowMenu" 
        items={ listActionItems() }
        prefs={ RSPrefs.actions }
        className={ readerHeaderStyles.actionsWrapper } 
        label={ Locale.reader.app.header.actions } 
        overflowActionCallback={ (isImmersive && !isHovering) }
        overflowMenuDisplay={ (!isImmersive || isHovering) }
      />
    </header>
    </>
  );
}