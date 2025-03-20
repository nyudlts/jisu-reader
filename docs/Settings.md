# Settings

Settings can be customized extensively, and even nested in advanced components. The values for some settings can be customized as well.

## Display Order

You can customize the order of the actions in the `reflowOrder` or `fxlOrder` arrays, and remove them as well if you don’t want to expose some. 

Enum `SettingsKeys` is provided to keep things consistent across the entire codebase.

For instance:

```
settings: {
  ...
  reflowOrder: [
    SettingsKeys.zoom,
    SettingsKeys.fontFamily,
    SettingsKeys.theme,
    SettingsKeys.lineHeight,
    SettingsKeys.layout,
    SettingsKeys.columns
  ],
  fxlOrder: [
    SettingsKeys.zoom,
    SettingsKeys.theme,
    SettingsKeys.columns
  ]
}
```

Note that if you are using a standalone component in an Advanced component (either in `main` or `displayOrder`), it will be filtered so that it is not rendered twice.

### Standalone components

All settings components are standalone by default, which means you can organise them as you see fit to build your own Settings panel.

### Advanced components

`SettingsKey.text` and `SettingsKeys.spacing` are two advanced components in which you can nest other components.

Enums `TextSettingsKeys` and `SpacingSettingsKeys` list which components can be nested in these two.

When used, a button will be added to access the nested components.

## Text (optional)

The text object is responsible for the advanced Text Component, which provides an extra container to display more options.

### Main (optional)

The `main` property accepts an array of `TextSettingsKeys`. These components will be displayed in the SettingsPanel, with a button to access the components in `displayOrder`.

If all nestable components are listed in `main`, then the Text component behaves as if all its nested components are standalone, and will not create a button to access them – as they are already accessible.

### DisplayOrder (optional)

The components to display in the “sub-panel”, and their order. Note components listed in `main` will not automatically be added to this array.

## Spacing (optional)

The spacing object is responsible for the advanced Spacing Component, which provides an extra container to display more options.

### Main (optional)

The `main` property accepts an array of `SpacingSettingsKeys`. These components will be displayed in the SettingsPanel, with a button to access the components in `displayOrder`.

If all nestable components are listed in `main`, then the Spacing component behaves as if all its nested components are standalone, and will not create a button to access them – as they are already accessible.

### DisplayOrder (optional)

The components to display in the “sub-panel”, and their order. Note components listed in `main` will not automatically be added to this array.

### LineHeight (optional)

This allows to customize the value for line-heights. It must be a ratio (`number`).

For instance:

```
spacing:
  ... 
  lineHeight: {
    [ReadingDisplayLineHeightOptions.small]: 1.3,
    [ReadingDisplayLineHeightOptions.medium]: 1.5,
    [ReadingDisplayLineHeightOptions.large]: 1.75
  }
}
```