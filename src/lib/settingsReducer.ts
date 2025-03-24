import { createSlice } from "@reduxjs/toolkit";

import { ReadingDisplayAlignOptions, ReadingDisplayLineHeightOptions, RSLayoutStrategy } from "@/models/layout";
import { ISettingsState } from "@/models/state/settingsState";

const initialState: ISettingsState = {
  colCount: "auto",
  fontSize: 1,
  fontWeight: 400,
  fontFamily: "publisher",
  lineHeight: ReadingDisplayLineHeightOptions.publisher,
  align: ReadingDisplayAlignOptions.publisher,
  hyphens: null,
  paraIndent: null,
  paraSpacing: null,
  lineLength: null,
  letterSpacing: null,
  wordSpacing: null,
  publisherStyles: true,
  normalizeText: false,
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
    setFontWeight: (state, action) => {
      state.fontWeight = action.payload
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
    setParaIndent: (state, action) => {
      state.paraIndent = action.payload
    },
    setParaSpacing: (state, action) => {
      state.paraSpacing = action.payload
    },
    setLineLength: (state, action) => {
      state.lineLength = action.payload
    },
    setLetterSpacing: (state, action) => {
      state.letterSpacing = action.payload
    },
    setWordSpacing: (state, action) => {
      state.wordSpacing = action.payload
    },
    setPublisherStyles: (state, action) => {
      state.publisherStyles = action.payload
    },
    setNormalizeText: (state, action) => {
      state.normalizeText = action.payload
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
  setFontWeight, 
  setFontFamily,
  setLineHeight,
  setAlign, 
  setHyphens, 
  setParaIndent,
  setParaSpacing,
  setLineLength,
  setLetterSpacing,
  setWordSpacing,
  setPublisherStyles,
  setNormalizeText,
  setLayoutStrategy
} = settingsSlice.actions;

export default settingsSlice.reducer;