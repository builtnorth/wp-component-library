# Badge Component

A small status indicator component that displays text with semantic colors, based on the WordPress Gutenberg Badge component design.

## Usage

```jsx
import { Badge } from '@builtnorth/wp-component-library';

// Basic usage
<Badge intent="success">Passed</Badge>

// With icon
<Badge intent="error" showIcon>Critical</Badge>

// Custom icon
<Badge intent="info" icon={customIcon}>Custom</Badge>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string\|node` | - | Badge text content |
| `intent` | `string` | `'default'` | Visual intent: `'default'`, `'error'`, `'critical'`, `'warning'`, `'info'`, `'suggestion'`, `'success'`, `'passed'` |
| `showIcon` | `boolean` | `true` | Whether to show an icon based on intent |
| `icon` | `Object` | `null` | Custom icon to display (overrides showIcon) |
| `className` | `string` | `''` | Additional CSS classes |

## Intent Colors

- **error/critical**: Red background with red text
- **warning**: Yellow background with amber text  
- **info/suggestion**: Blue background with blue text
- **success/passed**: Green background with green text
- **default**: Gray background with dark gray text

## Examples

### Status Indicators
```jsx
<Badge intent="success">Active</Badge>
<Badge intent="error">Failed</Badge>
<Badge intent="warning">Pending</Badge>
<Badge intent="info">New</Badge>
```

### SEO Analysis Results
```jsx
<Badge intent="critical">Critical</Badge>
<Badge intent="warning">Warning</Badge>
<Badge intent="suggestion">Suggestion</Badge>
<Badge intent="passed">Passed</Badge>
```

### With Icons
```jsx
<Badge intent="success" showIcon>Complete</Badge>
<Badge intent="error" showIcon>Error</Badge>
<Badge intent="info" showIcon>Info</Badge>
```