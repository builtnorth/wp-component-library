# AttributesPanel Component

A ToolsPanel-based component that provides attribute management for blocks in the Site Editor, with ComboboxControl for selecting from available meta fields and HTML attributes.

## Features

- Uses WordPress ToolsPanel for consistent UI
- ComboboxControl populated with:
  - Common HTML attributes (id, class, style, etc.)
  - ARIA attributes
  - Data attributes
  - Available post meta fields
- Dynamic attribute addition/removal
- Per-attribute reset functionality
- Global reset all attributes

## Usage

```jsx
import { AttributesPanel, useAttributes } from '@siratik/wp-component-library/components/attributes-panel';

function MyComponent() {
	const { attributes, setAttributes } = useAttributes([
		{ id: 'id', label: 'ID', value: '' },
		{ id: 'alt', label: 'Alt Text', value: '' }
	]);

	return (
		<AttributesPanel
			attributes={attributes}
			onChange={setAttributes}
			panelId="my-attributes-panel"
		/>
	);
}
```

## Props

### AttributesPanel

- `attributes` (Array): Array of attribute objects with `id`, `label`, and `value` properties
- `onChange` (Function): Callback when attributes change, receives updated attributes array
- `panelId` (string): Unique ID for the tools panel (default: 'attributes-panel')

### useAttributes Hook

Returns an object with:
- `attributes`: Current attributes array
- `setAttributes`: Set entire attributes array
- `updateAttribute(id, value)`: Update a specific attribute
- `addAttribute(label, value)`: Add new attribute
- `removeAttribute(id)`: Remove attribute by id
- `resetAttributes()`: Reset all attribute values
- `getAttributeValue(id)`: Get value for specific attribute

## Site Editor Integration

The component is integrated into the Site Editor for specific core blocks (image, paragraph, heading, button) via the block extension system. It automatically:

1. Detects when in Site Editor context
2. Shows appropriate default attributes for each block type
3. Populates ComboboxControl with available meta fields
4. Saves attributes to block's customAttributes array

## Available Attribute Options

The ComboboxControl is populated with:

### HTML Attributes
- id, class, style, title, alt, rel, target, href, src

### Data Attributes
- data-id, data-type, data-value

### ARIA Attributes
- aria-label, aria-describedby, aria-hidden

### Meta Fields
- All available post meta fields (prefixed with "Meta:")
- Common WordPress meta fields like _thumbnail_id, _wp_page_template

Users can also type custom attribute names not in the list.

## Security

The panel refuses event handler attribute names (anything starting with `on`, such as `onclick`) and `javascript:`, `vbscript:` and `data:` URLs in URL attributes (`href`, `src`, `srcset`, `action`, `formaction`, `poster`, `xlink:href`). This is only a guard in the editor UI. Saved attributes can still be changed by other means, so the code that outputs them must:

- allowlist the attribute names it renders, and
- escape every value on output (`esc_attr()`, and `esc_url()` for URL attributes).

`isUnsafeAttributeName()` and `isUnsafeAttributeValue()` are exported from this module so consumers can reuse the same checks.
