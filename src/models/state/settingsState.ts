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
  paraIndent: number | null;
  paraSpacing: number | null;
  lineLength: number | null;
  letterSpacing: number | null;
  wordSpacing: number | null;
  publisherStyles: boolean;
  normalizeText: boolean;
  layoutStrategy: RSLayoutStrategy;
}