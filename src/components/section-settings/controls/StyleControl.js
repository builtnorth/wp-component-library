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
            label={__("Media Style", "polaris-blocks")}
            onDeselect={() => onChange(defaultImageStyle)}
            isShownByDefault={isShownByDefault}
        >
            <SelectControl
                label={__("Media Style", "polaris-blocks")}
                value={imageStyle || "none"}
                options={[
                    {
                        label: __("None", "polaris-blocks"),
                        value: "none",
                    },
                    {
                        label: __("Blur", "polaris-blocks"),
                        value: "blur",
                    },
                    {
                        label: __("Grayscale", "polaris-blocks"),
                        value: "grayscale",
                    },
                    {
                        label: __("Blur + Grayscale", "polaris-blocks"),
                        value: "blur-grayscale",
                    },
                ]}
                onChange={onChange}
            />
        </ToolsPanelItem>
    );
};

export { StyleControl };
