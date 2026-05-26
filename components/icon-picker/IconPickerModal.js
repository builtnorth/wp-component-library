/**
 * Icon Picker Modal
 *
 * The shared modal used by all three picker variants (inspector, toolbar, inline).
 * Features:
 *   - Fuzzy search across all sets via @leeoniya/ufuzzy
 *   - Set filter dropdown to narrow to a specific icon library
 *   - Grouped sections by icon set (sorted by priority, highest first)
 *   - Virtualized list via react-window — only visible rows rendered in the DOM,
 *     handles thousands of icons without performance degradation
 *   - Uniform row height (fits up to 4 lines of name text); names clamp at 4 lines
 *   - Currently selected icon shown in the modal header
 */

import { Global } from "@emotion/react";
import UFuzzy from "@leeoniya/ufuzzy";
import { Modal, SearchControl, SelectControl } from "@wordpress/components";
import { memo, useCallback, useMemo, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { VariableSizeList } from "react-window";

import { useGroupedIcons } from "./hooks";
import {
	CellButton,
	CellName,
	CellSvg,
	EmptyState,
	GroupHeader,
	HeaderSelectedInfo,
	HeaderSelectedSvg,
	IconCount,
	IconRow,
	modalGlobalStyles,
	ModalInner,
	SearchAndFilter,
	SetSelectorWrap,
	VirtualListWrap,
} from "./styles";

// Fuzzy search instance (created once, stateless and reusable)
const fuzzy = new UFuzzy();

// Grid + virtualization constants.
// ICON_ROW_HEIGHT must accommodate the CellButton height (108px) + row padding (4+4).
// This fixed height lets VariableSizeList virtualize without per-row measurement.
const COLUMNS = 8; // must match grid-template-columns in styles.js
const ICON_ROW_HEIGHT = 116; // px: cell (108) + top/bottom padding (4+4)
const HEADER_ROW_HEIGHT = 36; // px for group label rows
const LIST_HEIGHT = 520; // px — visible scroll viewport

/**
 * Minimal guard before rendering icon SVG strings.
 *
 * @param {string} source
 * @returns {string}
 */
function safeSvgSource(source) {
	if (typeof source === "string" && source.trimStart().startsWith("<svg")) {
		return source;
	}
	return "";
}

/**
 * Build a flat array of rows for VariableSizeList.
 *
 * Each entry is either:
 *   { type: 'header', label: string }
 *   { type: 'icons',  items: IconItem[] }
 */
function buildRows(groups) {
	const rows = [];
	for (const group of groups) {
		if (!group.icons.length) continue;
		rows.push({ type: "header", label: group.label });
		for (let i = 0; i < group.icons.length; i += COLUMNS) {
			rows.push({
				type: "icons",
				items: group.icons.slice(i, i + COLUMNS),
			});
		}
	}
	return rows;
}

/**
 * Single icon cell — memoized to avoid re-renders during scroll.
 */
const IconCell = memo(function IconCell({ icon, isSelected, onSelect }) {
	const handleClick = useCallback(() => onSelect(icon), [icon, onSelect]);
	const handleKeyDown = useCallback(
		(e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onSelect(icon);
			}
		},
		[icon, onSelect],
	);

	const displayName = icon.label || icon.name;

	return (
		<CellButton
			type="button"
			className={isSelected ? "is-selected" : undefined}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			title={displayName}
			aria-label={displayName}
			aria-pressed={isSelected}
		>
			{/* eslint-disable-next-line react/no-danger */}
			<CellSvg
				dangerouslySetInnerHTML={{ __html: safeSvgSource(icon.source) }}
			/>
			<CellName className="cell-name">{displayName}</CellName>
		</CellButton>
	);
});

/**
 * Row renderer for react-window VariableSizeList.
 * react-window passes an absolute-positioned `style` for each row.
 */
const RowRenderer = memo(function RowRenderer({ index, style, data }) {
	const { rows, selectedIcon, onSelect } = data;
	const row = rows[index];

	if (row.type === "header") {
		return <GroupHeader style={style}>{row.label}</GroupHeader>;
	}

	return (
		<IconRow style={style}>
			{row.items.map((icon) => (
				<IconCell
					key={`${icon.iconSet}::${icon.name}`}
					icon={icon}
					isSelected={
						selectedIcon?.name === icon.name &&
						selectedIcon?.iconSet === icon.iconSet
					}
					onSelect={onSelect}
				/>
			))}
		</IconRow>
	);
});

/**
 * The modal itself.
 *
 * @param {Object}   props
 * @param {Object}   props.value       Currently selected icon ({ name, iconSet, source }).
 * @param {Function} props.onChange    Called with the new icon value on selection.
 * @param {Function} props.onClose     Called when the modal should close.
 */
