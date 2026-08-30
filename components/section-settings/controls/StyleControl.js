/**
 * WordPress dependencies
 */
import {
    SelectControl,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import {
	SECTION_BACKGROUND_DEFAULT_IMAGE_STYLE,
} from "../constants";

const StyleControl = ({
    imageStyle = SECTION_BACKGROUND_DEFAULT_IMAGE_STYLE,
    onChange,
    isShownByDefault = false,
}) => {
    const defaultImageStyle = SECTION_BACKGROUND_DEFAULT_IMAGE_STYLE;

    return (
        <ToolsPanelItem
            hasValue={() => imageStyle !== defaultImageStyle}
            label={__("Media Style", "wp-component-library")}
            onDeselect={() => onChange(defaultImageStyle)}
            isShownByDefault={isShownByDefault}
        >
            <SelectControl
                __nextHasNoMarginBottom={true}
                __next40pxDefaultSize
                label={__("Media Style", "wp-component-library")}
                value={imageStyle || SECTION_BACKGROUND_DEFAULT_IMAGE_STYLE}
                options={[
                    {
                        label: __("None", "wp-component-library"),
                        value: "none",
                    },
                    {
                        label: __("Blur", "wp-component-library"),
                        value: "blur",
                    },
                    {
                        label: __("Grayscale", "wp-component-library"),
                        value: "grayscale",
                    },
                    {
                        label: __("Blur + Grayscale", "wp-component-library"),
                        value: "blur-grayscale",
                    },
                ]}
                onChange={onChange}
            />
        </ToolsPanelItem>
    );
};

export { StyleControl };
