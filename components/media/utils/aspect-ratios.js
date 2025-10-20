import { useSetting } from "@wordpress/block-editor";

/**
 * Hook to get aspect ratio options from theme.json
 * Returns whatever aspect ratios are defined (default or custom)
 */
export function useAspectRatioOptions() {
	const aspectRatios = useSetting("dimensions.aspectRatios");

	if (!aspectRatios || aspectRatios.length === 0) {
		console.warn("No aspect ratios found from theme.json:", aspectRatios);
		return [];
	}

	return aspectRatios.map((ratio) => ({
		label: ratio.name,
		value: ratio.ratio,
	}));
}
