import { AccessibilityInfo } from "@/helpers/a11y/a11yInfo";
import { IProgression } from "../progression";
import { TocItem } from "../toc";

export interface IPublicationState {
  runningHead?: string;
  isFXL: boolean;
  isRTL: boolean;
  progression: IProgression;
  atPublicationStart: boolean;
  atPublicationEnd: boolean;
  tocTree?: TocItem[];
  chapterHref?: string;
  authors?: string[];
  publishers?: string[];
  identifier?: string;
  coverUrl?: string;
  a11yInfo?: AccessibilityInfo;
}