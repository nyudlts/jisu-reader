import React from "react";

import { RSPrefs } from "@/preferences";

import Locale from "../resources/locales/en.json";

import Chevron from "./assets/icons/chevron_right.svg";

import { Link } from "@readium/shared";
import { ActionComponentVariant, ActionKeys, IActionComponentContainer, IActionComponentTrigger } from "@/models/actions";
import { SheetTypes } from "@/models/sheets";
import { LayoutDirection } from "@/models/layout";

import tocStyles from "./assets/styles/toc.module.css";

import AboutIcon from "./assets/icons/about.svg";

import { ActionIcon } from "./ActionTriggers/NYUActionIcon";
import { SheetWithType } from "./Sheets/SheetWithType";
import { OverflowMenuItem } from "./ActionTriggers/OverflowMenuItem";
import { Button, Collection, Key } from "react-aria-components";
import {
  Tree,
  TreeItem,
  TreeItemContent
} from "react-aria-components";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { useDocking } from "@/hooks/useDocking";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";

export const NYUAboutActionContainer: React.FC<IActionComponentContainer> = ({ triggerRef }) => {
  const direction = useAppSelector(state => state.reader.direction);
  const isRTL = direction === LayoutDirection.rtl;

  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.nyuAbout]);
  const dispatch = useAppDispatch();

  const { goLink } = useEpubNavigator();

  const docking = useDocking(ActionKeys.nyuAbout);
  const sheetType = docking.sheetType;

  const setOpen = (value: boolean) => {
    dispatch(setActionOpen({ 
      key: ActionKeys.nyuAbout,
      isOpen: value 
    }));
  }

  const handleAction = (key: Key) => {
    if (!key) return;
    
    const el = document.querySelector(`[data-key=${key}]`);
    const href = el?.getAttribute("data-href");

    if (!href) return;

    const link: Link = new Link({ href: href });

    const cb = actionState.isOpen && 
      (sheetType === SheetTypes.dockedStart || sheetType === SheetTypes.dockedEnd)
        ? () => {} 
        : () => {
          dispatch(setActionOpen({ 
            key: ActionKeys.nyuAbout,
            isOpen: false 
          }));
        }

    goLink(link, true, cb);
  };

  return(
    <>
    <SheetWithType 
      sheetType={ sheetType }
      sheetProps={ {
        id: ActionKeys.nyuAbout,
        triggerRef: triggerRef, 
        heading: Locale.reader.nyuAbout.heading,
        className: tocStyles.toc,
        placement: "bottom",
        isOpen: actionState.isOpen || false,
        onOpenChangeCallback: setOpen,
        onClosePressCallback: () => setOpen(false),
        docker: docking.getDocker()
      } }
    >
      About this reader
    </SheetWithType>
    </>
  )
}

export const NYUAboutAction: React.FC<IActionComponentTrigger> = ({ variant }) => {
  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.nyuAbout]);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {
    dispatch(setActionOpen({ 
      key: ActionKeys.nyuAbout,
      isOpen: value 
    }));
  }

  return(
    <>
    { (variant && variant === ActionComponentVariant.menu) 
      ? <OverflowMenuItem 
          label={ Locale.reader.nyuAbout.trigger }
          SVG={ AboutIcon } 
          shortcut={ RSPrefs.actions.keys[ActionKeys.nyuAbout].shortcut }
          id={ ActionKeys.nyuAbout }
          onActionCallback={ () => setOpen(!actionState.isOpen) }
        />
      : <ActionIcon 
          visibility={ RSPrefs.actions.keys[ActionKeys.nyuAbout].visibility }
          ariaLabel={ Locale.reader.nyuAbout.trigger } 
          SVG={ AboutIcon } 
          placement="bottom"
          tooltipLabel={ Locale.reader.nyuAbout.tooltip } 
          onPressCallback={ () => setOpen(!actionState.isOpen) }
        />
    }
    </>
  )
}