import { useSettings } from "@wordpress/block-editor";
import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Hook to get aspect ratio options from theme.json
 * Returns whatever aspect ratios are defined (default or custom)
 * Includes "Original" option like core/image block
 */
export function useAspectRatioOptions() {
	const [aspectRatios] = useSettings(["dimensions.aspectRatios"]);

	return useMemo(() => {
		// Always include "Original" as the first option
		// This matches WordPress core's Image block behavior
		const originalOption = {
			label: __("Original", "polaris-blocks"),
			value: "original",
		};

		// Handle case where aspectRatios might be undefined, null, or not an array
		if (
			!aspectRatios ||
			!Array.isArray(aspectRatios) ||
			aspectRatios.length === 0
		) {
			return [originalOption];
		}

		// Map theme.json aspect ratios to options format
		// Filter out any existing "original" or "auto" values to avoid duplicates
		const themeRatios = aspectRatios
			.filter(
				(ratio) =>
					ratio &&
					typeof ratio === "object" &&
					ratio.name &&
					ratio.ratio &&
					ratio.ratio !== "original" &&
					ratio.ratio !== "auto",
			)
			.map((ratio) => ({
				label: ratio.name,
				value: ratio.ratio,
			}));

		// Always put Original first, then theme ratios
		// This ensures "Original" is always available regardless of theme.json settings
		return [originalOption, ...themeRatios];
	}, [aspectRatios]);
}
