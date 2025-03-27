"use client";

import React, { useEffect, useState } from "react";

import { RSPrefs } from "@/preferences";

import Locale from "../resources/locales/en.json";

import Chevron from "./assets/icons/chevron_right.svg";

import { Link } from "@readium/shared";
import { ActionComponentVariant, ActionKeys, IActionComponentContainer, IActionComponentTrigger } from "@/models/actions";
import { SheetTypes } from "@/models/sheets";
import { LayoutDirection } from "@/models/layout";

import tocStyles from "./assets/styles/toc.module.css";

import PageListIcon from "./assets/icons/page_list.svg";

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

type PageListItem = {
  id: string;
  page: string;
  href: string;
};

export const NYUPageListActionContainer: React.FC<IActionComponentContainer> = ({ triggerRef }) => {
  const direction = useAppSelector(state => state.reader.direction);
  const isRTL = direction === LayoutDirection.rtl;

  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.nyuPageList]);
  const pageList = useAppSelector(state => state.publication.pageList);
  const tocTree = useAppSelector(state => state.publication.tocTree);
  const dispatch = useAppDispatch();
  const { goLink } = useEpubNavigator();

  const docking = useDocking(ActionKeys.nyuPageList);
  const sheetType = docking.sheetType;

  const setOpen = (value: boolean) => {
    dispatch(setActionOpen({ 
      key: ActionKeys.nyuPageList,
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
        id: ActionKeys.nyuPageList,
        triggerRef: triggerRef, 
        heading: Locale.reader.nyuPageList.heading,
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
          aria-label={ Locale.reader.nyuPageList.entries }
          selectionMode="none"
          items={ pageList }
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

export const NYUPageListAction: React.FC<IActionComponentTrigger> = ({ variant }) => {
  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.nyuPageList]);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {
    dispatch(setActionOpen({ 
      key: ActionKeys.nyuPageList,
      isOpen: value 
    }));
  }

  return(
    <>
    { (variant && variant === ActionComponentVariant.menu) 
      ? <OverflowMenuItem 
          label={ Locale.reader.nyuPageList.trigger }
          SVG={ PageListIcon } 
          shortcut={ RSPrefs.actions.keys[ActionKeys.nyuPageList].shortcut }
          id={ ActionKeys.nyuPageList }
          onActionCallback={ () => setOpen(!actionState.isOpen) }
        />
      : <ActionIcon 
          visibility={ RSPrefs.actions.keys[ActionKeys.nyuPageList].visibility }
          ariaLabel={ Locale.reader.nyuPageList.trigger } 
          SVG={ PageListIcon } 
          placement="bottom"
          tooltipLabel={ Locale.reader.nyuPageList.tooltip } 
          onPressCallback={ () => setOpen(!actionState.isOpen) }
        />
    }
    </>
  )
}