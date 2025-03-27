import { combineReducers, configureStore } from "@reduxjs/toolkit";
import readerReducer from "@/lib/readerReducer";
import settingsReducer from "@/lib/settingsReducer";
import themeReducer from "@/lib/themeReducer";
import actionsReducer from "@/lib/actionsReducer";
import publicationReducer from "./publicationReducer";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("playground-state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state: object) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("playground-state", serializedState);
  } catch (err) {
    console.error(err);
  }
};

export const makeStore = () => {
  const preloadedState = loadState();
  const rootReducer = combineReducers({
    reader: readerReducer,
    settings: settingsReducer,
    theming: themeReducer,
    actions: actionsReducer,
    publication: publicationReducer
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];