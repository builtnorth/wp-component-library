import {
    Flex,
    PanelBody,
    SelectControl,
    __experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const aspectRatioOptions = [
    { label: __("Original", "polaris-blocks"), value: "original" },
    { label: "16:9 (Extra Wide)", value: "16/9" },
    { label: "4:3 (Wide)", value: "4/3" },
    { label: "1:1 (Square)", value: "1/1" },
    { label: "3:4 (Tall)", value: "3/4" },
    { label: "9:16 (Extra Tall)", value: "9/16" },
];

/**
 * Reusable image controls for aspect ratio, width, and height.
 * @param {object} props
 * @param {string} props.aspectRatio
 * @param {string} props.width
 * @param {string} props.height
 * @param {function} props.setAttributes
 */
const ImageControls = ({
    aspectRatio = "original",
    width = "auto",
    height = "auto",
    setAttributes,
}) => (
    <PanelBody title={__("Image Settings", "polaris-blocks")}>
        <SelectControl
            __nextHasNoMarginBottom={true}
            __next40pxDefaultSize
            label={__("Aspect Ratio", "polaris-blocks")}
            value={aspectRatio}
            onChange={(value) => setAttributes({ aspectRatio: value })}
            options={aspectRatioOptions}
        />
        <Flex align="flex-start" gap={2}>
            <UnitControl
                __next40pxDefaultSize
                label={__("Width", "polaris-blocks")}
                onChange={(value) => setAttributes({ width: value })}
                value={width}
                placeholder={__("Auto", "polaris-blocks")}
            />
            <UnitControl
                __next40pxDefaultSize
                label={__("Height", "polaris-blocks")}
                onChange={(value) => setAttributes({ height: value })}
                value={height}
                placeholder={__("Auto", "polaris-blocks")}
            />
        </Flex>
    </PanelBody>
);

export { ImageControls };
