import { 
  ReadingDisplayAlignOptions, 
  ReadingDisplayFontFamilyOptions, 
  ReadingDisplayLineHeightOptions, 
  RSLayoutStrategy 
} from "../layout";

export interface ISettingsState {
  align: ReadingDisplayAlignOptions;
  colCount: string;
  fontFamily: keyof typeof ReadingDisplayFontFamilyOptions;
  fontSize: number;
  fontWeight: number;
  hyphens: boolean | null;
  layoutStrategy: RSLayoutStrategy;
  letterSpacing: number | null;
  lineHeight: ReadingDisplayLineHeightOptions;
  lineLength: number | null;
  tmpLineLengths: number[];
  tmpMaxChars: boolean;
  tmpMinChars: boolean;
  normalizeText: boolean;
  paraIndent: number | null;
  paraSpacing: number | null;
  publisherStyles: boolean;
  wordSpacing: number | null;
}