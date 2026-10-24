import {
    RangeControl,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Standalone posts per page control
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @param {string} props.label Label for the control
 * @param {number} props.min Minimum value
 * @param {number} props.max Maximum value
 * @param {boolean} props.isShownByDefault Whether to show by default in ToolsPanel (default: false)
 * @param {number} props.defaultValue The block's default count (default: 6)
 * @returns {WPElement} Element to render
 */
function PostsPerPageControl({
    attributes: { postsPerPage },
    setAttributes,
    label = __("Amount to display", "wp-component-library"),
    min = 1,
    max = 50,
    isShownByDefault = false,
    defaultValue = 6,
}) {
    return (
        <ToolsPanelItem
            hasValue={() => postsPerPage !== defaultValue}
            label={label}
            onDeselect={() => setAttributes({ postsPerPage: defaultValue })}
            isShownByDefault={isShownByDefault}
        >
            <RangeControl
                __nextHasNoMarginBottom={true}
                __next40pxDefaultSize
                label={label}
                value={postsPerPage}
                onChange={(postsPerPageNew) =>
                    setAttributes({ postsPerPage: postsPerPageNew })
                }
                min={min}
                max={max}
            />
        </ToolsPanelItem>
    );
}

export { PostsPerPageControl };
