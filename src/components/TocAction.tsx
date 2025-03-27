import React from "react";

import { RSPrefs } from "@/preferences";

import Locale from "../resources/locales/en.json";

import Chevron from "./assets/icons/chevron_right.svg";

import { Link } from "@readium/shared";
import { ActionComponentVariant, ActionKeys, IActionComponentContainer, IActionComponentTrigger } from "@/models/actions";
import { SheetTypes } from "@/models/sheets";
import { LayoutDirection } from "@/models/layout";

import tocStyles from "./assets/styles/toc.module.css";

import TocIcon from "./assets/icons/toc.svg";

import { ActionIcon } from "./ActionTriggers/ActionIcon";
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

export const TocActionContainer: React.FC<IActionComponentContainer> = ({ triggerRef }) => {
  const direction = useAppSelector(state => state.reader.direction);
  const isRTL = direction === LayoutDirection.rtl;

  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.toc]);
  const tocTree = useAppSelector(state => state.publication.tocTree);
  const dispatch = useAppDispatch();

  const { goLink } = useEpubNavigator();

  const docking = useDocking(ActionKeys.toc);
  const sheetType = docking.sheetType;

  const setOpen = (value: boolean) => {
    dispatch(setActionOpen({ 
      key: ActionKeys.toc,
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
            key: ActionKeys.toc,
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
        id: ActionKeys.toc,
        triggerRef: triggerRef, 
        heading: Locale.reader.toc.heading,
        className: tocStyles.toc,
        placement: "bottom",
        isOpen: actionState.isOpen || false,
        onOpenChangeCallback: setOpen,
        onClosePressCallback: () => setOpen(false),
        docker: docking.getDocker()
      } }
    >
      { tocTree && tocTree.length > 0 
      ? (<Tree
          aria-label={ Locale.reader.toc.entries }
          selectionMode="none"
          items={ tocTree }
          className={ tocStyles.tocTree }
          onAction={ handleAction }
        >
          { function renderItem(item) {
            return (
              <TreeItem 
                data-href={ item.href }
                className={ tocStyles.tocTreeItem }
                textValue={ item.title || "" }
              >
                <TreeItemContent>
                  { item.children 
                    ? (<Button 
                        slot="chevron" 
                        className={ tocStyles.tocTreeItemButton }
                        { ...(isRTL ? { style: { transform: "scaleX(-1)" }} : {}) }
                      >
                        <Chevron aria-hidden="true" focusable="false" />
                    </Button>) 
                    : null
                  }
                    <div className={ tocStyles.tocTreeItemText }>
                      { item.title }
                    </div>
                </TreeItemContent>
                <Collection items={ item.children }>
                  { renderItem }
                </Collection>
              </TreeItem>
            );
          }}
        </Tree>) 
      : <div className={ tocStyles.empty }>{ Locale.reader.toc.empty }</div>
    }
    </SheetWithType>
    </>
  )
}

export const TocAction: React.FC<IActionComponentTrigger> = ({ variant }) => {
  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.toc]);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {
    dispatch(setActionOpen({ 
      key: ActionKeys.toc,
      isOpen: value 
    }));
  }

  return(
    <>
    { (variant && variant === ActionComponentVariant.menu) 
      ? <OverflowMenuItem 
          label={ Locale.reader.toc.trigger }
          SVG={ TocIcon } 
          shortcut={ RSPrefs.actions.keys[ActionKeys.toc].shortcut }
          id={ ActionKeys.toc }
          onActionCallback={ () => setOpen(!actionState.isOpen) }
        />
      : <ActionIcon 
          visibility={ RSPrefs.actions.keys[ActionKeys.toc].visibility }
          ariaLabel={ Locale.reader.toc.trigger } 
          SVG={ TocIcon } 
          placement="bottom"
          tooltipLabel={ Locale.reader.toc.tooltip } 
          onPressCallback={ () => setOpen(!actionState.isOpen) }
        />
    }
    </>
  )
}