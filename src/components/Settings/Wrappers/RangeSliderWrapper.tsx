import settingsStyles from "../../assets/styles/readerSettings.module.css";

import { ISettingsRangeSliderProps } from "@/models/settings";

import { Label, Slider, SliderOutput, SliderProps, SliderThumb, SliderTrack } from "react-aria-components";

import classNames from "classnames";

export const RangeSliderWrapper: React.FC<SliderProps & ISettingsRangeSliderProps> = ({
  standalone, 
  className,
  label,
  thumbLabels,
  defaultValue,
  value,
  onChangeCallback,
  range,
  step,
  ...props
}) => {
  return(
    <>
    <Slider 
      className={ classNames(settingsStyles.readerSettingsSlider, className) }
      defaultValue={ defaultValue }
      value={ value }
      minValue={ Math.min(...range) }
      maxValue={ Math.max(...range) }
      step={ step }
      onChange={ onChangeCallback }
      { ...(!standalone ? { "aria-label": label } : {}) }
      { ...props }
    >
      { standalone && <Label className={ classNames(settingsStyles.readerSettingsLabel, settingsStyles.readerSettingsSliderLabel) }>{ label }</Label> }
      <SliderOutput className={ settingsStyles.readerSettingsSliderOutput }>
      {({ state }) =>
          state.values.map((_, i) => state.getThumbValueLabel(i)).join(" – ")}
      </SliderOutput>
      <SliderTrack className={ settingsStyles.readerSettingsSliderTrack }>
        {({ state }) =>
          state.values.map((_, i) => (
            <SliderThumb 
              className={ settingsStyles.readerSettingsSliderThumb } 
              key={ i } 
              index={ i } 
              aria-label={thumbLabels?.[i]} 
            />
          ))}
      </SliderTrack>
    </Slider>
    </>
  )
}