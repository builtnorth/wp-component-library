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
	{ value: "none", label: __("None", "wp-component-library") },
	{ value: "top", label: __("Top", "wp-component-library") },
	{ value: "bottom", label: __("Bottom", "wp-component-library") },
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
	/** @type {('none'|'top'|'bottom')[]} Which positions to show (default: all three). */
	positions = ["none", "top", "bottom"],
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

	// Hide the panel until the section has a clip surface (color, image, or pattern).
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

	if (!showDividerControls) {
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
							"Requires a section background (image, pattern, or background color).",
							"wp-component-library",
						)}
						value={divider || "none"}
						onChange={onDividerChange}
						isBlock
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
