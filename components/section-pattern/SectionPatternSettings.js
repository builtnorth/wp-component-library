/**
 * WordPress dependencies
 */
import { InspectorControls } from "@wordpress/block-editor";
import {
	__experimentalAlignmentMatrixControl as AlignmentMatrixControl,
	BaseControl,
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import {
	getEditorExperiencePatterns,
	SKIN_CHANGED_EVENT,
} from "../../utils/polaris-localize";

function readPatternConfig() {
	return getEditorExperiencePatterns();
}

function usePatternConfig() {
	const [patternConfig, setPatternConfig] = useState(readPatternConfig);

	useEffect(() => {
		const sync = () => setPatternConfig(readPatternConfig());

		document.addEventListener(SKIN_CHANGED_EVENT, sync);

		return () => {
			document.removeEventListener(SKIN_CHANGED_EVENT, sync);
		};
	}, []);

	return patternConfig;
}

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
	const patternConfig = usePatternConfig();

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
					isShownByDefault
				>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
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
				{onPatternAlignChange && (
					<ToolsPanelItem
						hasValue={() => hasPatternAlign}
						label={__("Pattern Position", "wp-component-library")}
						onDeselect={() => onPatternAlignChange("center center")}
						isShownByDefault={hasPattern}
					>
						<BaseControl
							label={__(
								"Pattern Position",
								"wp-component-library",
							)}
							help={__(
								"Choose where the pattern appears in the section",
								"wp-component-library",
							)}
						>
							<AlignmentMatrixControl
								value={patternAlign}
								onChange={onPatternAlignChange}
								disabled={!hasPattern}
							/>
						</BaseControl>
					</ToolsPanelItem>
				)}
			</ToolsPanel>
		</InspectorControls>
	);
};

export { SectionPatternSettings };
