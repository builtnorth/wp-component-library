# WP Component Library

A comprehensive library of reusable React components, hooks, and utilities for WordPress block development. Built for use with `@wordpress/scripts` and the Gutenberg block editor.

## Installation

```bash
npm install @builtnorth/wp-component-library
```

## Components

### Icons

A full icon registry and picker system. Includes a WordPress data store (`polaris/icons`), a modal-based picker UI with fuzzy search, library grouping, and virtualized rendering.

| Export | Description |
|---|---|
| `registerIconSet(id, options)` | Register a named icon library |
| `removeIconSet(id)` | Remove a registered library |
| `registerIcons(icons)` | Legacy alias — backwards compatible with theme bundles using `window.registerIcons` |
| `iconStore` / `ICON_STORE_NAME` | The underlying `@wordpress/data` store |
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
import { registerIconSet, IconPicker } from "@builtnorth/wp-component-library";

// Register a custom library
registerIconSet("my-icons", {
    label: "My Icons",
    priority: 10,
    icons: [
        { name: "star", label: "Star", source: "<svg>...</svg>" },
    ],
});

// Use in block edit
<IconPicker
    value={attributes.icon}
    onChange={(icon) => setAttributes({ icon })}
/>
```

---

### Block Extension

A drop-in replacement for `@10up/block-components` `registerBlockExtension`. Extends any block (or all blocks) with extra attributes and inspector controls using WordPress hook filters — no block source changes required.

| Export | Description |
|---|---|
| `registerBlockExtension(blockName, options)` | Extend one or more blocks with attributes and controls |
| `unregisterBlockExtension(blockName, extensionName)` | Remove a previously registered extension |

```jsx
import { registerBlockExtension } from "@builtnorth/wp-component-library";
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
import { InspectorMediaUpload } from "@builtnorth/wp-component-library";

<InspectorMediaUpload
    buttonTitle="Upload Logo"
    onSelect={handleSelect}
    onRemove={handleRemove}
    imageId={attributes.logoId}
    imageUrl={attributes.logoUrl}
/>
```

---

### Section Components

Controls for full-width section blocks with backgrounds, dividers, and patterns.

| Export | Description |
|---|---|
| `SectionSettings` | Complete section background panel (image, color, gradient, video) |
| `SectionBackground` | Background source selector sub-control |
| `FocalPointControl` | Focal point picker for background images |
| `ImageSourceControl` | Featured image vs. custom image toggle |
| `MediaSelectControl` | Inline media selection sub-control |
| `OpacityControl` | Background overlay opacity slider |
| `StyleControl` | Style variant selector |
| `SectionDividerSettings` | Top/bottom decorative divider shape picker |
| `sectionHasDividerBackground()` | Utility — returns true when a divider background color is set |
| `sectionHasPolarisSectionBackground()` | Utility — returns true when polaris section background is active |
| `SectionPattern` | SVG background pattern renderer |
| `SectionPatternSettings` | Pattern picker and position controls |

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
import { Repeater } from "@builtnorth/wp-component-library";

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
| `MetaPanel` | Renders a post meta field in the block inspector |
| `MetaAdvanced` | Advanced meta field controls |

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

### Button

| Export | Description |
|---|---|
| `ButtonFrontend` | Minimal frontend button — safe to use outside the editor |

---

### AI Framework

A pluggable AI content generation system.

| Export | Description |
|---|---|
| `AIButton` | Trigger button for AI generation |
| `AIField` | AI-enhanced input field |
| `AIFieldWrapper` | Layout wrapper for AI fields |
| `AIInline` | Inline AI generation UI |
| `AIModal` | Full-screen AI generation modal |
| `aiCache` | Request deduplication / response cache |
| `useAI()` | Core AI hook |
| `isAiEnabled()` | Gate — returns true when AI is configured |
| `isAiPolicyEnabled()` | Gate — returns true when AI policy is accepted |
| `isAiFullyConfigured()` | Gate — both enabled and policy accepted |
| `isAiSetupRequired()` | Gate — setup is needed |

---

## Requirements

- WordPress 6.5+
- `@wordpress/scripts`

## Credits

Several patterns and ideas in this library were inspired by the excellent open-source work from **[10up](https://github.com/10up)**, particularly [`@10up/block-components`](https://github.com/10up/block-components). Their `registerBlockExtension` API and icon picker concepts were especially influential in shaping the equivalent features here. We're grateful for the work they've done for the WordPress developer community.

## Disclaimer

This library is provided "as is" without warranty of any kind. Always test components in your specific environment before deploying to production.
