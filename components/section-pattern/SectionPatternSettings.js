/**
 * WordPress dependencies
 */
import { InspectorControls } from "@wordpress/block-editor";
import {
	BaseControl,
	SelectControl,
	__experimentalAlignmentMatrixControl as AlignmentMatrixControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const SectionPatternSettings = ({
	pattern,
	onPatternChange,
	patternAlign = "center center",
	onPatternAlignChange,
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
	const hasPatternAlign = patternAlign && patternAlign !== "center center";

	const handleReset = () => {
		onPatternChange("");
		if (onPatternAlignChange) onPatternAlignChange("center center");
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
				{hasPattern && onPatternAlignChange && (
					<ToolsPanelItem
						hasValue={() => hasPatternAlign}
						label={__("Pattern Position", "wp-component-library")}
						onDeselect={() => onPatternAlignChange("center center")}
					>
						<BaseControl
							label={__("Pattern Position", "wp-component-library")}
							help={__("Choose where the pattern appears in the section", "wp-component-library")}
						>
							<AlignmentMatrixControl
								value={patternAlign}
								onChange={onPatternAlignChange}
							/>
						</BaseControl>
					</ToolsPanelItem>
				)}
			</ToolsPanel>
		</InspectorControls>
	);
};

export { SectionPatternSettings };
