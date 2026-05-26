import {
	ToggleControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Toggle to exclude the post currently being viewed from feed query results.
 * Intended for single templates where the same layout renders every post.
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @param {boolean} props.isShownByDefault Whether to show by default in ToolsPanel (default: true)
 * @returns {WPElement} Element to render
 */
function HideCurrentPostControl({
	attributes: { hideCurrentPost = true },
	setAttributes,
	isShownByDefault = true,
}) {
	const defaultHideCurrentPost = true;

	return (
		<ToolsPanelItem
			hasValue={() => hideCurrentPost !== defaultHideCurrentPost}
			label={__("Hide Current Post", "built_starter")}
			onDeselect={() =>
				setAttributes({ hideCurrentPost: defaultHideCurrentPost })
			}
			isShownByDefault={isShownByDefault}
		>
			<ToggleControl
				__nextHasNoMarginBottom={true}
				label={__("Hide Current Post", "built_starter")}
				checked={hideCurrentPost}
				onChange={(value) => setAttributes({ hideCurrentPost: value })}
				help={__(
					"On single posts and templates, exclude the post being viewed from this feed.",
					"built_starter",
				)}
			/>
		</ToolsPanelItem>
	);
}

export { HideCurrentPostControl };
