# Button Component

A frontend button component for rendering styled buttons with accessibility features. This component provides a consistent button implementation with support for different sizes, styles, and screen reader text.

## Features

- Multiple button styles and sizes
- Screen reader support for accessibility
- BEM-style CSS class generation
- Flexible wrapper attributes
- Link target support for external links
- Consistent styling system

## Usage

```jsx
import { Button } from '@builtnorth/wp-component-library/components/button';

// Basic button
<Button 
    text="Click Me"
    link="/about"
/>

// Styled button with size variant
<Button
    text="Get Started"
    link="/signup"
    style="primary"
    size="large"
    className="cta-button"
/>

// External link with screen reader text
<Button
    text="View Report"
    link="https://example.com/report"
    target="_blank"
    screenReader="Opens in new window"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes for the wrapper |
| `size` | `string` | `"default"` | Button size variant (small, default, large, etc.) |
| `style` | `string` | `"default"` | Button style variant (default, primary, secondary, etc.) |
| `text` | `string` | `"Button Text"` | Button display text |
| `link` | `string` | `"#"` | Button URL/href |
| `target` | `string` | - | Link target attribute (_blank, _self, etc.) |
| `screenReader` | `string` | - | Additional text for screen readers |
| `wrapperAttributes` | `object` | - | Additional HTML attributes for wrapper |

## Button Styles

The component supports various style variants through the `style` prop:
- `default` - Standard button appearance
- `primary` - Primary action button
- `secondary` - Secondary action button
- Custom styles can be added via CSS

## Button Sizes

Available size variants through the `size` prop:
- `small` - Compact button
- `default` - Standard size
- `large` - Larger button
- Custom sizes can be defined via CSS

## CSS Classes

The component generates BEM-style classes:

### Wrapper Classes
- Base: `wp-block-polaris-button`
- Style modifier: `is-style-{style}`
- Size modifier: `is-size-{size}`
- Custom classes: Added via `className` prop

### Inner Elements
- Link text: `wp-block-polaris-button__text`
- Screen reader text: `screen-reader-text`

## Accessibility

### Screen Reader Support
Additional context for screen readers can be provided:
```jsx
<Button
    text="Download"
    link="/file.pdf"
    screenReader="PDF document, 2.5MB"
/>
```

### Target Attribute
When using `target="_blank"`, consider adding screen reader text:
```jsx
<Button
    text="External Site"
    link="https://example.com"
    target="_blank"
    screenReader="Opens in new window"
/>
```

## Examples

### Call-to-Action Button
```jsx
<Button
    text="Start Free Trial"
    link="/trial"
    style="primary"
    size="large"
    className="hero-cta"
/>
```

### Download Button
```jsx
<Button
    text="Download Guide"
    link="/downloads/guide.pdf"
    style="secondary"
    screenReader="PDF, 5MB"
    wrapperAttributes={{
        'data-track': 'download',
        'data-file': 'guide.pdf'
    }}
/>
```

### Navigation Button
```jsx
<Button
    text="Next Page"
    link="/page/2"
    size="small"
    className="pagination-button"
/>
```

### External Link Button
```jsx
<Button
    text="Visit Partner Site"
    link="https://partner.com"
    target="_blank"
    style="outline"
    screenReader="Opens partner.com in new window"
/>
```

## Styling

The component is designed to work with your theme's button styles. You can customize appearance by:

1. Using predefined style and size variants
2. Adding custom CSS classes via `className`
3. Defining CSS rules for the generated BEM classes
4. Using wrapper attributes for data attributes or additional HTML attributes

## Notes

- This is a presentational component that renders button-like elements using spans
- For actual form submissions or interactive buttons, use the WordPress Button component
- The component maintains consistent structure for reliable styling
- Screen reader text is properly hidden visually but remains accessible
- All props are optional with sensible defaults