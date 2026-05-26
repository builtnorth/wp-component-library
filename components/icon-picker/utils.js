/**
 * Normalize an SVG source string for safe innerHTML rendering.
 *
 * Strips leading HTML comments (e.g. Lucide license headers) and extracts
 * the root <svg> element when extra markup is present.
 *
 * @param {string} source
 * @returns {string}
 */
export function safeSvgSource(source) {
	if (typeof source !== "string") {
		return "";
	}

	let trimmed = source.trim().replace(/^(\s*<!--[\s\S]*?-->\s*)+/, "").trim();

	if (trimmed.startsWith("<svg")) {
		return trimmed;
	}

	const match = trimmed.match(/<svg[\s\S]*<\/svg>/i);

	return match ? match[0] : "";
}
