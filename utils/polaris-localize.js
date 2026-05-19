/**
 * Resolve polaris_localize across nested editor iframes (canvas vs shell).
 */
export const SKIN_CHANGED_EVENT = "themeSkinSwitcherChanged";

/**
 * @return {Window[]}
 */
function getEditorWindowChain() {
	const chain = [];

	try {
		let win = window;

		while (win) {
			chain.push(win);

			if (win.parent === win) {
				break;
			}

			win = win.parent;
		}
	} catch {
		// Cross-origin frame — use the current window only.
		chain.push(window);
	}

	return chain;
}

/**
 * @param {string} patternSlug Optional active pattern slug for best-match lookup.
 * @return {Window}
 */
export function getPolarisLocalizeWindow(patternSlug = "") {
	const chain = getEditorWindowChain();

	if (patternSlug) {
		for (let i = chain.length - 1; i >= 0; i--) {
			const url =
				chain[i].polaris_localize?.blocks?.editor_experience?.patterns
					?.pattern_urls?.[patternSlug];

			if (url) {
				return chain[i];
			}
		}

		for (let i = chain.length - 1; i >= 0; i--) {
			const patterns =
				chain[i].polaris_localize?.blocks?.editor_experience?.patterns;

			if (patterns?.available_patterns?.[patternSlug]) {
				return chain[i];
			}
		}
	}

	for (let i = chain.length - 1; i >= 0; i--) {
		if (chain[i].polaris_localize?.blocks?.editor_experience?.patterns) {
			return chain[i];
		}
	}

	return window;
}

/**
 * @param {string} patternSlug
 * @return {object|undefined}
 */
export function getPolarisLocalize(patternSlug = "") {
	return getPolarisLocalizeWindow(patternSlug).polaris_localize;
}

/**
 * @param {string} patternSlug
 * @return {object|undefined}
 */
export function getEditorExperiencePatterns(patternSlug = "") {
	return getPolarisLocalize(patternSlug)?.blocks?.editor_experience?.patterns;
}

/**
 * @return {object|undefined}
 */
export function getEditorExperienceSectionDivider() {
	const chain = getEditorWindowChain();

	for (let i = chain.length - 1; i >= 0; i--) {
		const sectionDivider =
			chain[i].polaris_localize?.blocks?.editor_experience?.section_divider;

		if (sectionDivider) {
			return sectionDivider;
		}
	}

	return undefined;
}
