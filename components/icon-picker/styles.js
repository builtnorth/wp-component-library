/**
 * Emotion styled components for the Icon Picker.
 *
 * Global overrides (WordPress Modal internals, scrollbar) are applied via
 * the `Global` component from @emotion/react — imported where the modal renders.
 */
import { css } from "@emotion/react";
import styled from "@emotion/styled";

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

// ─── Modal container overrides ────────────────────────────────────────────────

export const modalGlobalStyles = css`
	.wpcl-icon-picker-modal {
		display: flex;
		flex-direction: column;
		max-height: 85vh;

		.components-modal__content {
			padding: 0;
			/* Single scroll container (the icon grid). Avoid nested scroll with search. */
			overflow: hidden;
			display: flex;
			flex-direction: column;
			flex: 1;
			min-height: 0;
		}
		.components-modal__header {
			padding: 8px 16px;
			border-bottom: 1px solid #e0e0e0;
			flex-shrink: 0;
		}
	}
`;

// ─── Modal inner layout ───────────────────────────────────────────────────────

export const ModalInner = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 12px 16px 16px;
	flex: 1;
	min-height: 0;
	overflow: hidden;
`;

/** Search, filter, and count — never scrolls away from the modal viewport. */
export const PickerControls = styled.div`
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	gap: 8px;
	position: sticky;
	top: 0;
	z-index: 2;
	background: #fff;
`;

// Search + set filter side-by-side with matched heights
export const SearchAndFilter = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;

	/* SearchControl takes remaining width */
	.components-search-control {
		flex: 1;
		margin-bottom: 0 !important;
	}

	/* Normalize input/select heights so they visually align */
	.components-search-control__input,
	.components-select-control__input {
		height: 36px !important;
		min-height: 36px !important;
		box-sizing: border-box;
	}

	.components-base-control {
		margin-bottom: 0 !important;
	}
`;

export const SetSelectorWrap = styled.div`
	flex-shrink: 0;
	width: 180px;
`;

export const IconCount = styled.p`
	margin: 0;
	font-size: 11px;
	color: #757575;
`;

// ─── Group header ─────────────────────────────────────────────────────────────

// react-window positioning slot — must not have margins (see GroupHeader).
export const GroupHeaderRow = styled.div`
	box-sizing: border-box;
	height: 100%;
`;

export const GroupHeader = styled.div`
	display: flex;
	align-items: center;
	padding: 0 4px;
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: #757575;
	border-bottom: 1px solid #f0f0f0;
	box-sizing: border-box;
	margin-bottom: 0.5rem;
	padding-bottom: 0.5rem;
	margin-top: 1rem;
`;

// ─── Icon grid body (list, loading, or empty) ─────────────────────────────────
// Fixed min-height keeps the modal from shrinking when search has no matches.

export const PickerBody = styled.div`
	flex: 1;
	min-height: 520px;
	overflow: hidden;
	display: flex;
	flex-direction: column;

	/* Scrollbar for the react-window outer div */
	.wpcl-icon-picker-modal__list::-webkit-scrollbar {
		width: 6px;
	}
	.wpcl-icon-picker-modal__list::-webkit-scrollbar-thumb {
		background: #c7c7c7;
		border-radius: 3px;
	}
`;

// ─── Icon grid row (used inside each virtualized row slot) ────────────────────
// Column count must match the COLUMNS constant in IconPickerModal.js.

export const IconRow = styled.div`
	display: grid;
	grid-template-columns: repeat(8, 1fr);
	gap: 8px;
	padding: 4px 0;
	box-sizing: border-box;
	align-items: stretch;
	height: 100%;
	overflow: hidden;
`;

// ─── Icon cell ────────────────────────────────────────────────────────────────
// Fixed height (accommodates up to 4 lines of name text) keeps all virtualized
// rows a uniform, predictable size. Width is controlled by the grid (1fr cols).

export const CellButton = styled.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	gap: 6px;
	padding: 14px 6px 8px;
	height: 108px;
	background: #fff;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	cursor: pointer;
	color: #1e1e1e;
	width: 100%;
	box-sizing: border-box;
	transition: border-color 0.1s ease;

	&:hover,
	&:focus-visible {
		border-color: #c7c7c7;

		.cell-name {
			text-decoration: underline;
		}
	}

	&:focus-visible {
		outline: 2px solid var(--wp-admin-theme-color, #007cba);
		outline-offset: -2px;
	}

	&.is-selected {
		border-color: var(--wp-admin-theme-color, #007cba);
		background: color-mix(
			in srgb,
			var(--wp-admin-theme-color, #007cba) 8%,
			#fff
		);

		.cell-name {
			color: var(--wp-admin-theme-color, #007cba);
			text-decoration: none;
		}
	}
`;

// CSS overrides SVG presentation attributes (e.g. width="256") since CSS
// has higher cascade priority than SVG presentation attributes.
export const CellSvg = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	flex-shrink: 0;
	overflow: hidden;

	svg {
		width: 24px;
		height: 24px;
		min-width: 24px;
		min-height: 24px;
		display: block;
	}

	${iconSvgColorStyles}
`;

// Clamps at 4 lines — the fixed cell height fits exactly 4 × 14.3px lines.
export const CellName = styled.span`
	font-size: 11px;
	line-height: 1.3;
	text-align: center;
	width: 100%;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 4;
	overflow: hidden;
	color: #757575;
`;

// ─── Empty state ──────────────────────────────────────────────────────────────

export const EmptyState = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 32px 16px;
	text-align: center;
	color: #757575;
	font-size: 13px;
`;

// ─── Selected icon info in modal header (headerActions slot) ─────────────────

export const HeaderSelectedInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 5px;
	font-size: 11px;
	color: #757575;
	white-space: nowrap;
	margin-right: 8px;
	padding: 0.25rem 0.5rem;
	background: #f0f0f0;
	border-radius: 3px;
`;

export const HeaderSelectedSvg = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 20px;
	overflow: hidden;
	flex-shrink: 0;
	color: #1e1e1e;

	svg {
		width: 20px;
		height: 20px;
		display: block;
	}

	${iconSvgColorStyles}
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
