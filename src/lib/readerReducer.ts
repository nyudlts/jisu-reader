import { createSlice } from "@reduxjs/toolkit";

import { IReaderState } from "@/models/state/readerState";
import { defaultPlatformModifier } from "@/helpers/keyboard/getMetaKeys";
import { LayoutDirection } from "@/models/layout";
import { SettingsContainerKeys } from "@/models/settings";

const initialState: IReaderState = {
  direction: LayoutDirection.ltr,
  isImmersive: false,
  isHovering: false,
  hasArrows: true,
  isFullscreen: false,
  isPaged: true,
  settingsContainer: SettingsContainerKeys.initial,
  platformModifier: defaultPlatformModifier
}

export const readerSlice = createSlice({
  name: "reader",
  initialState,
  reducers: {
    setDirection: (state, action) => {
      state.direction = action.payload
    },
    setPlatformModifier: (state, action) => {
      state.platformModifier = action.payload
    },
    setImmersive: (state, action) => {
      state.isImmersive = false; //NYU PRESS action.payload
    },
    toggleImmersive: (state) => {
      state.isImmersive = false; //NYU PRESS !state.isImmersive;
    },
    setHovering: (state, action) => {
      state.isHovering = action.payload
    },
    setArrows: (state, action) => {
      state.hasArrows = action.payload
    },
    setFullscreen: (state, action) => {
      state.isFullscreen = action.payload
    },
    setPaged: (state, action) => {
      state.isPaged = action.payload
    },
    setSettingsContainer: (state, action) => {
      state.settingsContainer = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  setDirection, 
  setPlatformModifier, 
  setImmersive, 
  toggleImmersive, 
  setHovering, 
  setArrows, 
  setFullscreen, 
  setPaged,
  setSettingsContainer
} = readerSlice.actions;

export default readerSlice.reducer;