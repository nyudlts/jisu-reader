import { ReadingDisplayLineHeightOptions, RSLayoutStrategy } from "./layout";
import { ThemeKeys } from "./theme";

export enum SettingsKeys {
  zoom = "zoom",
  fontFamily = "fontFamily",
  lineHeight = "lineHeight",
  layout = "layout",
  theme = "theme",
  columns = "columns"
}

export interface IRCSSSettings {
  paginated: boolean;
  colCount: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: ReadingDisplayLineHeightOptions;
  layoutStrategy: RSLayoutStrategy;
  theme: ThemeKeys;
}