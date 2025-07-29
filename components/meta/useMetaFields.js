import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";

/**
 * useMetaFields Hook
 *
 * Fetches available meta fields from the current post
 * Filters out protected fields and formats for display
 */
export const useMetaFields = () => {
	const metaKeys = useSelect((select) => {
		const { getEditedPostAttribute } = select("core/editor");
		const meta = getEditedPostAttribute("meta") || {};
		// Return just the keys to avoid reference changes
		return Object.keys(meta);
	}, []);

	const metaFieldOptions = useMemo(() => {
		return metaKeys
			.filter((field) => {
				// Exclude WordPress protected fields (start with _)
				if (field.startsWith("_")) {
					return false;
				}
				// Exclude some other internal fields
				if (field.startsWith("wp_") || field.startsWith("footnotes")) {
					return false;
				}
				// Exclude companion URL and alt fields (these are auto-managed)
				if (
					field.endsWith("_image_url") ||
					field.endsWith("_image_alt")
				) {
					return false;
				}
				return true;
			})
			.map((field) => ({
				label: field
					.replace(/_/g, " ")
					.replace(/\b\w/g, (l) => l.toUpperCase()),
				value: field,
			}))
			.sort((a, b) => a.label.localeCompare(b.label));
	}, [metaKeys]);

	return metaFieldOptions;
};
