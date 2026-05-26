/**
 * Icon Registry Store
 *
 * WordPress data store for managing icon sets and icons.
 * Replaces the 10up `tenup/icons` store with the `wpcl/icons` store.
 *
 * Filters available via @wordpress/hooks:
 *   - wpcl.icons.iconSet    — modify an icon set on registration
 *   - wpcl.icons.iconSets   — modify the full sorted list of icon sets
 *   - wpcl.icons.icon       — filter individual icons (return false to exclude)
 *
 * Icon sets may register with a lazy `load` function via registerIconSet() in api.js.
 * Until loaded, placeholder icons (e.g. essential defaults) remain available.
 */

import { createReduxStore, register, select } from "@wordpress/data";
import { applyFilters } from "@wordpress/hooks";

export const STORE_NAME = "wpcl/icons";

/** @typedef {'idle'|'loading'|'loaded'|'error'} IconSetLoadStatus */

const DEFAULT_STATE = {
	iconSets: {},
};

const storeSelectors = {
	/**
	 * Get all icon sets, sorted by priority descending (highest first).
	 * Applies the wpcl.icons.iconSets filter.
	 */
	getIconSets(state) {
		const sets = Object.values(state.iconSets);

		const sorted = [...sets].sort((a, b) => {
			const pa = a.priority ?? 0;
			const pb = b.priority ?? 0;
			if (pb !== pa) return pb - pa;
			return a.name.localeCompare(b.name);
		});

		return applyFilters("wpcl.icons.iconSets", sorted);
	},

	/**
	 * Get a specific icon set by name.
	 */
	getIconSet(state, name) {
		return state.iconSets[name] ?? null;
	},

	/**
	 * True when any registered set is still loading.
	 */
	isIconSetsLoading(state) {
		return Object.values(state.iconSets).some(
			(set) => set.loadStatus === "loading",
		);
	},

	/**
	 * True when any set is registered but not yet loaded (idle or loading).
	 */
	hasPendingIconSets(state) {
		return Object.values(state.iconSets).some(
			(set) => set.loadStatus === "idle" || set.loadStatus === "loading",
		);
	},

	/**
	 * Get all icons for a given set, with per-icon wpcl.icons.icon filter applied.
	 */
	getIcons(state, name) {
		const set = state.iconSets[name];
		if (!set) return [];

		return set.icons.reduce((acc, icon) => {
			const filtered = applyFilters("wpcl.icons.icon", icon, set);
			if (filtered !== false) {
				acc.push(filtered);
			}
			return acc;
		}, []);
	},

	/**
	 * Get a single icon by set + name.
	 */
	getIcon(state, iconSetName, iconName) {
		const set = state.iconSets[iconSetName];
		if (!set) return undefined;
		return set.icons.find((icon) => icon.name === iconName);
	},
};

const storeActions = {
	registerIconSet(iconSet) {
		return { type: "REGISTER_ICON_SET", iconSet };
	},
	setIconSetLoading(name) {
		return { type: "SET_ICON_SET_LOADING", name };
	},
	setIconSetIcons(name, icons) {
		return { type: "SET_ICON_SET_ICONS", name, icons };
	},
	setIconSetError(name, message) {
		return { type: "SET_ICON_SET_ERROR", name, message };
	},
	removeIconSet(name) {
		return { type: "REMOVE_ICON_SET", name };
	},
};

function reducer(state = DEFAULT_STATE, action) {
	switch (action.type) {
		case "REGISTER_ICON_SET": {
			const iconSet = applyFilters(
				"wpcl.icons.iconSet",
				action.iconSet,
			);
			const previous = state.iconSets[iconSet.name];
			const icons =
				iconSet.icons ??
				(previous?.icons?.length ? previous.icons : []);

			return {
				...state,
				iconSets: {
					...state.iconSets,
					[iconSet.name]: {
						...iconSet,
						icons,
						loadStatus: iconSet.loadStatus ?? "loaded",
						loadError: null,
					},
				},
			};
		}

		case "SET_ICON_SET_LOADING": {
			const set = state.iconSets[action.name];
			if (!set) return state;
			return {
				...state,
				iconSets: {
					...state.iconSets,
					[action.name]: {
						...set,
						loadStatus: "loading",
						loadError: null,
					},
				},
			};
		}

		case "SET_ICON_SET_ICONS": {
			const set = state.iconSets[action.name];
			if (!set) return state;
			return {
				...state,
				iconSets: {
					...state.iconSets,
					[action.name]: {
						...set,
						icons: action.icons,
						loadStatus: "loaded",
						loadError: null,
					},
				},
			};
		}

		case "SET_ICON_SET_ERROR": {
			const set = state.iconSets[action.name];
			if (!set) return state;
			return {
				...state,
				iconSets: {
					...state.iconSets,
					[action.name]: {
						...set,
						loadStatus: "error",
						loadError: action.message,
					},
				},
			};
		}

		case "REMOVE_ICON_SET": {
			if (!state.iconSets[action.name]) return state;
			const next = {
				...state,
				iconSets: { ...state.iconSets },
			};
			delete next.iconSets[action.name];
			return next;
		}

		default:
			return state;
	}
}

const iconStore = createReduxStore(STORE_NAME, {
	reducer,
	selectors: storeSelectors,
	actions: storeActions,
});

// Register only once (safe to call multiple times)
if (!select(STORE_NAME)) {
	register(iconStore);
}

export { iconStore };
