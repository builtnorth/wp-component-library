/**
 * Lazy icon-set loaders live outside Redux state (functions are not serializable).
 * Stored on window.wpcl so theme editor bundles and the picker share one registry.
 *
 * @module icon-picker/loaders
 */

function getLoaderMap() {
	if (typeof window !== "undefined") {
		window.wpcl = window.wpcl || {};
		if (!window.wpcl._iconSetLoaders) {
			window.wpcl._iconSetLoaders = new Map();
		}
		return window.wpcl._iconSetLoaders;
	}

	return getLoaderMap.fallbackMap || (getLoaderMap.fallbackMap = new Map());
}

function getInFlightMap() {
	if (typeof window !== "undefined") {
		window.wpcl = window.wpcl || {};
		if (!window.wpcl._iconSetLoadsInFlight) {
			window.wpcl._iconSetLoadsInFlight = new Map();
		}
		return window.wpcl._iconSetLoadsInFlight;
	}

	return (
		getInFlightMap.fallbackMap || (getInFlightMap.fallbackMap = new Map())
	);
}

/**
 * @param {string} name
 * @param {() => Promise<Array>|Array} loader
 */
export function setIconSetLoader(name, loader) {
	getLoaderMap().set(name, loader);
}

/**
 * @param {string} name
 * @returns {(() => Promise<Array>|Array)|undefined}
 */
export function getIconSetLoader(name) {
	return getLoaderMap().get(name);
}

/**
 * @param {string} name
 */
export function clearIconSetLoader(name) {
	getLoaderMap().delete(name);
	getInFlightMap().delete(name);
}

/**
 * @param {string} name
 * @param {Promise<void>} promise
 */
export function setInFlightLoad(name, promise) {
	getInFlightMap().set(name, promise);
}

/**
 * @param {string} name
 * @returns {Promise<void>|undefined}
 */
export function getInFlightLoad(name) {
	return getInFlightMap().get(name);
}

/**
 * @param {string} name
 */
export function clearInFlightLoad(name) {
	getInFlightMap().delete(name);
}
