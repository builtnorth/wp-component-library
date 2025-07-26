/**
 * WordPress dependencies
 */
import { InspectorControls } from "@wordpress/block-editor";
import {
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const SectionPatternSettings = ({
	pattern,
	onPatternChange,
	resetAll,

	// Panel configuration
	panelTitle = __("Section Pattern", "wp-component-library"),
	group = "styles",
	className = "built-inspector-section-pattern-settings",
}) => {
	// Get pattern configuration
	const patternConfig = window.polaris_localize?.blocks?.editor_experience?.patterns;
	
	// Don't render if patterns are disabled
	if (!patternConfig?.enabled) {
		return null;
	}

	const availablePatterns = patternConfig.available_patterns || {};
	const hasPattern = pattern && pattern !== "";

	const handleReset = () => {
		onPatternChange("");
		if (resetAll) resetAll();
	};

	// Build options for SelectControl
	const patternOptions = [
		{ label: __("None", "wp-component-library"), value: "" },
		...Object.entries(availablePatterns).map(([value, label]) => ({
			label,
			value,
		})),
	];

	return (
		<InspectorControls group={group}>
			<ToolsPanel
				label={panelTitle}
				resetAll={handleReset}
				className={className}
			>
				<ToolsPanelItem
					hasValue={() => hasPattern}
					label={__("Pattern", "wp-component-library")}
					onDeselect={() => onPatternChange("")}
				>
					<SelectControl
						label={__("Pattern", "wp-component-library")}
						help={__(
							"Select a background pattern",
							"wp-component-library",
						)}
						value={pattern || ""}
						onChange={onPatternChange}
						options={patternOptions}
					/>
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
	);
};

export { SectionPatternSettings };
