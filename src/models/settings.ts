import { ComponentType, SVGProps } from "react";
import { ReadingDisplayAlignOptions, ReadingDisplayLineHeightOptions, RSLayoutStrategy } from "./layout";
import { ThemeKeys } from "./theme";
import { PressEvent, TooltipProps } from "react-aria-components";

export enum SettingsContainerKeys {
  initial = "initial",
  text = "text",
  spacing = "spacing"
}

export enum SettingsKeys {
  align = "align",
  columns = "columns",
  fontFamily = "fontFamily",
  fontWeight = "fontWeight",
  hyphens = "hyphens",
  layout = "layout",
  lineHeight = "lineHeight",
  spacing = "spacing",
  text = "text",
  theme = "theme",
  zoom = "zoom"
}

export enum TextSettingsKeys {
  align = "align",
  fontFamily = "fontFamily",
  fontWeight = "fontWeight",
  hyphens = "hyphens"
}

export const defaultTextSettingsMain = [TextSettingsKeys.fontFamily];

export const defaultTextSettingsOrder = [
  TextSettingsKeys.fontFamily,
  TextSettingsKeys.fontWeight,
  TextSettingsKeys.align,
  TextSettingsKeys.hyphens
]

export enum SpacingSettingsKeys {
  lineHeight = "lineHeight"
}

export const defaultSpacingSettingsMain = [SpacingSettingsKeys.lineHeight];

export const defaultSpacingSettingsOrder = [
  SpacingSettingsKeys.lineHeight
]

export const defaultLineHeights = {
  [ReadingDisplayLineHeightOptions.small]: 1.25,
  [ReadingDisplayLineHeightOptions.medium]: 1.5,
  [ReadingDisplayLineHeightOptions.large]: 1.75
}

export interface ISettingsMapObject {
  Comp: React.FC<IAdvancedDisplayProps> | React.ComponentType<any>;
  props?: any;
}

export interface IAdvancedIconProps {
  className?: string;
  ariaLabel: string;
  placement: TooltipProps["placement"];
  tooltipLabel: string;
  onPressCallback: (e: PressEvent) => void;
  isDisabled?: boolean;
}

export interface IAdvancedDisplayProps {
  standalone?: boolean;
}

export interface ISettingsSteppersProps {
  decrementIcon: ComponentType<SVGProps<SVGElement>>;
  decrementLabel: string;
  incrementIcon: ComponentType<SVGProps<SVGElement>>;
  incrementLabel: string;
}

export interface ISettingsNumberFieldProps {
  standalone?: boolean;
  className?: string;
  label: string;
  defaultValue?: number;
  value: number;
  onChangeCallback: (value: number) => void;
  range: [number, number];
  step: number;
  steppers: ISettingsSteppersProps;
  format?: Intl.NumberFormatOptions;
  disabled?: boolean;
  wheelDisabled?: boolean;
  virtualKeyboardDisabled?: boolean;
  readOnly?: boolean;
}

export interface ISettingsSwitchProps {
  name?: string;
  className?: string;
  heading?: string;
  label: string;
  onChangeCallback: (isSelected: boolean) => void;
  selected: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface IRCSSSettings {
  paginated: boolean;
  colCount: string;
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  lineHeight: ReadingDisplayLineHeightOptions;
  align: ReadingDisplayAlignOptions | null;
  hyphens: boolean | null;
  layoutStrategy: RSLayoutStrategy;
  theme: ThemeKeys;
}