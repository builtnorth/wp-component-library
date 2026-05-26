import { useSettings } from "@wordpress/block-editor";
import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * WordPress core aspect ratio presets (when theme enables defaultAspectRatios).
 * @see https://developer.wordpress.org/news/2024/08/registering-custom-aspect-ratios-in-wordpress-6-6/
 */
const DEFAULT_CORE_ASPECT_RATIOS = [
	{ name: "Square", ratio: "1" },
	{ name: "Standard", ratio: "4/3" },
	{ name: "Portrait", ratio: "3/4" },
	{ name: "Classic", ratio: "3/2" },
	{ name: "Classic Portrait", ratio: "2/3" },
	{ name: "Wide", ratio: "16/9" },
	{ name: "Extra Wide", ratio: "21/9" },
	{ name: "Tall", ratio: "9/16" },
];

/**
 * Flatten aspect ratio presets from useSettings (array or { default, theme } object).
 *
 * @param {unknown} setting
 * @return {Array<{ name: string, ratio: string }>}
 */
function collectAspectRatioPresets(setting) {
	if (!setting) {
		return [];
	}

	if (Array.isArray(setting)) {
		return setting;
	}

	if (typeof setting !== "object") {
		return [];
	}

	const merged = [];

	for (const key of ["default", "theme", "custom"]) {
		if (Array.isArray(setting[key])) {
			merged.push(...setting[key]);
		}
	}

	return merged;
}

/**
 * Hook to get aspect ratio options from theme.json
 * Returns whatever aspect ratios are defined (default or custom)
 * Includes "Original" option like core/image block
 */
export function useAspectRatioOptions() {
	const [
		aspectRatiosSetting,
		defaultPresets,
		themePresets,
		defaultAspectRatiosEnabled,
	] = useSettings([
		"dimensions.aspectRatios",
		"dimensions.aspectRatios.default",
		"dimensions.aspectRatios.theme",
		"dimensions.defaultAspectRatios",
	]);

	return useMemo(() => {
		const originalOption = {
			label: __("Original", "wp-component-library"),
			value: "original",
		};

		let presets = [
			...collectAspectRatioPresets(aspectRatiosSetting),
			...collectAspectRatioPresets(defaultPresets),
			...collectAspectRatioPresets(themePresets),
		];

		// Deduplicate by ratio value.
		const seen = new Set();
		presets = presets.filter((ratio) => {
			if (
				!ratio ||
				typeof ratio !== "object" ||
				!ratio.name ||
				!ratio.ratio
			) {
				return false;
			}
			if (seen.has(ratio.ratio)) {
				return false;
			}
			seen.add(ratio.ratio);
			return true;
		});

		if (presets.length === 0 && defaultAspectRatiosEnabled !== false) {
			presets = DEFAULT_CORE_ASPECT_RATIOS.map((ratio) => ({
				name: __(ratio.name, "wp-component-library"),
				ratio: ratio.ratio,
			}));
		}

		const ratioOptions = presets
			.filter(
				(ratio) => ratio.ratio !== "original" && ratio.ratio !== "auto",
			)
			.map((ratio) => ({
				label: ratio.name,
				value: ratio.ratio,
			}));

		return [originalOption, ...ratioOptions];
	}, [
		aspectRatiosSetting,
		defaultPresets,
		themePresets,
		defaultAspectRatiosEnabled,
	]);
}
