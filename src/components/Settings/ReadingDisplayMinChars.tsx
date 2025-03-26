import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { RSLayoutStrategy } from "@/models/layout";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { SwitchWrapper } from "./Wrappers/SwitchWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";
import { useAppSelector } from "@/lib/hooks";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const ReadingDisplayMinChars = () => {
  const colCount = useAppSelector(state => state.settings.colCount);
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const lineLength = useAppSelector(state => state.settings.tmpLineLengths[0]);
  const minChars = useAppSelector(state => state.settings.tmpMinChars);
  
  const { nullifyMinChars } = useEpubNavigator();

  return(
    <>
    { RSPrefs.typography.minimalLineLength &&
      <div className={ settingsStyles.readerSettingsGroup }>
        <SwitchWrapper 
          label={ Locale.reader.layoutStrategy.minChars }
          onChangeCallback={ async (isSelected: boolean) => await nullifyMinChars(isSelected ? null : lineLength || RSPrefs.typography.minimalLineLength) }
          isSelected={ minChars }
          isDisabled={ layoutStrategy !== RSLayoutStrategy.columns && colCount !== "2" }
        />
      </div>
    }
    </>
  )
}