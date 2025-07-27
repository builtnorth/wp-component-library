/**
 * WordPress dependencies
 */
import { InspectorControls } from "@wordpress/block-editor";
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const SectionDividerSettings = ({
	divider,
	onDividerChange,
	resetAll,

	// Panel configuration
	panelTitle = __("Section Divider", "wp-component-library"),
	group = "styles",
	className = "built-inspector-section-divider-settings",
}) => {
	// Get divider configuration
	const dividerConfig = window.polaris_localize?.blocks?.editor_experience?.section_divider;
	
	// Don't render if dividers are disabled
	if (!dividerConfig?.enabled) {
		return null;
	}

	const hasDivider = divider && divider !== "none";

	const handleReset = () => {
		onDividerChange("none");
		if (resetAll) resetAll();
	};

	return (
		<InspectorControls group={group}>
			<ToolsPanel
				label={panelTitle}
				resetAll={handleReset}
				className={className}
			>
				<ToolsPanelItem
					hasValue={() => hasDivider}
					label={__("Divider", "wp-component-library")}
					onDeselect={() => onDividerChange("none")}
				>
					<ToggleGroupControl
						label={__("Divider", "wp-component-library")}
						help={__(
							"Add dividers to the section",
							"wp-component-library",
						)}
						value={divider || "none"}
						onChange={onDividerChange}
						isBlock
					>
						<ToggleGroupControlOption
							value="none"
							label={__("None", "wp-component-library")}
						/>
						<ToggleGroupControlOption
							value="top"
							label={__("Top", "wp-component-library")}
						/>
						<ToggleGroupControlOption
							value="bottom"
							label={__("Bottom", "wp-component-library")}
						/>
						<ToggleGroupControlOption
							value="both"
							label={__("Both", "wp-component-library")}
						/>
					</ToggleGroupControl>
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
	);
};

export { SectionDividerSettings };