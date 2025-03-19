import { 
  ReadingDisplayAlignOptions, 
  ReadingDisplayFontFamilyOptions, 
  ReadingDisplayLineHeightOptions, 
  RSLayoutStrategy 
} from "../layout";

export interface ISettingsState {
  colCount: string;
  fontSize: number;
  fontFamily: keyof typeof ReadingDisplayFontFamilyOptions;
  lineHeight: ReadingDisplayLineHeightOptions;
  align: ReadingDisplayAlignOptions | null;
  hyphens: boolean | null;
  layoutStrategy: RSLayoutStrategy;
}