/**
 * Emotion styled components for the Icon Picker.
 */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button } from "@wordpress/components";

/** Supports Phosphor (fill) and Lucide (stroke) SVG sources. */
const iconSvgColorStyles = css`
	svg[fill="none"] {
		fill: none;
		stroke: currentColor;
	}

	svg:not([fill="none"]) {
		fill: currentColor;
	}
`;

// ─── Modal (matches core's icon block picker, WP 7.1) ─────────────────────────
// Values copy core's `.wp-block-icon__inserter-*` rules (block-library
// editor.css) and the vertical tabs of @wordpress/ui, which core bundles
// privately.

const WIDE = "@media (min-width: 782px)";

/** Sidebar: search + collection tabs. Fixed beside the grid on wide screens. */
export const PickerSidebar = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding-bottom: 24px;

	${WIDE} {
		overflow-x: visible;
		overflow-y: auto;
		position: absolute;
		top: 72px;
		left: 0;
		bottom: 0;
		width: 280px;
		box-sizing: border-box;
		padding-top: 24px;
		padding-inline: 24px;
	}
`;

export const TabList = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;
`;

export const Tab = styled.button`
	display: flex;
	align-items: center;
	width: 100%;
	min-height: 40px;
	padding: 8px 12px;
	margin: 0;
	border: none;
	border-radius: 2px;
	background: transparent;
	box-shadow: none;
	color: #1e1e1e;
	font-family: inherit;
	font-size: 13px;
	font-weight: 400;
	line-height: 1.2;
	text-align: start;
	white-space: nowrap;
	cursor: pointer;
	outline: none;

	&[aria-selected="true"] {
		background-color: #ededed;
	}

	&:focus-visible {
		box-shadow: inset 0 0 0 var(--wp-admin-border-width-focus, 2px)
			var(--wp-admin-theme-color, #3858e9);
	}

	.wpcl-icon-picker__tab-label {
		flex-grow: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	svg {
		flex-shrink: 0;
		margin-inline-end: -4px;
		opacity: 0;
		fill: currentColor;
	}

	&[aria-selected="true"] svg,
	&:hover svg,
	&:focus-visible svg {
		opacity: 1;
	}

	&:dir(rtl) svg {
		rotate: 180deg;
	}

	@media (forced-colors: active) {
		&[aria-selected="true"] {
			outline: 1px solid CanvasText;
		}
	}
`;

/** The current tab's icons. */
export const PickerPanel = styled.div`
	outline: none;

	${WIDE} {
		margin-inline-start: 280px;
	}
`;

export const PickerLoading = styled.div`
	display: flex;
	justify-content: center;
	padding: 24px;
`;

export const PickerNoResults = styled.div`
	display: flex;
	justify-content: center;
`;

export const IconGridList = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
`;

/** A components Button, so it keeps Button's hover, focus and primary colors. */
export const IconGridItem = styled(Button)`
	&.components-button {
		display: flex;
		flex-direction: column;
		height: auto !important;
	}
`;

export const IconGridItemIcon = styled.span`
	padding: 12px;

	svg {
		display: block;
		width: 24px;
		height: 24px;
	}

	${iconSvgColorStyles}
`;

export const IconGridItemTitle = styled.span`
	font-size: 12px;
	padding: 4px 4px 8px;
	overflow-wrap: break-word;
`;

// ─── Inspector panel picker ───────────────────────────────────────────────────

export const PickerPreview = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 20px;
	overflow: hidden;
	flex-shrink: 0;
	color: inherit;

	svg {
		width: 20px;
		height: 20px;
		display: block;
	}

	${iconSvgColorStyles}
`;

export const PickerName = styled.span`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

// ─── Toolbar picker ───────────────────────────────────────────────────────────

export const ToolbarIconWrap = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	overflow: hidden;
	flex-shrink: 0;

	/* Match wp-blocks toolbar rules; overrides SVG width/height attributes. */
	svg {
		display: block;
		width: 24px !important;
		height: 24px !important;
		min-width: 0;
		min-height: 0;
		max-width: 24px;
		max-height: 24px;
	}

	${iconSvgColorStyles}
`;

// ─── Inline (canvas) picker ───────────────────────────────────────────────────
// div[role="button"] avoids UA button color which would break currentColor.

export const InlinePickerWrap = styled.div`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	svg {
		display: block;
	}

	${iconSvgColorStyles}
`;
