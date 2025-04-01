import { IPublicationState } from "@/models/state/publicationState";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IPublicationState = {
  runningHead: undefined,
  isFXL: false,
  isRTL: false,
  progression: {},
  atPublicationStart: false,
  atPublicationEnd: false,
  tocTree: undefined,
  tocEntry: undefined,
  chapterHref: undefined,
  authors: undefined,
  publishers: undefined,
  identifier: undefined,
  coverUrl: undefined,
  a11yInfo: undefined,
}

export const publicationSlice = createSlice({
  name: "publication",
  initialState,
  reducers: {
    setRunningHead: (state, action) => {
      state.runningHead = action.payload
    },
    setFXL: (state, action) => {
      state.isFXL = action.payload
    },
    setRTL: (state, action) => {
      state.isRTL = action.payload
    },
    setProgression: (state, action) => {
      state.progression = {...state.progression, ...action.payload }
    },
    setPublicationStart: (state, action) => {
      state.atPublicationStart = action.payload
    },
    setPublicationEnd: (state, action) => {
      state.atPublicationEnd = action.payload
    },
    setTocTree: (state, action) => {
      state.tocTree = action.payload;
    },
    setTocEntry: (state, action) => {
      state.tocEntry = action.payload;
    },
    setPageList: (state, action) => {
      state.pageList = action.payload;
    },
    setPublishers: (state, action) => {
      state.publishers = action.payload
    },
    setAuthors: (state, action) => {
      state.authors = action.payload
    },
    setIdentifier: (state, action) => {
      state.identifier = action.payload
    },
    setCoverUrl: (state, action) => {
      state.coverUrl = action.payload
    },
    setChapterHref: (state, action) => {
      state.chapterHref = action.payload
    },
    setA11yInfo: (state, action) => {
      state.a11yInfo = action.payload
    },
  }
});

// Action creators are generated for each case reducer function
export const { 
  setRunningHead,
  setFXL,
  setRTL,
  setProgression,
  setPublicationStart,
  setPublicationEnd,
  setTocTree,
  setTocEntry,
  setPublishers,
  setAuthors,
  setIdentifier,
  setCoverUrl,
  setPageList,
  setChapterHref,
  setA11yInfo, 
} = publicationSlice.actions;

export default publicationSlice.reducer;