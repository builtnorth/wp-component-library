/**
 * Emotion styled components for the Icon Picker.
 *
 * Global overrides (WordPress Modal internals, scrollbar) are applied via
 * the `Global` component from @emotion/react — imported where the modal renders.
 */
import styled from "@emotion/styled";
import { css } from "@emotion/react";

// ─── Modal container overrides ────────────────────────────────────────────────

export const modalGlobalStyles = css`
	.polaris-icon-picker-modal {
		.components-modal__content {
			padding: 0;
		}
		.components-modal__header {
			padding: 8px 16px;
			border-bottom: 1px solid #e0e0e0;
		}
	}
`;

// ─── Modal inner layout ───────────────────────────────────────────────────────

export const ModalInner = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 12px 16px 16px;
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
`;

// ─── Scrollable icon list container ──────────────────────────────────────────

export const ScrollList = styled.div`
	overflow-y: auto;
	max-height: 520px;
	display: flex;
	flex-direction: column;
	gap: 12px;

	&::-webkit-scrollbar {
		width: 6px;
	}
	&::-webkit-scrollbar-thumb {
		background: #c7c7c7;
		border-radius: 3px;
	}
`;

// ─── Group section ────────────────────────────────────────────────────────────

export const GroupSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

// ─── Icon grid ────────────────────────────────────────────────────────────────
// Column count must match the COLUMNS constant in IconPickerModal.js.
// align-items: stretch makes every cell in a row the same height as the tallest.

export const IconGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(8, 1fr);
	gap: 8px;
	align-items: stretch;
`;

// ─── Icon cell ────────────────────────────────────────────────────────────────
// Width is controlled by the grid (equal 1fr columns).
// Height adapts naturally — all cells in the same row stretch to match the tallest.
// Selected state uses .is-selected class to avoid passing custom props to DOM.

export const CellButton = styled.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 6px;
	padding: 10px 6px 8px;
	min-height: 72px;
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
		fill: currentColor;
	}
`;

// Wraps naturally — the CSS grid row stretches all sibling cells to match height.
export const CellName = styled.span`
	font-size: 11px;
	line-height: 1.3;
	text-align: center;
	width: 100%;
	color: #757575;
`;

// ─── Empty state ──────────────────────────────────────────────────────────────

export const EmptyState = styled.div`
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
`;

export const HeaderSelectedSvg = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 16px;
	height: 16px;
	overflow: hidden;
	flex-shrink: 0;
	color: #1e1e1e;

	svg {
		width: 16px;
		height: 16px;
		fill: currentColor;
		display: block;
	}
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
		fill: currentColor;
		display: block;
	}
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
	width: 20px;
	height: 20px;
	overflow: hidden;

	svg {
		width: 20px;
		height: 20px;
		fill: currentColor;
		display: block;
	}
`;

// ─── Inline (canvas) picker ───────────────────────────────────────────────────
// div[role="button"] avoids UA button color which would break currentColor.

export const InlinePickerWrap = styled.div`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	svg {
		fill: currentColor;
		display: block;
	}
`;
