import { withColors } from "@wordpress/block-editor";
import { PanelBody, PanelColorSettings } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Render a custom color settings component.
 *
 * @param {Object} props - Component properties.
 * @param {Array} props.colorSettings - Array of color setting objects.
 * @param {string} props.title - Title for the panel.
 * @param {boolean} props.initialOpen - Whether the panel should be initially open.
 * @returns {WPElement} Element to render.
 */
function CustomColors({ colorSettings, title, initialOpen = true }) {
	return (
		<PanelBody
			title={title || __("Color Settings", "built_starter")}
			initialOpen={initialOpen}
		>
			<div className="built-color-controls">
				<PanelColorSettings
					className="custom-panel-color-settings"
					__experimentalIsRenderedInSidebar
					colorSettings={colorSettings}
				/>
			</div>
		</PanelBody>
	);
}

/**
 * Higher-order component to add color functionality.
 *
 * @param {Object} colorOptions - Color options for withColors HOC.
 */
const withCustomColors = (colorOptions) =>
	withColors(colorOptions)(CustomColors);

export { CustomColors, withCustomColors };
