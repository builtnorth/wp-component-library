/**
 * Register icon sets declared in editor_experience.icons (Polaris localize).
 *
 * @module icon-picker/config-bootstrap
 */

import { select } from "@wordpress/data";

import { registerIconSet } from "./api";
import { loadScript } from "./load-script";
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
 * Load icons from a theme-built library URL (IIFE bundle).
 *
 * @param {string} url
 * @param {string} setName
 * @returns {Promise<Array>}
 */
async function loadIconsFromLibraryUrl(url, setName) {
	if (typeof window !== "undefined" && window.wpcl?.iconSetExports?.[setName]) {
		return window.wpcl.iconSetExports[setName];
	}

	await loadScript(url);

	if (typeof window !== "undefined" && window.wpcl?.iconSetExports?.[setName]) {
		return window.wpcl.iconSetExports[setName];
	}

	const store = select(STORE_NAME);
	const set = store?.getIconSet?.(setName);

	if (set?.icons?.length) {
		return set.icons;
	}

	return [];
}

/**
 * Register lazy icon sets from polaris_localize editor_experience.icons config.
 *
 * Supports:
 *   - `sets[]` with `library_url` (resolved in PHP from directory + file)
 *   - Legacy top-level `library_url` (single register-icons.js bundle)
 *
 * @param {Object} [iconConfig]
 */
export function registerConfigIconSets(iconConfig) {
	if (!iconConfig || typeof iconConfig !== "object") {
		return;
	}

	const sets = [];

	if (Array.isArray(iconConfig.sets) && iconConfig.sets.length) {
		sets.push(...iconConfig.sets);
	} else if (iconConfig.library_url) {
		sets.push({
			name: iconConfig.set_name ?? "theme-icons",
			label: iconConfig.set_label ?? "Theme Icons",
			priority: iconConfig.priority ?? 100,
			library_url: iconConfig.library_url,
		});
	}

	sets.forEach((set) => {
		if (!set?.name || !set.library_url) {
			return;
		}

		registerIconSet({
			name: set.name,
			label: set.label ?? set.name,
			priority: set.priority ?? 0,
			load: () =>
				loadIconsFromLibraryUrl(set.library_url, set.name).then(
					(icons) => normalizeLoaderResult(icons),
				),
		});
	});
}
