/**
 * Icon Registry API
 *
 * Public functions for registering and removing icon sets.
 * These are the functions blocks/themes call to populate the picker.
 */

import { dispatch } from "@wordpress/data";
import { STORE_NAME } from "./store";

/**
 * Register an icon set with the picker.
 *
 * @param {Object} iconSet
 * @param {string} iconSet.name    Unique identifier for this set (e.g. 'phosphor-icons').
 * @param {string} iconSet.label   Human-readable label shown as group heading.
 * @param {Array}  iconSet.icons   Array of icon objects: { name, label, source }.
 * @param {number} [iconSet.priority=0]  Higher priority sets appear first. Use >= 100 for custom/theme sets.
 */
export function registerIconSet(iconSet) {
	dispatch(STORE_NAME).registerIconSet({
		priority: 0,
		...iconSet,
	});
}

/**
 * Alias matching the 10up @10up/block-components registerIcons signature.
 * Keeps backward compat for theme register-icons.js bundles.
 */
export const registerIcons = registerIconSet;

/**
 * Remove a previously registered icon set by name.
 *
 * @param {string} name The set name to remove.
 */
export function removeIconSet(name) {
	dispatch(STORE_NAME).removeIconSet(name);
}
