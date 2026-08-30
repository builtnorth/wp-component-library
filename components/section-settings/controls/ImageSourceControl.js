/**
 * WordPress dependencies
 */
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const ImageSourceToggle = ({ useFeaturedImage = false, onToggle }) => (
	<ToggleGroupControl
		__nextHasNoMarginBottom
		__next40pxDefaultSize={true}
		label={__("Image Source", "wp-component-library")}
		value={useFeaturedImage ? "featured" : "upload"}
		onChange={(value) => onToggle(value === "featured")}
		isBlock
	>
		<ToggleGroupControlOption
			value="upload"
			label={__("Select Image", "wp-component-library")}
		/>
		<ToggleGroupControlOption
			value="featured"
			label={__("Featured Image", "wp-component-library")}
		/>
	</ToggleGroupControl>
);

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
			label={__("Image Source", "wp-component-library")}
			onDeselect={() => onToggle(false)}
			isShownByDefault={isShownByDefault}
		>
			<ImageSourceToggle
				useFeaturedImage={useFeaturedImage}
				onToggle={onToggle}
			/>
		</ToolsPanelItem>
	);
};

export { ImageSourceControl, ImageSourceToggle };
