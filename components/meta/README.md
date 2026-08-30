# Meta Components

Components for post meta in the Gutenberg editor.

## MetaPanel

Adds a button to the document sidebar that opens a modal for editing post meta fields. Used by plugins such as Polaris Directory and Polaris Reviews.

```jsx
import { MetaPanel } from "@builtnorth/wp-component-library";
import { TextControl } from "@wordpress/components";

function ListingMetaPanel({ postMeta, onChange }) {
	return (
		<MetaPanel title="Listing Details" postType="polaris_listing">
			<TextControl
				label="Website"
				value={postMeta.polaris_directory_website_url || ""}
				onChange={(value) => onChange({ polaris_directory_website_url: value })}
			/>
		</MetaPanel>
	);
}
```

Restrict to a post type with the `postType` prop. Meta fields must be registered with `show_in_rest => true`.

## Meta-gated editor visibility

For blocks that support meta-gated visibility (via wp-utility on the frontend), use:

- `useMetaGatedEditorVisibility` — hook for custom editor UI
- `isMetaValueEmpty` — shared empty check
- `isTemplateEditorSurface` — detect template/template-part editor context

See `meta-gated-editor.js` and the `meta-gated-editor-visibility` filter in wp-blocks.

## Template bindings

For template parts and patterns, bind blocks to post meta with the Block Bindings API in block markup:

```html
<!-- wp:image {"metadata":{"bindings":{"id":{"source":"core/post-meta","args":{"key":"polaris_directory_logo_id"}}}}} -->
```

Register meta on the post type in your plugin's `post_types_config.php`.
