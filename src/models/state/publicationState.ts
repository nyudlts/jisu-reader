import { AccessibilityInfo } from "@/helpers/a11y/a11yInfo";
import { IProgression } from "../progression";
import { TocItem } from "../toc";
import { PageListItem } from "../pageList";

export interface IPublicationState {
  runningHead?: string;
  isFXL: boolean;
  isRTL: boolean;
  progression: IProgression;
  atPublicationStart: boolean;
  atPublicationEnd: boolean;
  tocTree?: TocItem[];
  tocEntry?: string;
  pageList?: PageListItem[];
  chapterHref?: string;
  authors?: string[];
  publishers?: string[];
  identifier?: string;
  coverUrl?: string;
  a11yInfo?: AccessibilityInfo;
}