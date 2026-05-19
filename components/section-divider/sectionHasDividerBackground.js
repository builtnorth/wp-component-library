/**
 * Non-empty string (not just a present key).
 *
 * @param {unknown} value
 * @return {boolean}
 */
function isNonEmptyString(value) {
	return typeof value === "string" && value.trim() !== "";
}

/**
 * Polaris section background only — image or pattern (matches Section Background / Pattern panels).
 * Use this to show/hide divider controls in the editor.
 *
 * @param {Object} attributes Block attributes.
 * @return {boolean}
 */
export function sectionHasPolarisSectionBackground(attributes = {}) {
	if (!attributes || typeof attributes !== "object") {
		return false;
	}

	if (Number(attributes.backgroundImage) > 0) {
		return true;
	}

	if (attributes.useFeaturedImage === true) {
		return true;
	}

	const pattern = attributes.pattern;
	if (isNonEmptyString(pattern) && pattern !== "none") {
		return true;
	}

	return false;
}

/**
 * Any clip surface: Polaris media/pattern or block editor background color/gradient.
 * Use on the frontend (render.php).
 *
 * @param {Object} attributes Block attributes.
 * @return {boolean}
 */
export function sectionHasDividerBackground(attributes = {}) {
	if (sectionHasPolarisSectionBackground(attributes)) {
		return true;
	}

	if (isNonEmptyString(attributes.backgroundColor)) {
		return true;
	}

	const color = attributes.style?.color;

	if (isNonEmptyString(color?.background) && color.background !== "transparent") {
		return true;
	}

	if (isNonEmptyString(color?.gradient)) {
		return true;
	}

	return false;
}
