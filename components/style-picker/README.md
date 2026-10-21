# StylePicker

One option out of a few, shown like core's block **Styles** panel: a two-column grid of
buttons with the chosen one filled. Use it for a block setting that reads like a style
but is an attribute, such as a button's variant, where a toggle group would be too
cramped.

It renders core's own markup and classes (`block-editor-block-styles__*`), so it matches
the Styles panel exactly and needs no styles of its own. It works anywhere the block
editor's styles load (block inspector controls).

```js
import { StylePicker } from "@siratik/wp-component-library";

<StylePicker
    label={__("Button Variant", "my-plugin")}
    value={variant}
    options={[
        { value: "primary", label: __("Primary", "my-plugin") },
        { value: "secondary", label: __("Secondary", "my-plugin") },
        { value: "tertiary", label: __("Tertiary", "my-plugin") },
        { value: "text-link", label: __("Text Link", "my-plugin") },
    ]}
    onChange={(next) => setAttributes({ variant: next })}
/>;
```

| Prop | Type | Notes |
|------|------|-------|
| `label` | string | The group's label (shown, or screen-reader only with `hideLabelFromVision`). |
| `help` | string | Optional help text. |
| `value` | string | The chosen option's value. |
| `options` | `{ value, label }[]` | Options, in order. |
| `onChange` | function | Receives the chosen value. |
| `hideLabelFromVision` | boolean | Keep the label for screen readers only. |
| `className` | string | Optional class on the control. |
