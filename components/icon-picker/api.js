/**
 * Icon Registry API
 *
 * Public functions for registering and removing icon sets.
 * These are the functions blocks/themes call to populate the picker.
 */

import { dispatch, select } from "@wordpress/data";

import {
	clearIconSetLoader,
	clearInFlightLoad,
	getIconSetLoader,
	getInFlightLoad,
	setIconSetLoader,
	setInFlightLoad,
} from "./loaders";
import { STORE_NAME } from "./store";

/**
 * Normalize lazy loader return value to an icon array.
 *
 * @param {Array|{ icons: Array }|*} result
 * @returns {Array}
 */
function normalizeLoaderResult(result) {
	if (Array.isArray(result)) {
		return result;
	}

	if (result?.icons && Array.isArray(result.icons)) {
		return result.icons;
	}

	if (result?.default && Array.isArray(result.default)) {
		return result.default;
	}

	return [];
}

/**
 * Register an icon set with the picker.
 *
 * Pass `icons` for eager sets, or `load` for lazy sets loaded when the picker opens:
 *
 * @example
 * registerIconSet({
 *   name: 'home-services',
 *   label: 'Home Services',
 *   priority: 120,
 *   load: () => import('./home-services.js').then((m) => m.homeServicesIcons),
 * });
 *
 * @param {Object} iconSet
 * @param {string} iconSet.name    Unique identifier for this set (e.g. 'phosphor-icons').
 * @param {string} iconSet.label   Human-readable label shown as group heading.
 * @param {Array}  [iconSet.icons] Array of icon objects: { name, label, source }.
 * @param {Function} [iconSet.load] Lazy loader returning icons (or a module with `.icons`).
 * @param {number} [iconSet.priority=0]  Higher priority sets appear first.
 */
export function registerIconSet(iconSet) {
	const { load, icons, ...rest } = iconSet;

	if (typeof load === "function") {
		setIconSetLoader(rest.name, load);

		const previous = select(STORE_NAME)?.getIconSet?.(rest.name);

		dispatch(STORE_NAME).registerIconSet({
			...rest,
			priority: rest.priority ?? 0,
			icons: icons ?? previous?.icons ?? [],
			loadStatus: "idle",
		});
		return;
	}

	clearIconSetLoader(rest.name);

	dispatch(STORE_NAME).registerIconSet({
		...rest,
		priority: rest.priority ?? 0,
		icons: icons ?? [],
		loadStatus: "loaded",
	});
}

/**
 * Alias matching the 10up @10up/block-components registerIcons signature.
 *
 * @deprecated Prefer registerIconSet(). Kept for legacy theme bundles.
 */
export const registerIcons = registerIconSet;

/**
 * Load a single lazy icon set by name.
 *
 * @param {string} name
 * @returns {Promise<void>}
 */
export async function loadIconSet(name) {
	const store = select(STORE_NAME);
	const set = store.getIconSet(name);

	if (!set || set.loadStatus === "loaded") {
		return;
	}

	const inFlight = getInFlightLoad(name);
	if (inFlight) {
		return inFlight;
	}

	const loader = getIconSetLoader(name);
	if (!loader) {
		dispatch(STORE_NAME).setIconSetError(
			name,
			"Icon set loader is not registered.",
		);
		return;
	}

	const loadPromise = (async () => {
		dispatch(STORE_NAME).setIconSetLoading(name);

		try {
			const result = await loader();
			const icons = normalizeLoaderResult(result);

			dispatch(STORE_NAME).setIconSetIcons(name, icons);
			clearIconSetLoader(name);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : String(error);
			dispatch(STORE_NAME).setIconSetError(name, message);
			throw error;
		} finally {
			clearInFlightLoad(name);
		}
	})();

	setInFlightLoad(name, loadPromise);
	return loadPromise;
}

/**
 * Load every registered set that has not finished loading.
 *
 * @returns {Promise<void>}
 */
export async function loadAllIconSets() {
	const store = select(STORE_NAME);
	const pending = store
		.getIconSets()
		.filter(
			(set) => set.loadStatus === "idle" || set.loadStatus === "error",
		)
		.map((set) => set.name);

	await Promise.all(pending.map((name) => loadIconSet(name)));
}

/**
 * Remove a previously registered icon set by name.
 *
 * @param {string} name The set name to remove.
 */
export function removeIconSet(name) {
	clearIconSetLoader(name);
	dispatch(STORE_NAME).removeIconSet(name);
}
