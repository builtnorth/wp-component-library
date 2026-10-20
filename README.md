# Siratik WP Component Library

A comprehensive library of reusable React components, hooks, and utilities for WordPress block development. Built for use with `@wordpress/scripts` and the Gutenberg block editor.

## Installation

```bash
npm install @siratik/wp-component-library
```

## Components

### Icons

A full icon registry and picker system. Includes a WordPress data store (`wpcl/icons`), a modal-based picker UI with fuzzy search, library grouping, and virtualized rendering.

| Export | Description |
|---|---|
| `registerIconSet(set)` | Register a named icon library (eager `icons` or lazy `load`) |
| `removeIconSet(id)` | Remove a registered library |
| `loadIconSet(name)` | Load one lazy library on demand |
| `loadAllIconSets()` | Load every pending lazy library (picker calls this) |
| `registerIcons(set)` | Legacy alias — prefer `registerIconSet` |
| `iconStore` / `ICON_STORE_NAME` | The underlying `@wordpress/data` store (`wpcl/icons`) |
| `useIconSets()` | Hook — returns all registered icon sets |
| `useAllIcons()` | Hook — returns every icon across all sets |
| `useIcons(setId)` | Hook — returns icons for a specific set |
| `useIcon(name)` | Hook — resolves a single icon by name |
| `useGroupedIcons()` | Hook — icons grouped by set with headers |
| `Icon` | Renders a single SVG icon |
| `IconPicker` | Inspector panel control (preview + modal trigger) |
| `IconPickerToolbarButton` | Toolbar button variant of the picker |
| `InlineIconPicker` | Inline block-canvas picker |
| `IconPickerModal` | The modal itself — embeddable standalone |

```jsx
import { registerIconSet, IconPicker } from "@siratik/wp-component-library";

// Eager library
registerIconSet({
    name: "my-icons",
    label: "My Icons",
    priority: 10,
    icons: [{ name: "star", label: "Star", source: "<svg>...</svg>" }],
});

// Lazy library (code-split — loads when the picker opens)
registerIconSet({
    name: "home-services",
    label: "Home Services",
    priority: 120,
    load: () => import("./home-services.js").then((m) => m.homeServicesIcons),
});
```

Theme editor bundles (separate webpack builds) should use `window.wpcl.icons.registerIconSet`
from the wp-blocks bootstrap — not a direct import — so the store is not duplicated.

---

### Block Extension

A drop-in replacement for `@10up/block-components` `registerBlockExtension`. Extends any block (or all blocks) with extra attributes and inspector controls using WordPress hook filters — no block source changes required.

| Export | Description |
|---|---|
| `registerBlockExtension(blockName, options)` | Extend one or more blocks with attributes and controls |
| `unregisterBlockExtension(blockName, extensionName)` | Remove a previously registered extension |

```jsx
import { registerBlockExtension } from "@siratik/wp-component-library";
import { InspectorAdvancedControls } from "@wordpress/block-editor";
import { ToggleControl } from "@wordpress/components";

registerBlockExtension("core/paragraph", {
    extensionName: "my-extension",
    attributes: {
        hideOnMobile: { type: "boolean", default: false },
    },
    classNameGenerator: ({ hideOnMobile }) =>
        hideOnMobile ? "is-hidden-mobile" : "",
    Edit: ({ attributes, setAttributes }) => (
        <InspectorAdvancedControls>
            <ToggleControl
                label="Hide on mobile"
                checked={attributes.hideOnMobile}
                onChange={(value) => setAttributes({ hideOnMobile: value })}
            />
        </InspectorAdvancedControls>
    ),
});
```

**Options:**

| Option | Type | Description |
|---|---|---|
| `extensionName` | `string` | Unique identifier for this extension |
| `attributes` | `Object` | Extra attribute definitions (same shape as `block.json`) |
| `Edit` | `Component` | React component rendered in the block sidebar |
| `classNameGenerator` | `(attrs) => string` | Returns a CSS class string added to the block |
| `inlineStyleGenerator` | `(attrs) => Object` | Returns inline styles added to the block |
| `order` | `'before'\|'after'` | Whether `Edit` renders before or after the block's own controls. Default: `'after'` |

Pass `"*"` or `"all"` as `blockName` to extend every registered block. Arrays of block names are also supported.

---

### Media & Images

Consistent media upload controls across all editor contexts.

| Export | Description |
|---|---|
| `AttachmentImage` | Displays a WordPress attachment with responsive srcset support |
| `EditorMediaUpload` | Media upload for the block canvas |
| `InspectorMediaUpload` | Media upload for the inspector sidebar |
| `SettingsMediaUpload` | Media upload for settings pages |
| `ToolbarMediaUpload` | Media upload as a toolbar button |
| `ImageControls` | Focal point, object-fit, and aspect ratio controls |
| `useAspectRatioOptions()` | Hook — standard aspect ratio option set |

