import { useEffect, useState } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../resources/locales/en.json";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { SwitchWrapper } from "./Wrappers/SwitchWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const ReadingDisplayMaxChars = () => {
  const [selected, setSelected] = useState(false);
  
  const { nullifyMaxChars } = useEpubNavigator();

  useEffect(() => {
    const updatePref = async () => {
      await nullifyMaxChars(selected);
    };
    updatePref();
  }, [selected, nullifyMaxChars]);

  return(
    <>
    { RSPrefs.typography.maximalLineLength &&
      <div className={ settingsStyles.readerSettingsGroup }>
        <SwitchWrapper 
          label={ Locale.reader.layoutStrategy.maxChars }
          onChangeCallback={ setSelected }
          isSelected={ selected }
        />
      </div>
    }
    </>
  )
}