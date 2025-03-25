import { createSlice } from "@reduxjs/toolkit";

import { ReadingDisplayAlignOptions, ReadingDisplayLineHeightOptions, RSLayoutStrategy } from "@/models/layout";
import { ISettingsState } from "@/models/state/settingsState";

const initialState: ISettingsState = {
  align: ReadingDisplayAlignOptions.publisher,
  colCount: "auto",
  fontFamily: "publisher",
  fontSize: 1,
  fontWeight: 400,
  hyphens: null,
  layoutStrategy: RSLayoutStrategy.lineLength,
  letterSpacing: null,
  lineHeight: ReadingDisplayLineHeightOptions.publisher,
  lineLength: null,
  normalizeText: false,
  paraIndent: null,
  paraSpacing: null,
  publisherStyles: true,
  wordSpacing: null
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setAlign: (state, action) => {
      state.align = action.payload
    },
    setColCount: (state, action) => {
      state.colCount = action.payload
    },
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload
    },
    setFontWeight: (state, action) => {
      state.fontWeight = action.payload
    },
    setHyphens: (state, action) => {
      state.hyphens = action.payload
    },
    setLayoutStrategy: (state, action) => {
      state.layoutStrategy = action.payload
    },
    setLetterSpacing: (state, action) => {
      state.letterSpacing = action.payload
    },
    setLineHeight: (state, action) => {
      state.lineHeight = action.payload
    },
    setLineLength: (state, action) => {
      state.lineLength = action.payload
    },
    setNormalizeText: (state, action) => {
      state.normalizeText = action.payload
    },
    setParaIndent: (state, action) => {
      state.paraIndent = action.payload
    },
    setParaSpacing: (state, action) => {
      state.paraSpacing = action.payload
    },
    setPublisherStyles: (state, action) => {
      state.publisherStyles = action.payload
    },
    setWordSpacing: (state, action) => {
      state.wordSpacing = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  setAlign, 
  setColCount,
  setFontSize,
  setFontWeight, 
  setFontFamily,
  setHyphens, 
  setLayoutStrategy,
  setLetterSpacing,
  setLineHeight,
  setLineLength,
  setNormalizeText,
  setParaIndent,
  setParaSpacing,
  setPublisherStyles,
  setWordSpacing
} = settingsSlice.actions;

export default settingsSlice.reducer;