import { ReadingDisplayFontFamilyOptions, ReadingDisplayLineHeightOptions, RSLayoutStrategy } from "../layout";

export interface ISettingsState {
  colCount: string;
  fontSize: number;
  fontFamily: keyof typeof ReadingDisplayFontFamilyOptions;
  lineHeight: ReadingDisplayLineHeightOptions;
  layoutStrategy: RSLayoutStrategy;
}