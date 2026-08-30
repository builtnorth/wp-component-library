import DOMPurify from "dompurify";

/**
 * Normalize and sanitize an SVG source string for safe innerHTML rendering.
 *
 * Strips leading HTML comments (e.g. Lucide license headers), extracts
 * the root <svg> element, then sanitizes with DOMPurify to remove event
 * handlers (onload, onerror, etc.), <script> tags, and javascript: hrefs.
 *
 * @param {string} source
 * @returns {string}
 */
export function safeSvgSource(source) {
	if (typeof source !== "string") {
		return "";
	}

	let trimmed = source.trim().replace(/^(\s*<!--[\s\S]*?-->\s*)+/, "").trim();

	if (!trimmed.startsWith("<svg")) {
		const match = trimmed.match(/<svg[\s\S]*<\/svg>/i);
		trimmed = match ? match[0] : "";
	}

	if (!trimmed) {
		return "";
	}

	return DOMPurify.sanitize(trimmed, {
		USE_PROFILES: { svg: true, svgFilters: true },
	});
}