```jsx
import { InspectorMediaUpload } from "@siratik/wp-component-library";

<InspectorMediaUpload
    buttonTitle="Upload Logo"
    onSelect={handleSelect}
    onRemove={handleRemove}
    imageId={attributes.logoId}
    imageUrl={attributes.logoUrl}
/>
```

---

### Data & Query

Post query builder controls that compose into a consistent query panel.

| Export | Description |
|---|---|
| `PostTypeSelect` | Post type picker |
| `TaxonomySelect` | Taxonomy term picker |
| `PostsPerPageControl` | Per-page number control |
| `ColumnCountControl` | Grid column count control |
| `OrderBySelect` / `defaultOrderOptions` | Sort order selector |
| `DisplayTypeSelect` | Display mode picker |
| `SelectionModeControl` | Manual vs. automatic post selection toggle |
| `ManualPostSelector` | Searchable manual post picker |
| `ManualTermSelector` | Searchable manual term picker |
| `HideCurrentPostControl` | Toggle to exclude the current post |
| `CardTemplatePartSelect` / `CardTemplatePartPanel` | Card template part selector |
| `getDefaultCardSlugForPostType()` | Utility — resolves default card slug |
| `reorderByIds()` | Utility — reorders a post array to match a saved ID order |
| `useOrderedTerms()` | Hook — returns terms in stored sort order |

---

### Form & Input

| Export | Description |
|---|---|
| `AttributesPanel` | Dynamic HTML attribute editor (id, rel, title, etc.) |
| `useAttributes()` | Hook for managing the attributes array state |
| `SortableSelect` | Token field with drag-to-reorder |
| `tokensToString()` | Utility — converts token array to comma string |
| `VariableField` | Text input with `@`-triggered variable autocomplete |
| `VariableInserter` | Standalone variable insertion toolbar button |
| `CaptchaPlaceholder` | Editor placeholder for CAPTCHA fields (multi-provider) |

---

### Repeater

Drag-and-drop repeatable item list.

| Export | Description |
|---|---|
| `Repeater` | The repeater container |
| `DragHandle` | Drag handle sub-component |
| `RemoveButton` | Remove item sub-component |

```jsx
import { Repeater } from "@siratik/wp-component-library";

<Repeater
    items={items}
    renderItem={renderItem}
    onAdd={handleAdd}
    onRemove={handleRemove}
    onReorder={handleReorder}
    addButtonText="Add Item"
/>
```

---

### Meta

| Export | Description |
|---|---|
| `MetaPanel` | Document sidebar modal for editing post meta |
| `useMetaGatedEditorVisibility` | Hide meta-gated blocks in loop previews when meta is empty |
| `isMetaValueEmpty` | Shared empty check for meta-gated visibility |
| `isTemplateEditorSurface` | Detect template / template-part editor context |

---

### Block Appender

Customisable appender buttons for inner blocks.

| Export | Description |
|---|---|
| `CustomBlockAppender` | Standard appender |
| `CustomColumnAppender` | Column-context appender |
| `CustomInlineAppender` | Inline canvas appender |
| `CustomInspectorAppender` | Inspector sidebar appender |

---

### Badge

| Export | Description |
|---|---|
| `Badge` | Small status/label badge component |

---

### SegmentedBar

| Export | Description |
|---|---|
| `SegmentedBar` | Row of status-colored segments, one per item ("3 of 4 on") |

---

### Button

| Export | Description |
|---|---|
| `ButtonFrontend` | Minimal frontend button — safe to use outside the editor |

---

## Requirements

- WordPress 6.5+
- `@wordpress/scripts`

## Credits

Several patterns and ideas in this library were inspired by the excellent open-source work from **[10up](https://github.com/10up)**, particularly [`@10up/block-components`](https://github.com/10up/block-components). Their `registerBlockExtension` API and icon picker concepts were especially influential in shaping the equivalent features here. We're grateful for the work they've done for the WordPress developer community.

## License

GPL-3.0-or-later — see `LICENSE`.

## Disclaimer

This software is provided "as is", without warranty of any kind, express or
implied, including the warranties of merchantability and fitness for a
particular purpose. To the extent permitted by applicable law, the authors and
copyright holders, together with their parent, subsidiary, and affiliated
companies and contributors, are not liable for any direct, indirect,
incidental, or consequential damages arising from its use or inability to use
it, including loss of data, revenue, or site availability.

The software does not guarantee that your site is secure, ranks in search
results, or complies with privacy or other laws; that remains the site owner's
responsibility. AI-generated content can be inaccurate and should be reviewed
before publishing. Third-party services the software connects to are governed
by their own terms.

Keep a current backup and test changes on a staging site before applying them
to a live site. See sections 15 and 16 of the GNU General Public License,
version 3, for the full terms.
