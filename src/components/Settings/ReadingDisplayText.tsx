import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { 
  defaultTextSettingsMain, 
  defaultTextSettingsOrder, 
  ISettingsMapObject, 
  SettingsContainerKeys, 
  TextSettingsKeys 
} from "@/models/settings";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { Heading } from "react-aria-components";
import { AdvancedIcon } from "./Wrappers/AdvancedIcon";

import { ReadingDisplayAlign } from "./ReadingDisplayAlign";
import { ReadingDisplayFontFamily } from "./ReadingDisplayFontFamily";
import { ReadingDisplayFontWeight } from "./ReadingDisplayFontWeight";
import { ReadingDisplayHyphens } from "./ReadingDisplayHyphens";

import { useAppDispatch } from "@/lib/hooks";
import { setSettingsContainer } from "@/lib/readerReducer";

import classNames from "classnames";

const TextSettingsMap: { [key in TextSettingsKeys]: ISettingsMapObject } = {
  [TextSettingsKeys.align]: {
    Comp: ReadingDisplayAlign
  },
  [TextSettingsKeys.fontFamily]: {
    Comp: ReadingDisplayFontFamily
  },
  [TextSettingsKeys.fontWeight]: {
    Comp: ReadingDisplayFontWeight
  },
  [TextSettingsKeys.hyphens]: {
    Comp: ReadingDisplayHyphens
  }
}

export const ReadingDisplayText = () => {
  const main = RSPrefs.settings.text?.main || defaultTextSettingsMain;
  const isAdvanced = main.length < Object.keys(TextSettingsMap).length;

  const dispatch = useAppDispatch();

  const setTextContainer = () => {
    dispatch(setSettingsContainer(SettingsContainerKeys.text));
  }

  return(
    <>
    <div className={ classNames(settingsStyles.readerSettingsGroup, settingsStyles.readerSettingsAdvancedGroup) }>
      { isAdvanced && 
        <Heading className={ settingsStyles.readerSettingsLabel }>
          { Locale.reader.settings.text.title }
        </Heading> }
      { main.map((key: TextSettingsKeys, index) => {
        const { Comp } = TextSettingsMap[key];
        return <Comp key={ key } standalone={ !isAdvanced || index !== 0 } />;
      }) }
      { isAdvanced && (
        <AdvancedIcon
          className={ settingsStyles.readerSettingsAdvancedIcon }
          ariaLabel={ Locale.reader.settings.text.advanced.trigger }
          placement="top"
          tooltipLabel={ Locale.reader.settings.text.advanced.tooltip }
          onPressCallback={ setTextContainer }
        />
      ) }
    </div>
    </>
  )
}

export const ReadingDisplayTextContainer = () => {
  const displayOrder = RSPrefs.settings.text?.displayOrder || defaultTextSettingsOrder;

  return(
    <>
    { displayOrder.map((key: TextSettingsKeys) => {
      const { Comp } = TextSettingsMap[key];
      return <Comp key={ key } standalone={ true } />;
    }) }
    </>
  )
}