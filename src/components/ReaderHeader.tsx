import React, { useCallback, useRef } from "react";
import Image from "next/image";
import { ThemeKeys } from "@/models/theme";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import { ActionKeys, IActionsItem, IActionsMapObject } from "@/models/actions";

import readerStateStyles from "./assets/styles/readerStates.module.css";
import readerHeaderStyles from "./assets/styles/readerHeader.module.css";

import { FullscreenAction } from "./FullscreenAction";
import { JumpToPositionAction } from "./JumpToPositionAction";
import { LayoutStrategyAction, LayoutStrategiesActionContainer } from "./LayoutStrategyAction";
import { SettingsAction, SettingsActionContainer } from "./SettingsAction";
import { TocAction, TocActionContainer } from "./TocAction";
import { NYUSearchAction, NYUSearchContainer } from "./NYUSearchAction";
import { NYUBookInfoAction, NYUBookInfoActionContainer } from "./NYUBookInfoAction";
import { NYUAboutAction, NYUAboutActionContainer } from "./NYUAboutAction";
import { NYUPageListAction, NYUPageListActionContainer } from "./NYUPageListAction";
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
  [ActionKeys.layoutStrategy]: {
    trigger: LayoutStrategyAction,
    container: LayoutStrategiesActionContainer
  },
  [ActionKeys.settings]: {
    trigger: SettingsAction,
    container: SettingsActionContainer
  },
  [ActionKeys.toc]: {
    trigger: TocAction,
    container: TocActionContainer
  },
  [ActionKeys.nyuSearch]: {
    trigger: NYUSearchAction,
    container: NYUSearchContainer
  },
  [ActionKeys.nyuBookInfo]: {
    trigger: NYUBookInfoAction,
    container: NYUBookInfoActionContainer
  },
  [ActionKeys.nyuAbout]: {
    trigger: NYUAboutAction,
    container: NYUAboutActionContainer
  },
  [ActionKeys.nyuPageList]: {
    trigger: NYUPageListAction,
    container: NYUPageListActionContainer
  }
}

export const ReaderHeader = () => {
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const actionsOrder = useRef(RSPrefs.actions.displayOrder);
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
  const scheme = useAppSelector((state) => state.theming.colorScheme);
  const theme = useAppSelector((state) => state.theming.theme);

  // NYU Switch the header based on the theme, auto = NYU Theme 
  let headerID = (theme === ThemeKeys.auto) ? "top-bar-nyu" : "top-bar";
  const headerClassName = (theme === ThemeKeys.auto) ? readerHeaderStyles.nyuHeader : readerHeaderStyles.header;
  let logoSrc = "/nyu-logo-dark.svg";

  // Switch the logo based on the theme, auto = NYU Theme 
  if (theme === ThemeKeys.auto) {
    headerID = "top-bar-nyu";
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
      if (key !== ActionKeys.layoutStrategy || !isFXL) {
        actionsItems.push({
          Trigger: ActionsMap[key].trigger,
          Container: ActionsMap[key].container,
          key: key
        });
      }
    });
    
    return actionsItems;
  }, [isFXL]);

  return (
    <>
    <header 
      className={ classNames(readerHeaderStyles.nyuHeader, handleClassNameFromState()) } 
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