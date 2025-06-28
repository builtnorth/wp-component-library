/**
 * WordPress dependencies
 */
import {
    RangeControl,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const OpacityControl = ({
    opacity = 15,
    onChange,
    isShownByDefault = false,
}) => {
    const defaultOpacity = 15;

    return (
        <ToolsPanelItem
            hasValue={() => opacity !== defaultOpacity}
            label={__("Media Opacity", "polaris-blocks")}
            onDeselect={() => onChange(defaultOpacity)}
            isShownByDefault={isShownByDefault}
        >
            <RangeControl
                __nextHasNoMarginBottom
                label={__("Media Opacity", "polaris-blocks")}
                value={opacity || 15}
                onChange={onChange}
                min={0}
                max={100}
                initialPosition={15}
            />
        </ToolsPanelItem>
    );
};

export { OpacityControl };
