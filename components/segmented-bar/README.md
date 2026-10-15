# SegmentedBar Component

A row of equal segments, one per item, each in a status color. Use it for "3 of 4 on" summaries where each part matters, not just the total.

## Usage

```jsx
import { SegmentedBar } from '@siratik/wp-component-library';

<SegmentedBar
	label="Firewall: 3 of 4 on"
	segments={ [
		{ key: 'waf', intent: 'success' },
		{ key: 'exploits', intent: 'success' },
		{ key: 'xmlrpc', intent: 'warning' },
		{ key: 'bots', intent: 'success' },
	] }
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `segments` | `Array<{key: string, intent: string}>` | - | One segment each, in order. `intent` is `'success'`, `'warning'`, `'error'`, `'info'` or `'default'` (neutral gray) |
| `label` | `string` | - | Accessible summary. The bar is announced as an image with this label |
| `height` | `number` | `6` | Segment height in px |
| `className` | `string` | `''` | Additional CSS classes |

Colors come from the shared status palette (`statusColor`), so they match `Badge` and the score charts.
