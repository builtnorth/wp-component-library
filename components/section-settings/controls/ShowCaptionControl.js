/**
 * WordPress dependencies
 */
import {
    ToggleControl,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const ShowCaptionControl = ({
    showCaption = false,
    onChange,
    isShownByDefault = false,
}) => {
    return (
        <ToolsPanelItem
            hasValue={() => showCaption}
            label={__("Show Caption", "wp-component-library")}
            onDeselect={() => onChange(false)}
            isShownByDefault={isShownByDefault}
        >
            <ToggleControl
                label={__("Show Image Caption", "wp-component-library")}
                checked={showCaption}
                onChange={onChange}
                help={__(
                    "Display the image caption below the image.",
                    "wp-component-library",
                )}
            />
        </ToolsPanelItem>
    );
};

export { ShowCaptionControl };
