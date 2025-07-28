/**
 * WordPress dependencies
 */
import {
    ToggleControl,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const ImageCaptionControl = ({
    showCaption = false,
    onChange,
    isShownByDefault = false,
}) => {
    const defaultShowCaption = false;

    return (
        <ToolsPanelItem
            hasValue={() => showCaption !== defaultShowCaption}
            label={__("Show Caption", "polaris-blocks")}
            onDeselect={() => onChange(defaultShowCaption)}
            isShownByDefault={isShownByDefault}
        >
            <ToggleControl
                __nextHasNoMarginBottom
                label={__("Show Caption", "polaris-blocks")}
                checked={showCaption}
                onChange={onChange}
            />
        </ToolsPanelItem>
    );
};

export { ImageCaptionControl };
