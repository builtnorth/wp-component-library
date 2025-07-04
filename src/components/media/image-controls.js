import {
    Flex,
    FlexBlock,
    SelectControl,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
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
    aspectRatio = "4/3",
    width = "auto",
    height = "auto",
    setAttributes,
}) => {
    const resetAllFilter = (newAttributes) => {
        return {
            ...newAttributes,
            aspectRatio: "4/3",
            width: "auto",
            height: "auto",
        };
    };

    return (
        <ToolsPanel
            label={__("Image Settings", "polaris-blocks")}
            resetAllFilter={resetAllFilter}
            panelId="image-settings"
        >
            <ToolsPanelItem
                hasValue={() => aspectRatio !== "4/3"}
                label={__("Aspect Ratio", "polaris-blocks")}
                onDeselect={() => setAttributes({ aspectRatio: "4/3" })}
                resetAllFilter={resetAllFilter}
                isShownByDefault
                panelId="image-settings"
            >
                <SelectControl
                    __nextHasNoMarginBottom={true}
                    __next40pxDefaultSize
                    label={__("Aspect Ratio", "polaris-blocks")}
                    value={aspectRatio}
                    onChange={(value) => setAttributes({ aspectRatio: value })}
                    options={aspectRatioOptions}
                />
            </ToolsPanelItem>

            <Flex gap={4} style={{ minWidth: 250 }}>
                <FlexBlock>
                    <ToolsPanelItem
                        hasValue={() => width !== "auto"}
                        label={__("Width", "polaris-blocks")}
                        onDeselect={() => setAttributes({ width: "auto" })}
                        resetAllFilter={resetAllFilter}
                        panelId="image-settings"
                    >
                        <UnitControl
                            __next40pxDefaultSize
                            label={__("Width", "polaris-blocks")}
                            onChange={(value) =>
                                setAttributes({ width: value })
                            }
                            value={width}
                            placeholder={__("Auto", "polaris-blocks")}
                        />
                    </ToolsPanelItem>
                </FlexBlock>
                <FlexBlock>
                    <ToolsPanelItem
                        hasValue={() => height !== "auto"}
                        label={__("Height", "polaris-blocks")}
                        onDeselect={() => setAttributes({ height: "auto" })}
                        resetAllFilter={resetAllFilter}
                        panelId="image-settings"
                    >
                        <UnitControl
                            __next40pxDefaultSize
                            label={__("Height", "polaris-blocks")}
                            onChange={(value) =>
                                setAttributes({ height: value })
                            }
                            value={height}
                            placeholder={__("Auto", "polaris-blocks")}
                        />
                    </ToolsPanelItem>
                </FlexBlock>
            </Flex>
        </ToolsPanel>
    );
};

export { ImageControls };
