import {
    Flex,
    FlexBlock,
    SelectControl,
    ToggleControl,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
    __experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import { aspectRatioOptions } from "./utils/aspect-ratios";

/**
 * Reusable image controls for aspect ratio, width, and height.
 * @param {object} props
 * @param {string} props.aspectRatio
 * @param {string} props.width
 * @param {string} props.height
 * @param {boolean} props.showCaption
 * @param {function} props.setAttributes
 */
const ImageControls = ({
    aspectRatio = "4/3",
    width = "auto",
    height = "auto",
    showCaption = false,
    setAttributes,
}) => {
    const resetAllFilter = (newAttributes) => {
        return {
            ...newAttributes,
            aspectRatio: "4/3",
            width: "auto",
            height: "auto",
            showCaption: false,
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

            <ToolsPanelItem
                hasValue={() => showCaption !== false}
                label={__("Show Caption", "polaris-blocks")}
                onDeselect={() => setAttributes({ showCaption: false })}
                resetAllFilter={resetAllFilter}
                isShownByDefault={false}
                panelId="image-settings"
            >
                <ToggleControl
                    __nextHasNoMarginBottom={true}
                    label={__("Show Caption", "polaris-blocks")}
                    checked={showCaption}
                    onChange={(value) => setAttributes({ showCaption: value })}
                />
            </ToolsPanelItem>
        </ToolsPanel>
    );
};

export { ImageControls };
