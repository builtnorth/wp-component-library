/**
 * WordPress dependencies
 */
import { __experimentalToolsPanelItem as ToolsPanelItem } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import { InspectorMediaUpload } from "../../media";

const MediaSelectControl = ({
	backgroundImage = null,
	onSelect,
	onRemove,
	isShownByDefault = false,
}) => {
	const defaultBackgroundImage = null;

	return (
		<ToolsPanelItem
			hasValue={() =>
				backgroundImage && backgroundImage !== defaultBackgroundImage
			}
			label={__("Media Select", "wp-component-library")}
			onDeselect={() => onRemove()}
			isShownByDefault={isShownByDefault}
		>
			<InspectorMediaUpload
				buttonTitle={
					backgroundImage
						? __("Replace Media", "wp-component-library")
						: __("Select or Upload Media", "wp-component-library")
				}
				gallery={false}
				multiple={false}
				mediaIDs={backgroundImage}
				onSelect={onSelect}
				onRemove={onRemove}
				showImagePlaceholder={false}
			/>
		</ToolsPanelItem>
	);
};

export { MediaSelectControl };
