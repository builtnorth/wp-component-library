/**
 * Resolve kitaris_localize across nested editor iframes (canvas vs shell).
 *
 * NOTE: window.kitaris_localize, window.kitarisLocalizeAdmin, and
 * window.kitarisLocalizeShared are PHP-injected globals — their names are
 * controlled by the host plugin and cannot be changed here.
 */
export const SKIN_CHANGED_EVENT = "themeSkinSwitcherChanged";

/**
 * Whether a window's globals can be read from here (same origin).
 *
 * @param {Window} win
 * @return {boolean}
 */
function isReadableWindow(win) {
	try {
		// Throws a SecurityError for a cross-origin window.
		return !!win.document;
	} catch {
		return false;
	}
}

/**
 * The current window plus each same-origin ancestor. The walk stops at the
 * first cross-origin parent, so callers can read globals from every entry.
 *
 * @return {Window[]}
 */
function getEditorWindowChain() {
	const chain = [window];

	try {
		let win = window;

		while (win.parent && win.parent !== win) {
			win = win.parent;

			if (!isReadableWindow(win)) {
				break;
			}

			chain.push(win);
		}
	} catch {
		// Keep whatever was collected before the error.
	}

	return chain;
}

/**
 * @param {string} patternSlug Optional active pattern slug for best-match lookup.
 * @return {Window}
 */
export function getLocalizeWindow(patternSlug = "") {
	const chain = getEditorWindowChain();

	if (patternSlug) {
		for (let i = chain.length - 1; i >= 0; i--) {
			const url =
				chain[i].kitaris_localize?.blocks?.editor_experience?.patterns
					?.pattern_urls?.[patternSlug];

			if (url) {
				return chain[i];
			}
		}

		for (let i = chain.length - 1; i >= 0; i--) {
			const patterns =
				chain[i].kitaris_localize?.blocks?.editor_experience?.patterns;

			if (patterns?.available_patterns?.[patternSlug]) {
				return chain[i];
			}
		}
	}

	for (let i = chain.length - 1; i >= 0; i--) {
		if (chain[i].kitaris_localize?.blocks?.editor_experience?.patterns) {
			return chain[i];
		}
	}

	return window;
}

/**
 * @param {string} patternSlug
 * @return {object|undefined}
 */
export function getLocalize(patternSlug = "") {
	return getLocalizeWindow(patternSlug).kitaris_localize;
}

/**
 * @param {string} patternSlug
 * @return {object|undefined}
 */
export function getEditorExperiencePatterns(patternSlug = "") {
	return getLocalize(patternSlug)?.blocks?.editor_experience?.patterns;
}

/**
 * @return {object|undefined}
 */
export function getEditorExperienceSectionDivider() {
	const chain = getEditorWindowChain();

	for (let i = chain.length - 1; i >= 0; i--) {
		const sectionDivider =
			chain[i].kitaris_localize?.blocks?.editor_experience?.section_divider;

		if (sectionDivider) {
			return sectionDivider;
		}
	}

	return undefined;
}

// Backwards-compat aliases for the renamed functions.
/** @deprecated Use getLocalizeWindow instead. */
export const getKitarisLocalizeWindow = getLocalizeWindow;
/** @deprecated Use getLocalize instead. */
export const getKitarisLocalize = getLocalize;
