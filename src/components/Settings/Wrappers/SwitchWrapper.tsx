import settingsStyles from "../../assets/styles/readerSettings.module.css";

import { ISettingsSwitchProps } from "@/models/settings";

import { Heading, Switch, SwitchProps } from "react-aria-components";

export const SwitchWrapper: React.FC<SwitchProps & ISettingsSwitchProps> = ({
  name,
  className,
  heading, 
  label,
  onChangeCallback,
  selected,
  disabled,
  readOnly,
  ...props
}) => {
  return(
    <>
    <div className={ className }>
      { heading && <Heading className={ settingsStyles.readerSettingsLabel }>{ heading }</Heading> }
      <Switch 
        name={ name }
        className={ settingsStyles.readerSettingsSwitch }
        isSelected={ selected }
        onChange={ onChangeCallback }
        isDisabled={ disabled }
        isReadOnly={ readOnly }
        { ...props }
      >
        <div className={ settingsStyles.readerSettingsSwitchIndicator } />
        { label }
      </Switch>
    </div>
    </>
  )
}