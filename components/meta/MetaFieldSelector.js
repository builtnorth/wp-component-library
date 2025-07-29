import { ComboboxControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useMetaFields } from "./useMetaFields";

/**
 * MetaFieldSelector Component
 *
 * A combobox selector for choosing meta fields
 * Automatically filters out protected fields and formats labels
 * Allows searching/filtering through available fields
 */
export const MetaFieldSelector = ({ value, onChange, help, label }) => {
	const metaFieldOptions = useMetaFields();

	return (
		<ComboboxControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={label || __("Meta Field", "wp-component-library")}
			value={value || ""}
			options={metaFieldOptions}
			onChange={onChange}
			help={
				help ||
				__(
					"Select or search for a meta field to bind this block to.",
					"wp-component-library",
				)
			}
			placeholder={__("Search meta fields...", "wp-component-library")}
			allowReset={true}
		/>
	);
};
