import {
	Flex,
	FlexBlock,
	SelectControl,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import { useAspectRatioOptions } from "./utils/aspect-ratios";

/**
 * Reusable image controls for aspect ratio, width, height, scale, and caption.
 * @param {object} props
 * @param {string} props.aspectRatio
 * @param {string} props.width
 * @param {string} props.height
 * @param {boolean} props.showCaption
 * @param {string} props.scale - Object-fit value: "cover" or "contain".
 * @param {function} props.setAttributes
 */
const SCALE_HELP = {
	cover: __("Image covers the space evenly.", "wp-component-library"),
	contain: __("Image is contained without cropping.", "wp-component-library"),
};

const ImageControls = ({
	aspectRatio = "4/3",
	width = "auto",
	height = "auto",
	showCaption = false,
	scale = "cover",
	setAttributes,
}) => {
	// Get aspect ratio options from theme.json
	const aspectRatioOptions = useAspectRatioOptions();

	const resetAllFilter = (newAttributes) => {
		return {
			...newAttributes,
			aspectRatio: "4/3",
			width: "auto",
			height: "auto",
			showCaption: false,
			scale: "cover",
		};
	};

	return (
		<ToolsPanel
			label={__("Image Settings", "wp-component-library")}
			resetAllFilter={resetAllFilter}
			panelId="image-settings"
		>
			<ToolsPanelItem
				hasValue={() => aspectRatio !== "4/3"}
				label={__("Aspect Ratio", "wp-component-library")}
				onDeselect={() => setAttributes({ aspectRatio: "4/3" })}
				resetAllFilter={resetAllFilter}
				isShownByDefault
				panelId="image-settings"
			>
				<SelectControl
					__nextHasNoMarginBottom={true}
					__next40pxDefaultSize
					label={__("Aspect Ratio", "wp-component-library")}
					value={aspectRatio}
					onChange={(value) => setAttributes({ aspectRatio: value })}
					options={aspectRatioOptions}
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={() => scale !== "cover"}
				label={__("Scale", "wp-component-library")}
				onDeselect={() => setAttributes({ scale: "cover" })}
				resetAllFilter={resetAllFilter}
				isShownByDefault
				panelId="image-settings"
			>
				<ToggleGroupControl
					__nextHasNoMarginBottom={true}
					__next40pxDefaultSize
					label={__("Scale", "wp-component-library")}
					value={scale}
					onChange={(value) => setAttributes({ scale: value })}
					isBlock
					help={SCALE_HELP[scale] ?? ""}
				>
					<ToggleGroupControlOption
						value="cover"
						label={__("Cover", "wp-component-library")}
					/>
					<ToggleGroupControlOption
						value="contain"
						label={__("Contain", "wp-component-library")}
					/>
				</ToggleGroupControl>
			</ToolsPanelItem>

			<Flex gap={4} style={{ minWidth: 250 }}>
				<FlexBlock>
					<ToolsPanelItem
						hasValue={() => width !== "auto"}
						label={__("Width", "wp-component-library")}
						onDeselect={() => setAttributes({ width: "auto" })}
						resetAllFilter={resetAllFilter}
						panelId="image-settings"
					>
						<UnitControl
							__next40pxDefaultSize
							label={__("Width", "wp-component-library")}
							onChange={(value) =>
								setAttributes({ width: value })
							}
							value={width}
							placeholder={__("Auto", "wp-component-library")}
						/>
					</ToolsPanelItem>
				</FlexBlock>
				<FlexBlock>
					<ToolsPanelItem
						hasValue={() => height !== "auto"}
						label={__("Height", "wp-component-library")}
						onDeselect={() => setAttributes({ height: "auto" })}
						resetAllFilter={resetAllFilter}
						panelId="image-settings"
					>
						<UnitControl
							__next40pxDefaultSize
							label={__("Height", "wp-component-library")}
							onChange={(value) =>
								setAttributes({ height: value })
							}
							value={height}
							placeholder={__("Auto", "wp-component-library")}
						/>
					</ToolsPanelItem>
				</FlexBlock>
			</Flex>

			<ToolsPanelItem
				hasValue={() => showCaption !== false}
				label={__("Show Caption", "wp-component-library")}
				onDeselect={() => setAttributes({ showCaption: false })}
				resetAllFilter={resetAllFilter}
				isShownByDefault={false}
				panelId="image-settings"
			>
				<ToggleControl
					__nextHasNoMarginBottom={true}
					label={__("Show Caption", "wp-component-library")}
					checked={showCaption}
					onChange={(value) => setAttributes({ showCaption: value })}
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
};

export { ImageControls };
