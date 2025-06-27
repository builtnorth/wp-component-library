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
 * @param {number} props.min Minimum value
 * @param {number} props.max Maximum value
 * @param {boolean} props.isShownByDefault Whether to show by default in ToolsPanel (default: false)
 * @returns {WPElement} Element to render
 */
function ColumnCountControl({
    attributes: { columnCount, displayAs },
    setAttributes,
    min = 1,
    max = 4,
    isShownByDefault = false,
}) {
    const defaultColumnCount = 3;

    // Don't render for list or pills display types
    if (displayAs === "list" || displayAs === "pills") {
        return null;
    }

    const label = displayAs === "grid" ? __("Columns") : __("Slides to Show");

    return (
        <ToolsPanelItem
            hasValue={() => columnCount !== defaultColumnCount}
            label={__("Columns/Slides", "built_starter")}
            onDeselect={() =>
                setAttributes({ columnCount: defaultColumnCount })
            }
            isShownByDefault={isShownByDefault}
        >
            <RangeControl
                label={label}
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
