/**
 * Icon Picker Modal
 *
 * The shared modal used by all three picker variants (inspector, toolbar, inline).
 * Features:
 *   - Fuzzy search across all sets via @leeoniya/ufuzzy
 *   - Set filter dropdown to narrow to a specific icon library
 *   - Grouped sections by icon set (sorted by priority, highest first)
 *   - Plain scrollable grid — no virtualization needed; CSS handles equal-width
 *     columns and naturally adapting row heights via align-items: stretch
 *   - Currently selected icon shown in the modal header
 */

import { Modal, SearchControl, SelectControl } from "@wordpress/components";
import { useMemo, useState, useCallback, memo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Global } from "@emotion/react";
import UFuzzy from "@leeoniya/ufuzzy";

import { useGroupedIcons } from "./hooks";
import {
	modalGlobalStyles,
	ModalInner,
	SearchAndFilter,
	SetSelectorWrap,
	IconCount,
	GroupHeader,
	GroupSection,
	ScrollList,
	IconGrid,
	CellButton,
	CellSvg,
	CellName,
	EmptyState,
	HeaderSelectedInfo,
	HeaderSelectedSvg,
} from "./styles";

// Fuzzy search instance (created once, stateless and reusable)
const fuzzy = new UFuzzy();

// Column count must match grid-template-columns in styles.js
const COLUMNS = 8;

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
 * Single icon cell — memoized to avoid re-renders on search/filter changes.
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

	// Set filter options — "All Libraries" + one per registered set
	const setOptions = useMemo(
		() => [
			{ label: __("All Libraries", "polaris-blocks"), value: "" },
			...groups.map((g) => ({ label: g.label, value: g.name })),
		],
		[groups],
	);

	// Flat list of all icons for fuzzy search
	const allIcons = useMemo(() => groups.flatMap((g) => g.icons), [groups]);

	// Haystack strings for fuzzy matching — combine label and name
	const haystack = useMemo(
		() => allIcons.map((icon) => `${icon.label ?? ""} ${icon.name}`),
		[allIcons],
	);

	const filteredGroups = useMemo(() => {
		// 1. Apply set filter
		const setFiltered = selectedSet
			? groups.filter((g) => g.name === selectedSet)
			: groups;

		// 2. Apply fuzzy search
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

	// Renders to the left of the close button via the headerActions slot.
	const headerActions = value?.source ? (
		<HeaderSelectedInfo>
			{__("Selected:", "polaris-blocks")}
			{/* eslint-disable-next-line react/no-danger */}
			<HeaderSelectedSvg
				dangerouslySetInnerHTML={{ __html: safeSvgSource(value.source) }}
			/>
			{value.label || value.name}
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
							placeholder={__("Search icons\u2026", "polaris-blocks")}
						/>
						{groups.length > 1 && (
							<SetSelectorWrap>
								<SelectControl
									__nextHasNoMarginBottom
									value={selectedSet}
									options={setOptions}
									onChange={setSelectedSet}
									aria-label={__("Filter by icon library", "polaris-blocks")}
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

					{filteredGroups.length > 0 ? (
						<ScrollList>
							{filteredGroups.map((group) => (
								<GroupSection key={group.name}>
									<GroupHeader>{group.label}</GroupHeader>
									<IconGrid>
										{group.icons.map((icon) => (
											<IconCell
												key={`${icon.iconSet}::${icon.name}`}
												icon={icon}
												isSelected={
													value?.name === icon.name &&
													value?.iconSet === icon.iconSet
												}
												onSelect={handleSelect}
											/>
										))}
									</IconGrid>
								</GroupSection>
							))}
						</ScrollList>
					) : (
						<EmptyState>
							{groups.length === 0
								? __("No icon sets registered.", "polaris-blocks")
								: __("No icons match your search.", "polaris-blocks")}
						</EmptyState>
					)}
				</ModalInner>
			</Modal>
		</>
	);
}
