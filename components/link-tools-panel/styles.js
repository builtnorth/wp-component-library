/**
 * Emotion styled components for the Link Tools Panel.
 */
import styled from "@emotion/styled";

/**
 * Wraps WordPress's LinkControl inside a tools panel.
 *
 * LinkControl is laid out for popovers: a 350px minimum width and 16px
 * gutters around each of its parts. In a tools panel the panel provides the
 * gutters, so the field sits flush and fills the panel's width.
 */
export const LinkField = styled.div`
	.block-editor-link-control {
		min-width: 0;
		width: 100%;
	}

	.block-editor-link-control__search-input-wrapper {
		margin-bottom: 0;
	}

	.block-editor-link-control__field {
		margin: 0;
	}

	.block-editor-url-input {
		min-width: 0;
		width: 100%;
	}

	/* A chosen link: its preview row. */
	.block-editor-link-control__preview {
		padding: 0;
	}

	.block-editor-link-control__search-actions {
		padding: 8px 0 0;
	}

	/* Search results: a bordered list under the field, as wide as the panel. */
	.block-editor-link-control__search-results-wrapper {
		margin-top: 4px;

		/* Core's scroll fades are positioned for the popover's gutters. */
		&::before,
		&::after {
			display: none;
		}
	}

	.block-editor-link-control__search-results {
		margin: 0;
		padding: 4px;
		max-height: 240px;
		overflow-x: hidden;
		background: var(--wp-components-color-background, #fff);
		border: 1px solid var(--wp-components-color-gray-300, #ddd);
		border-radius: 2px;
	}

	.block-editor-link-control__search-item.components-button {
		width: 100%;
		min-width: 0;
		height: auto;
		padding: 6px 8px;
	}

	.block-editor-link-control__search-item .components-menu-item__item,
	.block-editor-link-control__search-item .components-menu-item__info-wrapper {
		min-width: 0;
	}

	/* One line each for the title and URL, truncated to the panel's width. */
	.block-editor-link-control__search-item .components-menu-item__info-wrapper > * {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* The type label ("Page", "Attachment") doesn't fit; the icon shows the type. */
	.block-editor-link-control__search-item .components-menu-item__shortcut {
		display: none;
	}

	.block-editor-link-control__help {
		padding: 0;
	}
`;
