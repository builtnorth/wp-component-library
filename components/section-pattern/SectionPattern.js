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
 * @param {string} ext
 * @return {boolean}
 */
function isRasterExtension(ext) {
	return Boolean(ext) && ext !== "svg";
}

/**
 * @param {string} url
 * @return {string}
 */
function getExtensionFromUrl(url) {
	const match = String(url).match(/\.([a-z0-9]+)(?:\?|#|$)/i);

	return match ? match[1].toLowerCase() : "";
}

/**
 * @param {string} pattern
 * @param {object|undefined} patternConfig
 * @return {string}
 */
function getConfiguredExtension(pattern, patternConfig) {
	return patternConfig?.pattern_extensions?.[pattern] || "";
}

/**
 * @param {string} pattern
 * @param {object|undefined} patternConfig
 * @param {object|undefined} localizeData
 * @return {{ url: string, ext: string }[]}
 */
function resolvePatternAssetCandidates(pattern, patternConfig, localizeData) {
	const configuredUrl = patternConfig?.pattern_urls?.[pattern];
	const configuredExt =
		getConfiguredExtension(pattern, patternConfig) ||
		(configuredUrl ? getExtensionFromUrl(configuredUrl) : "");

	if (configuredUrl) {
		return [
			{
				url: configuredUrl,
				ext: configuredExt,
			},
		];
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

/**
 * @param {string} url
 * @param {() => void} onLoad
 * @param {() => void} onError
 */
function preloadRasterImage(url, onLoad, onError) {
	const image = new window.Image();
	image.onload = onLoad;
	image.onerror = onError;
	image.src = url;
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

		const applyRaster = (url) => {
			if (cancelled) {
				return;
			}

			setSvgContent("");
			setRasterUrl(url);
		};

		const tryCandidate = (index) => {
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

			if (isRasterExtension(ext)) {
				preloadRasterImage(
					patternUrl,
					() => applyRaster(patternUrl),
					() => tryCandidate(index + 1),
				);
				return;
			}

			fetch(patternUrl)
				.then((response) => {
					if (!response.ok) {
						throw new Error(`Failed to load pattern: ${response.statusText}`);
					}

					const contentType = response.headers.get("content-type") || "";

					if (contentType.includes("image/")) {
						applyRaster(patternUrl);
						return;
					}

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
				})
				.catch(() => {
					tryCandidate(index + 1);
				});
		};

		tryCandidate(0);

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
