import { Key, useCallback, useRef } from "react";

import Locale from "../../resources/locales/en.json";

import { ReadingDisplayFontFamilyOptions } from "@/models/layout";
import { IAdvancedDisplayProps } from "@/models/settings";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import DropIcon from "../assets/icons/arrow_drop_down.svg";

import { Button, Label, ListBox, ListBoxItem, Popover, Select, SelectValue } from "react-aria-components";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayFontFamily: React.FC<IAdvancedDisplayProps> = ({ standalone = true }) => {
  const fontFamily = useAppSelector(state => state.settings.fontFamily);
  const fontFamilyOptions = useRef(Object.entries(ReadingDisplayFontFamilyOptions).map(([property, stack]) => ({
      id: property,
      label: Locale.reader.settings.fontFamily.labels[property as keyof typeof Locale.reader.settings.fontFamily.labels],
      value: stack
    }))
  );

  const { applyFontFamily } = useEpubNavigator();

  const handleFontFamily = useCallback((key: Key) => {
    if (key === fontFamily) return;

    const selectedOption = fontFamilyOptions.current.find((option) => option.id === key) as {
      id: keyof typeof ReadingDisplayFontFamilyOptions;
      label: string;
      value: string | null;
    };
    if (selectedOption) {
      applyFontFamily(selectedOption);
    }
  }, [applyFontFamily, fontFamily]);

  return(
    <>
    <Select
      { ...(standalone ? { className: settingsStyles.readerSettingsGroup } : {}) }
      { ...(!standalone ? { "aria-label": Locale.reader.settings.fontFamily.title } : {}) }
      selectedKey={ fontFamily }
      onSelectionChange={ handleFontFamily }
    >
      { standalone && <Label className={ settingsStyles.readerSettingsLabel }>
          { Locale.reader.settings.fontFamily.title }
        </Label>
      }
      <Button 
        className={ settingsStyles.readerSettingsDropdownButton }
      >
        <SelectValue />
        <DropIcon aria-hidden="true" focusable="false" />
      </Button>
      <Popover
        className={ settingsStyles.readerSettingsDropdownPopover }
        placement="bottom"
      >
        <ListBox
          className={ settingsStyles.readerSettingsDropdownListbox } 
          items={ fontFamilyOptions.current }
        >
          { (item) => <ListBoxItem 
              className={ settingsStyles.readerSettingsDropdownListboxItem } 
              id={ item.id } 
              key={ item.id } 
              textValue={ item.value || undefined }
              style={ { fontFamily: item.value || undefined } }
            >
              { item.label }
            </ListBoxItem>
          }
        </ListBox>
      </Popover>
    </Select>
    </>
  )
}