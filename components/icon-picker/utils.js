import DOMPurify from "dompurify";

/**
 * Shown when no icon is set: the polaris-essential "star" icon
 * (copied from wp-blocks src/util/essential-icons.js).
 */
export const PLACEHOLDER_SVG =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"/></svg>';

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
