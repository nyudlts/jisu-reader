import { createSlice } from "@reduxjs/toolkit";

import { IReaderState } from "@/models/state/readerState";
import { defaultPlatformModifier } from "@/helpers/keyboard/getMetaKeys";
import { LayoutDirection, RSPaginationStrategy } from "@/models/layout";

const initialState: IReaderState = {
  direction: LayoutDirection.ltr,
  isImmersive: false,
  isHovering: false,
  hasArrows: true,
  isFullscreen: false,
  isPaged: true,
  colCount: "auto",
  paginationStrategy: RSPaginationStrategy.lineLength,
  fontFamily: "publisher",
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
    setColCount: (state, action) => {
      state.colCount = action.payload
    },
    setPaginationStrategy: (state, action) => {
      state.paginationStrategy = action.payload
    },
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload
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
  setColCount,
  setPaginationStrategy,
  setFontFamily
} = readerSlice.actions;

export default readerSlice.reducer;