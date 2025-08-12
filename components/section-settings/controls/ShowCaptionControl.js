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
            label={__("Show Caption", "polaris-blocks")}
            onDeselect={() => onChange(false)}
            isShownByDefault={isShownByDefault}
        >
            <ToggleControl
                label={__("Show Image Caption", "polaris-blocks")}
                checked={showCaption}
                onChange={onChange}
                help={__(
                    "Display the image caption below the image.",
                    "polaris-blocks",
                )}
            />
        </ToolsPanelItem>
    );
};

export { ShowCaptionControl };
