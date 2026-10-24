import {
	RangeControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Standalone column count control
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @param {string} props.displayAs Current display type to determine label
 * @param {string} props.label Label override (default: from displayAs)
 * @param {number} props.defaultValue The block's default column count (default: 3)
 * @param {number} props.min Minimum value
 * @param {number} props.max Maximum value
 * @param {boolean} props.isShownByDefault Whether to show by default in ToolsPanel (default: false)
 * @returns {WPElement} Element to render
 */
function ColumnCountControl({
	attributes: { columnCount, displayAs },
	setAttributes,
	min = 1,
	max = 6,
	isShownByDefault = false,
	label,
	defaultValue = 3,
}) {
	// Don't render for list or pills display types
	if (displayAs === "list" || displayAs === "pills") {
		return null;
	}

	const itemLabel =
		label ||
		(displayAs === "grid"
			? __("Columns", "wp-component-library")
			: __("Slides to show", "wp-component-library"));

	return (
		<ToolsPanelItem
			hasValue={() => columnCount !== defaultValue}
			label={itemLabel}
			onDeselect={() => setAttributes({ columnCount: defaultValue })}
			isShownByDefault={isShownByDefault}
		>
			<RangeControl
				__nextHasNoMarginBottom={true}
				__next40pxDefaultSize
				label={itemLabel}
				value={columnCount}
				onChange={(columnCountNew) =>
					setAttributes({ columnCount: columnCountNew })
				}
				min={min}
				max={max}
			/>
		</ToolsPanelItem>
	);
}

export { ColumnCountControl };
