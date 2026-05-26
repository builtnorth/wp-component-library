/**
 * WordPress dependencies
 */
import {
    SelectControl,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const StyleControl = ({
    imageStyle = "none",
    onChange,
    isShownByDefault = false,
}) => {
    const defaultImageStyle = "none";

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
                value={imageStyle || "none"}
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
