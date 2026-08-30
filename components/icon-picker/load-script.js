/**
 * Load a classic script URL (wp-scripts IIFE bundles) once.
 *
 * @param {string} url
 * @returns {Promise<void>}
 */
const scriptPromises = new Map();

export function loadScript(url) {
	if (!url) {
		return Promise.reject(new Error("Icon library URL is missing."));
	}

	const existing = scriptPromises.get(url);
	if (existing) {
		return existing;
	}

	const promise = new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = url;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => {
			scriptPromises.delete(url);
			reject(new Error(`Failed to load icon library: ${url}`));
		};
		document.head.appendChild(script);
	});

	scriptPromises.set(url, promise);
	return promise;
}