export function IconPickerModal({ value, onChange, onClose }) {
	const [search, setSearch] = useState("");
	const [selectedSet, setSelectedSet] = useState("");

	const groups = useGroupedIcons();

	const setOptions = useMemo(
		() => [
			{ label: __("All Libraries", "polaris-blocks"), value: "" },
			...groups.map((g) => ({ label: g.label, value: g.name })),
		],
		[groups],
	);

	const allIcons = useMemo(() => groups.flatMap((g) => g.icons), [groups]);

	const haystack = useMemo(
		() => allIcons.map((icon) => `${icon.label ?? ""} ${icon.name}`),
		[allIcons],
	);

	const filteredGroups = useMemo(() => {
		const setFiltered = selectedSet
			? groups.filter((g) => g.name === selectedSet)
			: groups;

		const term = search.trim();
		if (!term) return setFiltered;

		const idxs = fuzzy.filter(haystack, term);
		if (!idxs || !idxs.length) return [];

		const matchedKeys = new Set(
			idxs.map((i) => `${allIcons[i].iconSet}::${allIcons[i].name}`),
		);

		return setFiltered
			.map((g) => ({
				...g,
				icons: g.icons.filter((icon) =>
					matchedKeys.has(`${icon.iconSet}::${icon.name}`),
				),
			}))
			.filter((g) => g.icons.length > 0);
	}, [search, selectedSet, groups, allIcons, haystack]);

	const rows = useMemo(() => buildRows(filteredGroups), [filteredGroups]);

	// All icon rows share one fixed height; only headers differ.
	const getItemSize = useCallback(
		(index) =>
			rows[index]?.type === "header"
				? HEADER_ROW_HEIGHT
				: ICON_ROW_HEIGHT,
		[rows],
	);

	const totalIcons = useMemo(
		() => filteredGroups.reduce((acc, g) => acc + g.icons.length, 0),
		[filteredGroups],
	);

	const handleSelect = useCallback(
		(icon) => {
			onChange({
				name: icon.name,
				iconSet: icon.iconSet,
				source: icon.source,
				label: icon.label,
			});
			onClose();
		},
		[onChange, onClose],
	);

	const listData = useMemo(
		() => ({ rows, selectedIcon: value, onSelect: handleSelect }),
		[rows, value, handleSelect],
	);

	const headerActions = value?.source ? (
		<HeaderSelectedInfo>
			{__("Selected:", "polaris-blocks")}
			{/* eslint-disable-next-line react/no-danger */}
			<HeaderSelectedSvg
				dangerouslySetInnerHTML={{
					__html: safeSvgSource(value.source),
				}}
			/>
		</HeaderSelectedInfo>
	) : undefined;

	return (
		<>
			<Global styles={modalGlobalStyles} />
			<Modal
				title={__("Choose Icon", "polaris-blocks")}
				headerActions={headerActions}
				size="large"
				onRequestClose={onClose}
				className="polaris-icon-picker-modal"
			>
				<ModalInner>
					<SearchAndFilter>
						<SearchControl
							__nextHasNoMarginBottom
							value={search}
							onChange={setSearch}
							placeholder={__(
								"Search icons\u2026",
								"polaris-blocks",
							)}
						/>
						{groups.length > 1 && (
							<SetSelectorWrap>
								<SelectControl
									__nextHasNoMarginBottom
									value={selectedSet}
									options={setOptions}
									onChange={setSelectedSet}
									aria-label={__(
										"Filter by icon library",
										"polaris-blocks",
									)}
								/>
							</SetSelectorWrap>
						)}
					</SearchAndFilter>

					<IconCount>
						{totalIcons > 0
							? sprintf(
									/* translators: %d = number of icons found */
									__("%d icon(s) found", "polaris-blocks"),
									totalIcons,
								)
							: __("No icons found.", "polaris-blocks")}
					</IconCount>

					{rows.length > 0 ? (
						<VirtualListWrap>
							<VariableSizeList
								height={LIST_HEIGHT}
								itemCount={rows.length}
								itemSize={getItemSize}
								itemData={listData}
								width="100%"
								className="polaris-icon-picker-modal__list"
							>
								{RowRenderer}
							</VariableSizeList>
						</VirtualListWrap>
					) : (
						<EmptyState>
							{groups.length === 0
								? __(
										"No icon sets registered.",
										"polaris-blocks",
									)
								: __(
										"No icons match your search.",
										"polaris-blocks",
									)}
						</EmptyState>
					)}
				</ModalInner>
			</Modal>
		</>
	);
}
