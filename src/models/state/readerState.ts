import { LayoutDirection, ReadingDisplayFontFamilyOptions } from "../layout";
import { RSPaginationStrategy } from "../layout";
import { IPlatformModifier } from "../shortcut";

export interface IReaderState {
  direction: LayoutDirection;
  isImmersive: boolean;
  isHovering: boolean;
  hasArrows: boolean;
  isFullscreen: boolean;
  isPaged: boolean;
  colCount: string;
  paginationStrategy: RSPaginationStrategy;
  fontFamily: keyof typeof ReadingDisplayFontFamilyOptions;
  platformModifier: IPlatformModifier;
}