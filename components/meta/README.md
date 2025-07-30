# Meta Components

A collection of components for managing WordPress post meta fields within the Gutenberg block editor. These components enable two-way binding between block attributes and post meta fields, with special handling for image blocks.

## Overview

This system allows content editors to:

- Bind any block to a post meta field
- Automatically sync image data (ID, URL, alt text) between blocks and meta fields
- Use meta fields to create reusable content across templates
- Search and select from available meta fields via a dropdown interface

## Components

### MetaAdvanced

The main component that handles meta field binding for blocks. It:

- Provides a dropdown selector in the block's advanced inspector controls
- Automatically detects image blocks and syncs ID, URL, and alt text to separate meta fields
- Uses WordPress Block Bindings API for proper data synchronization
- Prevents unnecessary re-renders and updates through memoization and careful state management

**Supported Block Types:**

- `core/image` - Full support with automatic URL and alt text syncing
- `core/button` - Text content binding
- `core/paragraph` - Text content binding
- `polaris/features` - Custom block support
- Any block that implements the `metaField` attribute

### MetaFieldSelector

A ComboboxControl-based dropdown that:

- Displays all available post meta fields
- Filters out protected fields (starting with `_`)
- Excludes system fields (`wp_*`, `footnotes`)
- Hides companion fields (`*_image_url`, `*_image_alt`)
- Provides searchable interface with formatted labels
- Allows clearing selection to unbind

### MetaPanel

A reusable panel component for the document sidebar that:

- Adds a button to the post status panel
- Opens a modal for editing meta fields
- Can be restricted to specific post types
- Provides consistent UI for meta field management

### useMetaFields

A custom hook that:

- Fetches available meta fields from the current post
- Filters and formats fields for display
- Memoizes results for performance
- Returns options formatted for ComboboxControl

## Usage Examples

### Basic Implementation

```jsx
import { registerBlockExtension } from "@10up/block-components";
import { MetaAdvanced } from "@builtnorth/wp-component-library";

registerBlockExtension(["core/image", "core/button"], {
	extensionName: "meta-field",
	attributes: {
		metaField: {
			type: "string",
			default: "",
		},
	},
	Edit: (props) => <MetaAdvanced clientId={props.clientId} />,
});
```

### Image Block with Meta Binding

When an image block is bound to a meta field (e.g., `featured_image`):

- The image ID is saved to `featured_image`
- The image URL is saved to `featured_image_url`
- The alt text is saved to `featured_image_alt`

This allows you to use the image data in templates:

```html
<!-- wp:image {"metadata":{"bindings":{
    "id":{"source":"core/post-meta","args":{"key":"featured_image"}},
    "url":{"source":"core/post-meta","args":{"key":"featured_image_url"}},
    "alt":{"source":"core/post-meta","args":{"key":"featured_image_alt"}}
}}} -->
```

### Custom Meta Panel

```jsx
import { MetaPanel } from "@builtnorth/wp-component-library";
import { TextControl } from "@wordpress/components";

function MyMetaFields() {
	return (
		<MetaPanel title="SEO Settings" postType="post" buttonText="Edit SEO">
			<TextControl label="Meta Title" />
			<TextControl label="Meta Description" />
		</MetaPanel>
	);
}
```

## Use Cases

### 1. Reusable Images Across Templates

Bind an image block to a meta field like `company_logo` to use the same image across multiple templates without re-uploading.

### 2. Dynamic Content Areas

Create template parts with blocks bound to meta fields like `hero_title`, `hero_content`, allowing editors to update content that appears in multiple places.

### 3. Product Information

For e-commerce sites, bind blocks to product meta like `product_price`, `product_description`, `product_image` for consistent display across archives and single templates.

### 4. Author/Team Bios

Bind image and text blocks to meta fields like `author_photo`, `author_bio` for consistent author information across posts.

### 5. Event Details

For event sites, bind blocks to `event_date`, `event_location`, `event_featured_image` for standardized event displays.

## Technical Details

### Meta Field Registration

Ensure your meta fields are registered with `show_in_rest` enabled:

```php
register_post_meta('post', 'featured_image', [
    'type' => 'integer',
    'single' => true,
    'show_in_rest' => true,
]);
```

### Block Bindings API

Requires WordPress 6.5+ for full Block Bindings API support. The system automatically:

- Creates proper binding configuration in block metadata
- Syncs data between blocks and meta on save
- Updates block display when meta values change

### Performance Optimizations

- Components are memoized to prevent unnecessary re-renders
- Meta updates only trigger when values actually change
- Separate `useSelect` calls for different data to minimize subscriptions
- Ref-based tracking to avoid update loops

## Requirements

- WordPress 6.5+
- Gutenberg plugin (optional, for latest features)
- Post types must have meta fields registered with REST API support
