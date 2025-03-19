import { createSlice } from "@reduxjs/toolkit";

import { ReadingDisplayAlignOptions, ReadingDisplayLineHeightOptions, RSLayoutStrategy } from "@/models/layout";
import { ISettingsState } from "@/models/state/settingsState";

const initialState: ISettingsState = {
  colCount: "auto",
  fontSize: 1,
  fontFamily: "publisher",
  lineHeight: ReadingDisplayLineHeightOptions.medium,
  align: null,
  hyphens: null,
  layoutStrategy: RSLayoutStrategy.lineLength,
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setColCount: (state, action) => {
      state.colCount = action.payload
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload
    },
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload
    },
    setLineHeight: (state, action) => {
      state.lineHeight = action.payload
    },
    setAlign: (state, action) => {
      state.align = action.payload
    },
    setHyphens: (state, action) => {
      state.hyphens = action.payload
    },
    setLayoutStrategy: (state, action) => {
      state.layoutStrategy = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  setColCount,
  setFontSize,
  setFontFamily,
  setLineHeight,
  setAlign, 
  setHyphens, 
  setLayoutStrategy,
} = settingsSlice.actions;

export default settingsSlice.reducer;