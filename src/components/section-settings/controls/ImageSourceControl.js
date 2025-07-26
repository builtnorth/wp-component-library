/**
 * WordPress dependencies
 */
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const ImageSourceControl = ({
	useFeaturedImage = false,
	onToggle,
	isShownByDefault = false,
}) => {
	const defaultImageSource = "upload";

	return (
		<ToolsPanelItem
			hasValue={() =>
				(useFeaturedImage ? "featured" : "upload") !==
				defaultImageSource
			}
			label={__("Image Source", "polaris-blocks")}
			onDeselect={() => onToggle(false)}
			isShownByDefault={isShownByDefault}
		>
			<ToggleGroupControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize={true}
				label={__("Image Source", "polaris-blocks")}
				value={useFeaturedImage ? "featured" : "upload"}
				onChange={(value) => onToggle(value === "featured")}
				isBlock
			>
				<ToggleGroupControlOption
					value="upload"
					label={__("Select Image", "polaris-blocks")}
				/>
				<ToggleGroupControlOption
					value="featured"
					label={__("Featured Image", "polaris-blocks")}
				/>
			</ToggleGroupControl>
		</ToolsPanelItem>
	);
};

export { ImageSourceControl };
