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

	// Allow custom values in template context or when no options
	const allowCustom = metaFieldOptions.length === 0 || 
		metaFieldOptions.some(opt => opt.label === "── Common Meta Fields ──");

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
					allowCustom 
						? "Select a common field or type a custom meta field name."
						: "Select or search for a meta field to bind this block to.",
					"wp-component-library",
				)
			}
			placeholder={__("Search or type meta field...", "wp-component-library")}
			allowReset={true}
			__experimentalAllowTextInput={allowCustom}
		/>
	);
};
