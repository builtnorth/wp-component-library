/**
 * WordPress dependencies
 */
import { useEffect, useState } from "@wordpress/element";
import classnames from "classnames";
import DOMPurify from "dompurify";

import {
	getEditorExperiencePatterns,
	getLocalize,
	SKIN_CHANGED_EVENT,
} from "../../utils/polaris-localize";

/**
 * @param {string} pattern
 * @param {object|undefined} patternConfig
 * @param {object|undefined} localizeData
 * @return {string}
 */
function resolvePatternAssetUrl(pattern, patternConfig, localizeData) {
	if (patternConfig?.pattern_urls?.[pattern]) {
		return patternConfig.pattern_urls[pattern];
	}

	const themeUrl =
		localizeData?.theme_url || window.polarisLocalizeShared?.theme_url;

	if (!themeUrl) {
		return "";
	}

	const directories = [
		patternConfig?.pattern_directory,
		"design-skins/_default/section-patterns",
		"build/assets/background-patterns",
	].filter(Boolean);

	return directories.map(
		(dir) => `${themeUrl}/${String(dir).replace(/^\/+|\/+$/g, "")}/${pattern}.svg`,
	);
}

const SectionPattern = ({
	pattern = null,
	patternAlign = "center center",
	className = "",
}) => {
	const [svgContent, setSvgContent] = useState("");
	const [configTick, setConfigTick] = useState(0);

	useEffect(() => {
		const sync = () => setConfigTick((tick) => tick + 1);

		document.addEventListener(SKIN_CHANGED_EVENT, sync);

		return () => {
			document.removeEventListener(SKIN_CHANGED_EVENT, sync);
		};
	}, []);

	useEffect(() => {
		if (!pattern) {
			setSvgContent("");
			return;
		}

		const patternConfig = getEditorExperiencePatterns(pattern);
		const localizeData = getLocalize(pattern);
		const patternUrls = resolvePatternAssetUrl(
			pattern,
			patternConfig,
			localizeData,
		);
		const urlsToTry = Array.isArray(patternUrls)
			? patternUrls
			: patternUrls
				? [patternUrls]
				: [];

		if (urlsToTry.length === 0) {
			const isChildTheme = localizeData?.theme_urls?.is_child_theme;

			if (
				!patternConfig?.enabled ||
				(!patternConfig?.available_patterns?.[pattern] && !isChildTheme)
			) {
				setSvgContent("");
				return;
			}

			console.warn(
				`Section pattern "${pattern}" has no resolvable asset URL in the editor.`,
			);
			setSvgContent("");
			return;
		}

		let cancelled = false;

		const tryFetch = (index) => {
			if (cancelled || index >= urlsToTry.length) {
				if (!cancelled) {
					console.error(
						`Error loading pattern ${pattern}: no URL succeeded (${urlsToTry.join(", ")})`,
					);
					setSvgContent("");
				}
				return;
			}

			const patternUrl = urlsToTry[index];

			fetch(patternUrl)
				.then((response) => {
					if (!response.ok) {
						throw new Error(`Failed to load pattern: ${response.statusText}`);
					}

					return response.text();
				})
				.then((svg) => {
					if (!cancelled) {
						setSvgContent(
							DOMPurify.sanitize(svg, {
								USE_PROFILES: { svg: true, svgFilters: true },
							}),
						);
					}
				})
				.catch(() => {
					tryFetch(index + 1);
				});
		};

		tryFetch(0);

		return () => {
			cancelled = true;
		};
	}, [pattern, configTick]);

	if (!pattern || !svgContent) {
		return null;
	}

	const alignmentToClass = (align) => {
		const alignmentMap = {
			"top left": "top-left",
			"top center": "top-center",
			"top right": "top-right",
			"center left": "center-left",
			"center center": "center-center",
			center: "center-center",
			"center right": "center-right",
			"bottom left": "bottom-left",
			"bottom center": "bottom-center",
			"bottom right": "bottom-right",
		};

		return alignmentMap[align] || "center-center";
	};

	const patternClasses = classnames("section-pattern", className, {
		[`has-pattern-${pattern}`]: pattern,
		[`pattern-align--${alignmentToClass(patternAlign)}`]: patternAlign,
	});

	return (
		<div
			className={patternClasses}
			aria-hidden="true"
			dangerouslySetInnerHTML={{ __html: svgContent }}
		/>
	);
};

export { SectionPattern };
