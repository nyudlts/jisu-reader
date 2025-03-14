import { RSPaginationStrategy } from "./layout";
import { ThemeKeys } from "./theme";

export interface IRCSSSettings {
  paginated: boolean;
  colCount: string;
  paginationStrategy: RSPaginationStrategy;
  theme: ThemeKeys;
}