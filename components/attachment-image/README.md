# AttachmentImage Component

A flexible image display component that fetches and renders WordPress media attachments with responsive features and caption support. This component serves as a JavaScript companion to WordPress's `wp_get_attachment()` function.

## Features

- WordPress media integration with automatic attachment fetching
- Responsive image handling with srcSet support
- Multiple WordPress image sizes support
- Flexible caption display (media caption or custom)
- BEM-style CSS class generation
- Graceful handling of missing images
- Figure element wrapping with optional disable

## Usage

```jsx
import { AttachmentImage } from '@builtnorth/wp-component-library/components/attachment-image';

// Basic usage
<AttachmentImage 
    imageId={123} 
    size="large"
/>

// With caption and custom styling
<AttachmentImage
    imageId={456}
    size="full"
    showCaption={true}
    className="hero-image"
    wrapClass="hero-figure"
    aspectRatio="16/9"
    maxWidth="1200px"
/>

// Without figure wrapper
<AttachmentImage
    imageId={789}
    includeFigure={false}
    customAlt="Custom alt text"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageId` | `number` | Required | WordPress media attachment ID |
| `className` | `string` | `"image"` | CSS class for the img element |
| `customAlt` | `string` | - | Override default alt text from media library |
| `showCaption` | `boolean` | `false` | Display image caption below image |
| `wrapClass` | `string` | - | CSS class for the wrapper figure element |
| `includeFigure` | `boolean` | `true` | Wrap image in figure element |
| `size` | `string` | `"full"` | WordPress image size (thumbnail, medium, large, full, or custom) |
| `maxWidth` | `string` | `"100px"` | Maximum width for responsive sizing |
| `aspectRatio` | `string` | `"4/3"` | CSS aspect ratio value |
| `caption` | `string` | - | Custom caption text (overrides media caption) |

## WordPress Image Sizes

The component supports all registered WordPress image sizes:
- `thumbnail` - Small square crop
- `medium` - Medium size
- `large` - Large size
- `full` - Original uploaded size
- Custom sizes registered in your theme

## CSS Classes

The component generates BEM-style classes:
- Image: `{className}` (default: "image")
- Figure wrapper: `{wrapClass}` or `{className}__wrap`
- Caption: `{className}__caption`

## Examples

### Hero Image with Caption
```jsx
<AttachmentImage
    imageId={heroImageId}
    size="full"
    showCaption={true}
    className="hero"
    aspectRatio="21/9"
    maxWidth="100vw"
/>
```

### Gallery Thumbnail
```jsx
<AttachmentImage
    imageId={thumbnailId}
    size="thumbnail"
    className="gallery-item"
    includeFigure={false}
/>
```

### Responsive Card Image
```jsx
<AttachmentImage
    imageId={cardImageId}
    size="medium"
    className="card-image"
    aspectRatio="1/1"
    maxWidth="400px"
    customAlt="Product preview"
/>
```

## Notes

- The component uses WordPress's `core` data store to fetch media information
- If the image is not found, the component returns `null` gracefully
- Alt text priority: `customAlt` prop > media library alt > empty string
- The component automatically generates responsive srcSet for better performance
- Additional props can be passed through to the img element