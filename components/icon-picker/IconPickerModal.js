/**
 * Icon Picker Modal
 *
 * The shared modal used by all three picker variants (inspector, toolbar, inline).
 * Looks and behaves like the icon picker of WordPress core's Icon block (WP 7.1),
 * which core does not export, rebuilt with @wordpress/components:
 *   - Full-screen "Icon library" modal.
 *   - Sidebar: search (debounced) and vertical tabs, "All" then one tab per
 *     registered icon set (on WP 7.1+ these are core's icon collections).
 *   - Grid of icon buttons (icon + label), rendered in batches; the selected
 *     icon is a primary button, scrolled into view on open.
 *   - Opens on the selected icon's set, else the first set.
 *   - Search matches the current tab's icon names and labels.
 *
 * Keyboard: Arrow Up/Down (Home/End) move between tabs; the grid is one tab
 * stop, with arrow keys (Home/End) to move between icons. Escape closes.
 */

import { Modal, SearchControl, Spinner } from "@wordpress/components";
import { useAsyncList, useDebounce, useInstanceId } from "@wordpress/compose";
import {
	memo,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "@wordpress/element";
import { __, isRTL } from "@wordpress/i18n";
import { chevronRight, Icon as WPIcon } from "@wordpress/icons";

import { useIconPickerGroups } from "./hooks";
import {
	IconGridItem,
	IconGridItemIcon,
	IconGridItemTitle,
	IconGridList,
	PickerLoading,
	PickerNoResults,
	PickerPanel,
	PickerSidebar,
	Tab,
	TabList,
} from "./styles";
import { safeSvgSource } from "./utils";

/** Icons rendered per batch, like core. */
const BATCH_SIZE = 20;

/** Search delay in ms, like core. */
const SEARCH_DEBOUNCE = 300;

/** The "All" tab's value. */
const ALL = "";

/**
 * Lowercase, trimmed and accent-free, for search matching.
 *
 * @param {string} input
 * @returns {string}
 */
function normalizeSearch(input = "") {
	return String(input)
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.trim()
		.toLowerCase();
}

/**
 * Whether a set is the one a saved icon belongs to: by name, or by one of
 * the set's `aliases` (older set names, e.g. a theme set a core collection
 * replaced).
 *
 * @param {Object} group
 * @param {string} iconSet
 * @returns {boolean}
 */
function isSetOf(group, iconSet) {
	if (!iconSet) {
		return false;
	}
	return (
		group.name === iconSet ||
		(Array.isArray(group.aliases) && group.aliases.includes(iconSet))
	);
}

/**
 * @param {Object} icon
 * @returns {string}
 */
const iconKey = (icon) => `${icon.iconSet}::${icon.name}`;

/**
 * Single icon button — memoized so batches and focus moves only re-render
 * the cells that change.
 */
// eslint-disable-next-line no-shadow -- named for React DevTools.
const IconGridCell = memo(function IconGridCell({
	icon,
	isSelected,
	isTabStop,
	onSelect,
	onFocusCell,
	cellRef,
}) {
	const label = icon.label || icon.name;

	return (
		<IconGridItem
			ref={cellRef}
			__next40pxDefaultSize
			variant={isSelected ? "primary" : undefined}
			className="wpcl-icon-picker__item"
			tabIndex={isTabStop ? 0 : -1}
			aria-current={isSelected ? "true" : undefined}
			data-icon-key={iconKey(icon)}
			onClick={() => onSelect(icon)}
			onFocus={() => onFocusCell(iconKey(icon))}
		>
			<IconGridItemIcon
				aria-hidden="true"
				dangerouslySetInnerHTML={{ __html: safeSvgSource(icon.source) }}
			/>
			<IconGridItemTitle>{label}</IconGridItemTitle>
		</IconGridItem>
	);
});

/**
 * The icon grid: core's layout, rendered in batches, one tab stop.
 *
 * @param {Object}   props
 * @param {Array}    props.icons          Icons to show.
 * @param {Function} props.isSelectedIcon Whether an icon is the saved one.
 * @param {Function} props.onSelect
 */
function IconGrid({ icons, isSelectedIcon, onSelect }) {
	const shownIcons = useAsyncList(icons, { step: BATCH_SIZE });
	const listRef = useRef(null);
	const selectedRef = useRef(null);
	const [activeKey, setActiveKey] = useState(null);

	const selectedIndex = useMemo(
		() => icons.findIndex(isSelectedIcon),
		[icons, isSelectedIcon],
	);

	// The roving tab stop: the last focused icon, else the selected one, else the first.
	const tabStopKey = useMemo(() => {
		if (activeKey && shownIcons.some((icon) => iconKey(icon) === activeKey)) {
			return activeKey;
		}
		if (selectedIndex >= 0 && selectedIndex < shownIcons.length) {
			return iconKey(icons[selectedIndex]);
		}
		return shownIcons[0] ? iconKey(shownIcons[0]) : null;
	}, [activeKey, shownIcons, selectedIndex, icons]);

	// Like core: once the selected icon has rendered (with a batch after it),
	// scroll it to the middle, unless the user already scrolled.
	const isReadyToScroll =
		selectedIndex >= 0 &&
		(shownIcons.length >= selectedIndex + BATCH_SIZE ||
			shownIcons.length === icons.length);

	useLayoutEffect(() => {
		const node = selectedRef.current;
		if (!isReadyToScroll || !node) {
			return;
		}
		const scroller = node.closest(".components-modal__content");
		if (scroller?.scrollTop) {
			return;
		}
		node.scrollIntoView({ block: "center" });
	}, [isReadyToScroll]);

	const handleKeyDown = useCallback(
		(event) => {
			const list = listRef.current;
			if (!list) {
				return;
			}
			const cells = Array.from(
				list.querySelectorAll(":scope > .wpcl-icon-picker__item"),
			);
			const current = cells.indexOf(event.target);
			if (current < 0) {
				return;
			}

			const columns = Math.max(
				1,
				window
					.getComputedStyle(list)
					.gridTemplateColumns.split(" ")
					.filter(Boolean).length,
			);
			const forward = isRTL() ? "ArrowLeft" : "ArrowRight";
			const back = isRTL() ? "ArrowRight" : "ArrowLeft";

			let next;
			switch (event.key) {
				case forward:
					next = current + 1;
					break;
				case back:
					next = current - 1;
					break;
				case "ArrowDown":
					next = current + columns;
					break;
				case "ArrowUp":
					next = current - columns;
					break;
				case "Home":
					next = 0;
					break;
				case "End":
					next = cells.length - 1;
					break;
				default:
					return;
			}

			event.preventDefault();
			next = Math.min(Math.max(next, 0), cells.length - 1);
			cells[next]?.focus();
		},
		[],
	);

	if (!icons.length) {
		return (
			<PickerNoResults>
				<p>{__("No results found.", "wp-component-library")}</p>
			</PickerNoResults>
		);
	}

	return (
		<IconGridList
			ref={listRef}
			role="group"
			aria-label={__("Icon library", "wp-component-library")}
			onKeyDown={handleKeyDown}
		>
			{shownIcons.map((icon, index) => {
				const key = iconKey(icon);
				return (
					<IconGridCell
						key={key}
						icon={icon}
						isSelected={index === selectedIndex}
						isTabStop={key === tabStopKey}
						onSelect={onSelect}
						onFocusCell={setActiveKey}
						cellRef={index === selectedIndex ? selectedRef : undefined}
					/>
				);
			})}
		</IconGridList>
	);
}

/**
 * Vertical tabs, like core's: arrow keys move and select.
 *
 * @param {Object}   props
 * @param {Array<{ value: string, label: string }>} props.tabs
 * @param {string}   props.value
 * @param {Function} props.onChange
 * @param {string}   props.idBase
 */
function CollectionTabs({ tabs, value, onChange, idBase }) {
	const refs = useRef([]);

	const handleKeyDown = (event, index) => {
		let next;
		switch (event.key) {
			case "ArrowDown":
				next = (index + 1) % tabs.length;
				break;
			case "ArrowUp":
				next = (index - 1 + tabs.length) % tabs.length;
				break;
			case "Home":
				next = 0;
				break;
			case "End":
				next = tabs.length - 1;
				break;
			default:
				return;
		}
		event.preventDefault();
		onChange(tabs[next].value);
		refs.current[next]?.focus();
	};

	return (
		<TabList
			role="tablist"
			aria-orientation="vertical"
			aria-label={__("Icon collections", "wp-component-library")}
		>
			{tabs.map((tab, index) => {
				const isSelected = tab.value === value;
				return (
					<Tab
						key={tab.value || "all"}
						ref={(node) => {
							refs.current[index] = node;
						}}
						type="button"
						role="tab"
						id={`${idBase}-tab-${index}`}
						aria-selected={isSelected}
						aria-controls={`${idBase}-panel`}
						tabIndex={isSelected ? 0 : -1}
						onClick={() => onChange(tab.value)}
						onKeyDown={(event) => handleKeyDown(event, index)}
					>
						<span className="wpcl-icon-picker__tab-label">
							{tab.label}
						</span>
						<WPIcon icon={chevronRight} size={24} />
					</Tab>
				);
			})}
		</TabList>
	);
}

/**
 * The modal itself.
 *
 * @param {Object}   props
 * @param {Object}   props.value       Currently selected icon ({ name, iconSet, source }).
 * @param {Function} props.onChange    Called with the new icon value on selection.
 * @param {Function} props.onClose     Called when the modal should close.
 */
export function IconPickerModal({ value, onChange, onClose }) {
	const idBase = useInstanceId(IconPickerModal, "wpcl-icon-picker");
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const debouncedSetSearch = useDebounce(setSearch, SEARCH_DEBOUNCE);
	const [currentTab, setCurrentTab] = useState(null);

	const { groups, hasPending } = useIconPickerGroups();

	const valueName = value?.name;
	const valueSet = value?.iconSet;
	const valueSource = value?.source;

	// Whether a grid icon is the saved one: same name in the saved set (or a
	// set aliasing it). Values without a set (some consumers pass the registry
	// icon itself) match on name and SVG source.
	const isSelectedIcon = useCallback(
		(icon) => {
			if (!valueName || icon.name !== valueName) {
				return false;
			}
			if (valueSet) {
				const group = groups.find((item) => item.name === icon.iconSet);
				return Boolean(group && isSetOf(group, valueSet));
			}
			return Boolean(valueSource) && icon.source === valueSource;
		},
		[groups, valueName, valueSet, valueSource],
	);

	const selectedGroup = useMemo(
		() =>
			groups.find((group) =>
				valueSet
					? isSetOf(group, valueSet)
					: group.icons.some(isSelectedIcon),
			),
		[groups, valueSet, isSelectedIcon],
	);

	const tabs = useMemo(
		() => [
			{ value: ALL, label: __("All", "wp-component-library") },
			...groups.map((group) => ({
				value: group.name,
				label: group.label || group.name,
			})),
		],
		[groups],
	);

	const tabValue =
		currentTab !== null && tabs.some((tab) => tab.value === currentTab)
			? currentTab
			: (selectedGroup?.name ?? groups[0]?.name ?? ALL);
	const tabIndex = Math.max(
		0,
		tabs.findIndex((tab) => tab.value === tabValue),
	);
	const tabGroup =
		tabValue === ALL ? null : groups.find((group) => group.name === tabValue);

	const isTabLoading = tabGroup
		? tabGroup.loadStatus === "idle" || tabGroup.loadStatus === "loading"
		: hasPending;

	const tabIcons = useMemo(
		() =>
			tabValue === ALL
				? groups.flatMap((group) => group.icons)
				: (groups.find((group) => group.name === tabValue)?.icons ?? []),
		[groups, tabValue],
	);

	const haystack = useMemo(
		() =>
			tabIcons.map(
				(icon) =>
					`${normalizeSearch(icon.name)}\n${normalizeSearch(icon.label ?? "")}`,
			),
		[tabIcons],
	);

	const filteredIcons = useMemo(() => {
		const term = normalizeSearch(search);
		if (!term) {
			return tabIcons;
		}
		return tabIcons.filter((icon, index) => haystack[index].includes(term));
	}, [search, tabIcons, haystack]);

	const handleSearch = useCallback(
		(next) => {
			setSearchInput(next);
			debouncedSetSearch(next);
		},
		[debouncedSetSearch],
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

	return (
		<Modal
			className="wpcl-icon-picker-modal"
			title={__("Icon library", "wp-component-library")}
			onRequestClose={onClose}
			isFullScreen
		>
			<PickerSidebar>
				<SearchControl
					__nextHasNoMarginBottom
					value={searchInput}
					onChange={handleSearch}
				/>
				<CollectionTabs
					tabs={tabs}
					value={tabValue}
					onChange={setCurrentTab}
					idBase={idBase}
				/>
			</PickerSidebar>
			<PickerPanel
				role="tabpanel"
				id={`${idBase}-panel`}
				aria-labelledby={`${idBase}-tab-${tabIndex}`}
				tabIndex={-1}
			>
				{isTabLoading ? (
					<PickerLoading
						role="status"
						aria-label={__("Loading…", "wp-component-library")}
					>
						<Spinner />
					</PickerLoading>
				) : (
					<IconGrid
						key={tabValue || "all"}
						icons={filteredIcons}
						isSelectedIcon={isSelectedIcon}
						onSelect={handleSelect}
					/>
				)}
			</PickerPanel>
		</Modal>
	);
}
