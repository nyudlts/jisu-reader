import { useEffect, useState } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../resources/locales/en.json";

import { SwitchWrapper } from "./Wrappers/SwitchWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { useAppSelector } from "@/lib/hooks";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const ReadingDisplayHyphens = () => {
  const hyphens = useAppSelector(state => state.settings.hyphens);

  const { applyHyphens } = useEpubNavigator();

  return(
    <>
    <SwitchWrapper 
      heading={ Locale.reader.settings.hyphens.title }
      label={ Locale.reader.settings.hyphens.label }
      onChangeCallback={ async (isSelected: boolean) => await applyHyphens(isSelected) }
      selected={ hyphens ?? false }
    />
    </>
  )
}