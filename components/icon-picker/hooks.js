/**
 * Icon Registry Hooks
 *
 * React hooks for reading icon data from the icon registry store.
 */

import { select as selectFromStore, useSelect } from "@wordpress/data";
import { useEffect, useMemo } from "@wordpress/element";

import { loadAllIconSets } from "./api";
import { STORE_NAME } from "./store";

/**
 * Get all registered icon sets, sorted by priority.
 *
 * @returns {Array} Icon set objects in priority order.
 */
export function useIconSets() {
	return useSelect((select) => select(STORE_NAME).getIconSets(), []);
}

/**
 * Get icons for all sets, each annotated with their `iconSet` name.
 * Returns sets in priority order for grouped rendering in the picker UI.
 *
 * @returns {Array<{ name, label, priority, icons: Array }>}
 */
export function useGroupedIcons() {
	return useSelect((select) => {
		const store = select(STORE_NAME);
		return store.getIconSets().map((set) => ({
			...set,
			icons: store.getIcons(set.name).map((icon) => ({
				...icon,
				iconSet: set.name,
			})),
		}));
	}, []);
}

/**
 * Get a flat list of all icons across all sets, each annotated with `iconSet`.
 * Useful for search across all sets.
 *
 * @returns {Array} Flat array of all icons.
 */
export function useAllIcons() {
	return useSelect((select) => {
		const store = select(STORE_NAME);
		return store.getIconSets().flatMap((set) =>
			store.getIcons(set.name).map((icon) => ({
				...icon,
				iconSet: set.name,
			})),
		);
	}, []);
}

/**
 * Get icons for a specific set, or all icons across all sets.
 *
 * Mirrors the 10up `useIcons(iconSetName)` hook signature.
 *   - No argument (or empty string): returns all icons flat, each with `iconSet`.
 *   - String argument: returns icons for that set only, each with `iconSet`.
 *
 * @param {string} [iconSetName] Optional set name to filter by.
 * @returns {Array} Array of icon objects.
 */
export function useIcons(iconSetName = "") {
	return useSelect((select) => {
		const store = select(STORE_NAME);
		if (iconSetName) {
			return store.getIcons(iconSetName).map((icon) => ({
				...icon,
				iconSet: iconSetName,
			}));
		}
		return store.getIconSets().flatMap((set) =>
			store.getIcons(set.name).map((icon) => ({
				...icon,
				iconSet: set.name,
			})),
		);
	}, [iconSetName]);
}

/**
 * Look up a single icon from the registry.
 *
 * @param {string} iconSetName
 * @param {string} iconName
 * @returns {Object|undefined}
 */
export function useIcon(iconSetName, iconName) {
	return useSelect(
		(select) => select(STORE_NAME).getIcon(iconSetName, iconName),
		[iconSetName, iconName],
	);
}

/**
 * Grouped icons for the picker modal — triggers lazy loading on mount.
 *
 * Groups are rebuilt only when a set changes (the store's sets map is
 * replaced on every change), not on every store update.
 *
 * @returns {{ groups: Array, isLoading: boolean, isInitialLoad: boolean, hasPending: boolean }}
 */
export function useIconPickerGroups() {
	const setsMap = useSelect(
		(select) => select(STORE_NAME).getIconSetsMap(),
		[],
	);

	const groups = useMemo(() => {
		const store = selectFromStore(STORE_NAME);
		return store.getIconSets().map((set) => ({
			...set,
			icons: store.getIcons(set.name).map((icon) => ({
				...icon,
				iconSet: set.name,
			})),
		}));
		// setsMap is the cache key: the store replaces it whenever a set changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setsMap]);

	const sets = Object.values(setsMap);
	const isLoading = sets.some((set) => set.loadStatus === "loading");
	const pendingSets = sets.filter(
		(set) => set.loadStatus === "idle" || set.loadStatus === "loading",
	);
	const hasPending = pendingSets.length > 0;
	const pendingKey = pendingSets.map((set) => set.name).join("\0");

	useEffect(() => {
		if (!pendingKey) {
			return;
		}

		loadAllIconSets().catch(() => {
			// Errors are stored on the set; picker shows empty/error state.
		});
	}, [pendingKey]);

	const iconCount = groups.reduce(
		(count, group) => count + group.icons.length,
		0,
	);

	return {
		groups,
		isLoading: hasPending || isLoading,
		isInitialLoad: (hasPending || isLoading) && iconCount === 0,
		hasPending,
	};
}
