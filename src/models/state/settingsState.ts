import { 
  ReadingDisplayAlignOptions, 
  ReadingDisplayFontFamilyOptions, 
  ReadingDisplayLineHeightOptions, 
  RSLayoutStrategy 
} from "../layout";

export interface ISettingsState {
  colCount: string;
  fontSize: number;
  fontWeight: number;
  fontFamily: keyof typeof ReadingDisplayFontFamilyOptions;
  lineHeight: ReadingDisplayLineHeightOptions;
  align: ReadingDisplayAlignOptions;
  hyphens: boolean | null;
  layoutStrategy: RSLayoutStrategy;
}