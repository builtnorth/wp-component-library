/**
 * WordPress dependencies
 */
import {
    RangeControl,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import {
	SECTION_BACKGROUND_DEFAULT_OPACITY,
} from "../constants";

const OpacityControl = ({
    opacity = SECTION_BACKGROUND_DEFAULT_OPACITY,
    onChange,
    isShownByDefault = false,
}) => {
    const defaultOpacity = SECTION_BACKGROUND_DEFAULT_OPACITY;

    return (
        <ToolsPanelItem
            hasValue={() => opacity !== defaultOpacity}
            label={__("Media Opacity", "wp-component-library")}
            onDeselect={() => onChange(defaultOpacity)}
            isShownByDefault={isShownByDefault}
        >
            <RangeControl
                __nextHasNoMarginBottom={true}
                __next40pxDefaultSize
                label={__("Media Opacity", "wp-component-library")}
                value={opacity ?? SECTION_BACKGROUND_DEFAULT_OPACITY}
                onChange={onChange}
                min={0}
                max={100}
                initialPosition={SECTION_BACKGROUND_DEFAULT_OPACITY}
            />
        </ToolsPanelItem>
    );
};

export { OpacityControl };
