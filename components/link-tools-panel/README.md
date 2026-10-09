# Link Tools Panel

Link settings for a block: a URL (WordPress's link search), "Use post permalink", "Open in new tab" and, opt-in, the link's `rel`.
WordPress's `LinkControl` is laid out for popovers; here it sits flush and fills the panel's width.

## Usage

```jsx
import { LinkToolsPanel, LinkToolsPanelItems } from '@builtnorth/wp-component-library';

// Its own "Link" panel (sidebar or a toolbar popover)
<LinkToolsPanel
	link={ link }
	opensInNewTab={ opensInNewTab }
	isPermalink={ isPermalink }
	onChange={ ( changes ) => setAttributes( changes ) }
	panelId={ `${ clientId }-link` }
/>

// Inside a panel the block already has
<ToolsPanel label="Settings">
	<LinkToolsPanelItems
		link={ link }
		opensInNewTab={ opensInNewTab }
		isPermalink={ isPermalink }
		onChange={ ( changes ) => setAttributes( changes ) }
	/>
</ToolsPanel>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `link` | `string` | `''` | Link URL |
| `opensInNewTab` | `boolean` | `false` | Whether the link opens in a new tab |
| `isPermalink` | `boolean` | `false` | Use the current post's permalink instead of `link` |
| `onChange` | `Function` | - | Called with the changed values, e.g. `{ link }` or `{ opensInNewTab }` |
| `panelId` | `string` | - | The surrounding panel's `panelId`. Items only register with a panel whose id matches |
| `isShownByDefault` | `boolean` | `true` | Whether URL and "Open in new tab" show before they have a value |
| `showPermalink` | `boolean` | `true` | Whether to offer "Use post permalink"; pass `false` for blocks with no such setting |
| `permalinkHelp` | `string` | generic | Help text for "Use post permalink" |
| `newTabHelp` | `string` | - | Help text shown while "Open in new tab" is on |
| `showRel` | `boolean` | `false` | Whether to offer "Link rel"; only for blocks that save and render it |
| `rel` | `string` | `''` | Link rel, e.g. `nofollow sponsored` |

`LinkToolsPanel` also accepts `label` (panel title, default "Link") and `className`.

`LINK_DEFAULTS` holds the default values (`{ link: '', opensInNewTab: false, isPermalink: false, rel: '' }`). `LinkToolsPanel`'s reset only clears `rel` when `showRel` is on.
