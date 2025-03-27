export interface PageListItem {
  id: string;
  href: string;
  title?: string;
  children?: PageListItem[];
}