/**
 * WordPress dependencies
 */
import { InspectorControls, store as blockEditorStore } from "@wordpress/block-editor";
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { getEditorExperienceSectionDivider } from "../../utils/polaris-localize";
import { sectionHasDividerBackground } from "./sectionHasDividerBackground";

const ALL_POSITIONS = [
	{ value: "top", label: __("Top", "wp-component-library") },
	{ value: "bottom", label: __("Bottom", "wp-component-library") },
	{ value: "both", label: __("Both", "wp-component-library") },
	{ value: "none", label: __("None", "wp-component-library") },
];

const SectionDividerSettings = ({
	clientId,
	/** Optional fallback when the block store is unavailable in this frame. */
	attributes: attributesProp,
	divider,
	onDividerChange,
	resetAll,

	// Panel configuration
	panelTitle = __("Section Divider", "wp-component-library"),
	group = "styles",
	className = "built-inspector-section-divider-settings",
	/** @type {('top'|'bottom'|'both'|'none')[]} Which positions to show (default: all four). */
	positions = ["top", "bottom", "both", "none"],
}) => {
	const dividerConfig = getEditorExperienceSectionDivider();

	if (!dividerConfig?.enabled) {
		return null;
	}

	const requiresBackground = dividerConfig?.requires_background !== false;

	// Prefer live block-store attributes; fall back to props from the edit component.
	const storeAttributes = useSelect(
		(select) =>
			clientId
				? select(blockEditorStore).getBlockAttributes(clientId)
				: null,
		[clientId],
	);

	const resolvedHasBackground = sectionHasDividerBackground(
		storeAttributes ?? attributesProp ?? {},
	);

	const showDividerControls = requiresBackground
		? resolvedHasBackground
		: true;

	useEffect(() => {
		if (
			requiresBackground &&
			!resolvedHasBackground &&
			divider &&
			divider !== "none"
		) {
			onDividerChange("none");
		}
	}, [
		requiresBackground,
		resolvedHasBackground,
		divider,
		onDividerChange,
	]);

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
					isShownByDefault
				>
					<ToggleGroupControl
						label={__("Divider", "wp-component-library")}
						help={
							showDividerControls
								? __(
										"Wave edge at the top, bottom, both sides, or none.",
										"wp-component-library",
									)
								: __(
										"Requires a section background (image, pattern, or background color).",
										"wp-component-library",
									)
						}
						value={divider || "none"}
						onChange={onDividerChange}
						isBlock
						disabled={!showDividerControls}
					>
						{ALL_POSITIONS.filter((option) =>
							positions.includes(option.value),
						).map((option) => (
							<ToggleGroupControlOption
								key={option.value}
								value={option.value}
								label={option.label}
							/>
						))}
					</ToggleGroupControl>
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
	);
};

export { SectionDividerSettings };
