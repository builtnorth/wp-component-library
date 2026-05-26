# WP Component Library

A comprehensive library of reusable React components, hooks, and utilities for WordPress block development. Built for use with `@wordpress/scripts` and the Gutenberg block editor.

## Installation

```bash
npm install @builtnorth/wp-component-library
```

## Components

### Icons

A full icon registry and picker system. Includes a WordPress data store (`wpcl/icons`), a modal-based picker UI with fuzzy search, library grouping, and virtualized rendering.

| Export | Description |
|---|---|
| `registerIconSet(id, options)` | Register a named icon library |
| `removeIconSet(id)` | Remove a registered library |
| `registerIcons(icons)` | Legacy alias — backwards compatible with theme bundles using `window.registerIcons` |
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
| `sectionHasCustomBackground()` | Utility — returns true when a custom section background (image or pattern) is active |
| `sectionHasPolarisSectionBackground()` | Deprecated alias of `sectionHasCustomBackground()` |
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

A pluggable, provider-agnostic AI content generation system. Works standalone or with any host plugin.

| Export | Description |
|---|---|
| `useAI(typeId, options)` | Core hook — calls the generation endpoint and manages state |
| `AIField` | Wraps a form field with an AI generate button |
| `AIButton` | Bare generate button |
| `AIInline` | Inline generation UI inside a block |
| `AIModal` | Full-modal generation UI |
| `AIPopover` | Floating popover with a prompt textarea |
| `AIFieldWrapper` | Alias of `AIField` (backwards compat) |
| `aiCache` | Memory + localStorage response cache (1 hr TTL) |
| `registerAIShortcuts(options?)` | Registers `Cmd/Ctrl+Alt+G` shortcut |
| `AIShortcutHandler` | Component that mounts the shortcut listener |
| `isAiEnabled()` | Gate — true when the AI policy is enabled |
| `isAiPolicyEnabled()` | Alias of `isAiEnabled()` |
| `isAiFullyConfigured()` | Gate — policy on AND provider key configured |
| `isAiSetupRequired()` | Gate — policy on but no provider yet |

#### Keyboard shortcut

`Cmd/Ctrl + Alt + G` — opens `AIPopover` over the selected `core/paragraph` or `core/heading` block. Only fires when a paragraph/heading is selected.

#### Standalone usage

Every component that has a gate accepts an explicit `enabled` prop so you can bypass the default gate check entirely. Point `useAI` at your own endpoint with `customEndpoint` or `buildRequest`.

```jsx
import { AIField, useAI, registerAIShortcuts } from "@builtnorth/wp-component-library";
import { TextControl } from "@wordpress/components";

// Register the shortcut with an explicit enabled flag
registerAIShortcuts({ enabled: true });

function MyTitleField({ value, onChange }) {
    return (
        <AIField
            enabled={ true }                          // bypass gate check
            type="my-plugin/title"
            value={ value }
            onChange={ onChange }
            aiOptions={{
                customEndpoint: "/your-plugin/v1/ai/generate",
                // or: buildRequest: (typeId, ctx) => ({ path: '...', method: 'POST', data: ctx })
            }}
        >
            <TextControl label="Page Title" value={ value } onChange={ onChange } />
        </AIField>
    );
}
```

`useAI` options:

| Option | Type | Description |
|---|---|---|
| `customEndpoint` | `string` | REST path to use for generation requests |
| `buildRequest` | `(typeId, context) => apiFetchOptions` | Fully custom request builder |
| `context` | `Object` | Static context merged into every request |
| `onChange` | `Function` | Called with the generated value |
| `skipCache` | `boolean` | Skip cache on every request |
| `cacheTimeout` | `number` | Cache TTL in ms (default: 3 600 000 = 1 hr) |

---

## Requirements

- WordPress 6.5+
- `@wordpress/scripts`

## Credits

Several patterns and ideas in this library were inspired by the excellent open-source work from **[10up](https://github.com/10up)**, particularly [`@10up/block-components`](https://github.com/10up/block-components). Their `registerBlockExtension` API and icon picker concepts were especially influential in shaping the equivalent features here. We're grateful for the work they've done for the WordPress developer community.

## Disclaimer

This library is provided "as is" without warranty of any kind. Always test components in your specific environment before deploying to production.
