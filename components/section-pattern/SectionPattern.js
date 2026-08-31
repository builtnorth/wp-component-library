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

const PATTERN_EXTENSIONS = ["svg", "png", "jpg", "jpeg", "webp"];

/**
 * @param {string} url
 * @return {string}
 */
function getExtensionFromUrl(url) {
	const match = String(url).match(/\.([a-z0-9]+)(?:\?|#|$)/i);

	return match ? match[1].toLowerCase() : "svg";
}

/**
 * @param {string} pattern
 * @param {object|undefined} patternConfig
 * @param {object|undefined} localizeData
 * @return {{ url: string, ext: string }[]}
 */
function resolvePatternAssetCandidates(pattern, patternConfig, localizeData) {
	if (patternConfig?.pattern_urls?.[pattern]) {
		const url = patternConfig.pattern_urls[pattern];

		return [{ url, ext: getExtensionFromUrl(url) }];
	}

	const themeUrl =
		localizeData?.theme_url || window.polarisLocalizeShared?.theme_url;

	if (!themeUrl) {
		return [];
	}

	const directories = [
		patternConfig?.pattern_directory,
		"design-skins/_default/section-patterns",
		"build/assets/background-patterns",
	].filter(Boolean);

	const candidates = [];

	directories.forEach((dir) => {
		const normalizedDir = String(dir).replace(/^\/+|\/+$/g, "");

		PATTERN_EXTENSIONS.forEach((ext) => {
			candidates.push({
				url: `${themeUrl}/${normalizedDir}/${pattern}.${ext}`,
				ext,
			});
		});
	});

	return candidates;
}

const SectionPattern = ({
	pattern = null,
	patternAlign = "center center",
	className = "",
}) => {
	const [svgContent, setSvgContent] = useState("");
	const [rasterUrl, setRasterUrl] = useState("");
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
			setRasterUrl("");
			return;
		}

		const patternConfig = getEditorExperiencePatterns(pattern);
		const localizeData = getLocalize(pattern);
		const candidates = resolvePatternAssetCandidates(
			pattern,
			patternConfig,
			localizeData,
		);

		if (candidates.length === 0) {
			const isChildTheme = localizeData?.theme_urls?.is_child_theme;

			if (
				!patternConfig?.enabled ||
				(!patternConfig?.available_patterns?.[pattern] && !isChildTheme)
			) {
				setSvgContent("");
				setRasterUrl("");
				return;
			}

			console.warn(
				`Section pattern "${pattern}" has no resolvable asset URL in the editor.`,
			);
			setSvgContent("");
			setRasterUrl("");
			return;
		}

		let cancelled = false;

		const resetPatternContent = () => {
			setSvgContent("");
			setRasterUrl("");
		};

		const tryFetch = (index) => {
			if (cancelled || index >= candidates.length) {
				if (!cancelled) {
					console.error(
						`Error loading pattern ${pattern}: no URL succeeded (${candidates.map((candidate) => candidate.url).join(", ")})`,
					);
					resetPatternContent();
				}
				return;
			}

			const { url: patternUrl, ext } = candidates[index];

			fetch(patternUrl)
				.then((response) => {
					if (!response.ok) {
						throw new Error(`Failed to load pattern: ${response.statusText}`);
					}

					if (ext === "svg") {
						return response.text().then((svg) => {
							if (cancelled) {
								return;
							}

							setRasterUrl("");
							setSvgContent(
								DOMPurify.sanitize(svg, {
									USE_PROFILES: { svg: true, svgFilters: true },
								}),
							);
						});
					}

					if (cancelled) {
						return;
					}

					setSvgContent("");
					setRasterUrl(patternUrl);
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

	if (!pattern || (!svgContent && !rasterUrl)) {
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

	if (rasterUrl) {
		return (
			<div className={patternClasses} aria-hidden="true">
				<img src={rasterUrl} alt="" loading="lazy" />
			</div>
		);
	}

	return (
		<div
			className={patternClasses}
			aria-hidden="true"
			dangerouslySetInnerHTML={{ __html: svgContent }}
		/>
	);
};

export { SectionPattern };
