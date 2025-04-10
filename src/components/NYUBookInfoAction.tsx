import React from "react";

import { RSPrefs } from "@/preferences";

import Locale from "../resources/locales/en.json";

import Chevron from "./assets/icons/chevron_right.svg";

import { Link } from "@readium/shared";
import { ActionComponentVariant, ActionKeys, IActionComponentContainer, IActionComponentTrigger } from "@/models/actions";
import { SheetTypes } from "@/models/sheets";
import { LayoutDirection } from "@/models/layout";

import bookInfoStyles from "./assets/styles/nyuBookInfo.module.css";

import BookInfoIcon from "./assets/icons/book_info.svg";

import { ActionIcon } from "./ActionTriggers/ActionIcon";
import { SheetWithType } from "./Sheets/SheetWithType";
import { OverflowMenuItem } from "./ActionTriggers/OverflowMenuItem";
import { Heading, Text, Separator, Key } from "react-aria-components";

import { useDocking } from "@/hooks/useDocking";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";

interface AccessibilityInfo {
  waysOfReading: string[];
  navigation: string[];
  hazards: string[];
  summary: string;
}


export const NYUBookInfoActionContainer: React.FC<IActionComponentContainer> = ({ triggerRef }) => {
  const direction = useAppSelector(state => state.reader.direction);
  const isRTL = direction === LayoutDirection.rtl;

  const title = useAppSelector(state => state.publication.runningHead);
  const authors = useAppSelector(state => state.publication.authors);
  const publishers = useAppSelector(state => state.publication.publishers);
  const identifier = useAppSelector(state => state.publication.identifier);
  const coverUrl = useAppSelector(state => state.publication.coverUrl);
  const accessibilityInfo = useAppSelector(state => state.publication.a11yInfo);

  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.nyuBookInfo]);
  const dispatch = useAppDispatch();

  const docking = useDocking(ActionKeys.nyuBookInfo);
  const sheetType = docking.sheetType;

  const setOpen = (value: boolean) => {
    dispatch(setActionOpen({ 
      key: ActionKeys.nyuBookInfo,
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
            key: ActionKeys.nyuBookInfo,
            isOpen: false 
          }));
        }
  };

  return(
    <>
    <SheetWithType 
      sheetType={ sheetType }
      sheetProps={ {
        id: ActionKeys.nyuBookInfo,
        triggerRef: triggerRef, 
        heading: Locale.reader.nyuBookInfo.heading,
        className: bookInfoStyles.info,
        placement: "bottom",
        isOpen: actionState.isOpen || false,
        onOpenChangeCallback: setOpen,
        onClosePressCallback: () => setOpen(false),
        docker: docking.getDocker()
      } }
    >
      <div className={bookInfoStyles.bookInfoPanel}>
      <Heading level={2} className={bookInfoStyles.title}>{ title }</Heading>
      <img
        src={coverUrl}
        alt="Book cover"
        className={bookInfoStyles.bookCover}
      />
      <div className={bookInfoStyles.infoGroup}>
        <div className={bookInfoStyles.infoRow}>
          <span className={bookInfoStyles.infoLabel}>{Locale.reader.nyuBookInfo.author}</span>
          <span className={bookInfoStyles.infoValue}>{authors}</span>
        </div>
        <div className={bookInfoStyles.infoRow}>
          <span className={bookInfoStyles.infoLabel}>{Locale.reader.nyuBookInfo.publisher}</span>
          <span className={bookInfoStyles.infoValue}>{publishers}</span>
        </div>
        <div className={bookInfoStyles.infoRow}>
          <span className={bookInfoStyles.infoLabel}>{Locale.reader.nyuBookInfo.identifier}</span>
          <span className={bookInfoStyles.infoValue}>{identifier}</span>
        </div>
      </div>

      <Separator className={bookInfoStyles.sectionSeparator} />

      <section className="accessibility-section">
        <Heading level={3} className="section-heading">{Locale.reader.nyuBookInfo.a11yHeader}</Heading>

        <div className={bookInfoStyles.accessibilitySubsection}>
          <Text className={bookInfoStyles.subheading}>{Locale.reader.nyuBookInfo.a11yWays}</Text>
          <ul>
          {accessibilityInfo?.waysOfReading.map((item, index) => (
              <li key={`reading-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={bookInfoStyles.accessibilitySubsection}>
          <Text className={bookInfoStyles.subheading}>{Locale.reader.nyuBookInfo.a11yNavigation}</Text>
          <ul>
          {accessibilityInfo?.navigation.map((item, index) => (
              <li key={`nav-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={bookInfoStyles.accessibilitySubsection}>
          <Text className={bookInfoStyles.subheading}>{Locale.reader.nyuBookInfo.a11yHazards}</Text>
          <ul>
          {accessibilityInfo?.hazards.map((item, index) => (
              <li key={`hazard-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={bookInfoStyles.accessibilitySubsection}>
          <Text className={bookInfoStyles.subheading}>{Locale.reader.nyuBookInfo.a11ySummary}</Text>
          <p>{accessibilityInfo?.summary}</p>
        </div>
      </section>
    </div>
      
    </SheetWithType>
    </>
  )
}

export const NYUBookInfoAction: React.FC<IActionComponentTrigger> = ({ variant }) => {
  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.nyuBookInfo]);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {
    dispatch(setActionOpen({ 
      key: ActionKeys.nyuBookInfo,
      isOpen: value 
    }));
  }

  return(
    <>
    { (variant && variant === ActionComponentVariant.menu) 
      ? <OverflowMenuItem 
          label={ Locale.reader.nyuBookInfo.trigger }
          SVG={ BookInfoIcon } 
          shortcut={ RSPrefs.actions.keys[ActionKeys.nyuBookInfo].shortcut }
          id={ ActionKeys.nyuBookInfo }
          onActionCallback={ () => setOpen(!actionState.isOpen) }
        />
      : <ActionIcon 
          visibility={ RSPrefs.actions.keys[ActionKeys.nyuBookInfo].visibility }
          ariaLabel={ Locale.reader.nyuBookInfo.trigger } 
          SVG={ BookInfoIcon } 
          placement="bottom"
          tooltipLabel={ Locale.reader.nyuBookInfo.tooltip } 
          onPressCallback={ () => setOpen(!actionState.isOpen) }
        />
    }
    </>
  )
}