import {
	Icon,
	PanelBody,
	PanelRow,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	ToolbarDropdownMenu,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
	arrowDown,
	arrowRight,
	justifyCenter,
	justifyLeft,
	justifyRight,
	justifySpaceBetween,
	justifyStretch,
} from "@wordpress/icons";

import "./index.scss";

const AlignmentToolbar = ({ value, onChange }) => {
	const getIcon = (alignment) => {
		switch (alignment) {
			case "top":
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						aria-hidden="true"
						focusable="false"
					>
						<path d="M9 20h6V9H9v11zM4 4v1.5h16V4H4z"></path>
					</svg>
				);
			case "center":
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						aria-hidden="true"
						focusable="false"
					>
						<path d="M20 11h-5V4H9v7H4v1.5h5V20h6v-7.5h5z"></path>
					</svg>
				);
			case "bottom":
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						aria-hidden="true"
						focusable="false"
					>
						<path d="M15 4H9v11h6V4zM4 18.5V20h16v-1.5H4z"></path>
					</svg>
				);
			case "stretch":
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						aria-hidden="true"
						focusable="false"
					>
						<path d="M4 4v1.5h16V4H4zM7 7v10h10V7H7zM4 18.5V20h16v-1.5H4z"></path>
					</svg>
				);
			default:
				return getIcon("top"); // Default to "top" icon
		}
	};

	return (
		<ToolbarDropdownMenu
			icon={<Icon icon={getIcon(value)} />}
			label={__("Vertical", "wp-component-library")}
			controls={[
				{
					icon: <Icon icon={getIcon("top")} />,
					title: __("Top", "wp-component-library"),
					isActive: value === "flex-start",
					onClick: () => onChange("flex-start"),
				},
				{
					icon: <Icon icon={getIcon("middle")} />,
					title: __("Center", "wp-component-library"),
					isActive: value === "center",
					onClick: () => onChange("center"),
				},
				{
					icon: <Icon icon={getIcon("bottom")} />,
					title: __("Bottom", "wp-component-library"),
					isActive: value === "flex-end",
					onClick: () => onChange("flex-end"),
				},
				{
					icon: <Icon icon={getIcon("stretch")} />,
					title: __("Stretch", "wp-component-library"),
					isActive: value === "stretch",
					onClick: () => onChange("stretch"),
				},
			]}
		/>
	);
};

const JustificationToolbar = ({ value, onChange }) => {
	const getIcon = (justification) => {
		switch (justification) {
			case "left":
				return justifyLeft;
			case "center":
				return justifyCenter;
			case "right":
				return justifyRight;
			case "space-between":
				return justifySpaceBetween;
			default:
				return justifyLeft; // Default to "left" icon
		}
	};

	return (
		<ToolbarDropdownMenu
			icon={<Icon icon={getIcon(value)} />}
			label={__("Horizontal", "wp-component-library")}
			controls={[
				{
					icon: <Icon icon={justifyLeft} />,
					title: __("Left", "wp-component-library"),
					isActive: value === "flex-start",
					onClick: () => onChange("flex-start"),
				},
				{
					icon: <Icon icon={justifyCenter} />,
					title: __("Center", "wp-component-library"),
					isActive: value === "center",
					onClick: () => onChange("center"),
				},
				{
					icon: <Icon icon={justifyRight} />,
					title: __("Right", "wp-component-library"),
					isActive: value === "flex-end",
					onClick: () => onChange("flex-end"),
				},
				{
					icon: <Icon icon={justifySpaceBetween} />,
					title: __("Space Between", "wp-component-library"),
					isActive: value === "space-between",
					onClick: () => onChange("space-between"),
				},
			]}
		/>
	);
};

const LayoutPanel = ({
	alignment,
	justification,
	orientation,
	allowWrap,
	setAttributes,
}) => {
	const onAlignmentChange = (value) => setAttributes({ alignment: value });
	const onJustificationChange = (value) =>
		setAttributes({ justification: value });
	const onOrientationChange = (value) =>
		setAttributes({ orientation: value });

	const onAllowWrapChange = (value) => setAttributes({ allowWrap: value });

	return (
		<PanelBody
			title={__("Layout", "wp-component-library")}
			initialOpen={false}
		>
			<div className="custom-layout-controls">
				<PanelRow>
					<div className="justification-control">
						<span className="components-base-control__label">
							{__("Horizontal", "wp-component-library")}
						</span>
						<ToggleGroupControl
							value={justification}
							onChange={onJustificationChange}
							isBlock
						>
							<ToggleGroupControlOptionIcon
								icon={justifyLeft}
								label={__("Left", "wp-component-library")}
								value="flex-start"
							/>
							<ToggleGroupControlOptionIcon
								icon={justifyCenter}
								label={__("Center", "wp-component-library")}
								value="center"
							/>
							<ToggleGroupControlOptionIcon
								icon={justifyRight}
								label={__("Right", "wp-component-library")}
								value="flex-end"
							/>
							{orientation === "horizontal" && (
								<ToggleGroupControlOptionIcon
									icon={justifySpaceBetween}
									label={__(
										"Space Between",
										"wp-component-library",
									)}
									value="space-between"
								/>
							)}
						</ToggleGroupControl>
					</div>
					<div className="orientation-control">
						<span className="components-base-control__label">
							{__("Orientation", "wp-component-library")}
						</span>
						<ToggleGroupControl
							value={orientation || "vertical"}
							onChange={onOrientationChange}
							isBlock
						>
							<ToggleGroupControlOptionIcon
								icon={<Icon icon={arrowRight} />}
								label={__("Horizontal", "wp-component-library")}
								value="horizontal"
							/>
							<ToggleGroupControlOptionIcon
								icon={<Icon icon={arrowDown} />}
								label={__("Vertical", "wp-component-library")}
								value="vertical"
							/>
						</ToggleGroupControl>
					</div>
				</PanelRow>
				<PanelRow>
					<div className="vertical-align-control">
						<span className="components-base-control__label">
							{__("Vertical", "wp-component-library")}
						</span>
						<ToggleGroupControl
							value={alignment}
							onChange={onAlignmentChange}
							isBlock
							className="builtnorth-vertical-align-control"
						>
							<ToggleGroupControlOptionIcon
								icon={justifyLeft}
								label={__("Top", "wp-component-library")}
								value="flex-start"
							/>
							<ToggleGroupControlOptionIcon
								icon={justifyCenter}
								label={__("Center", "wp-component-library")}
								value="center"
							/>
							<ToggleGroupControlOptionIcon
								icon={justifyRight}
								label={__("Bottom", "wp-component-library")}
								value="flex-end"
							/>
							<ToggleGroupControlOptionIcon
								icon={justifyStretch}
								label={__("Stretch", "wp-component-library")}
								value="stretch"
							/>
						</ToggleGroupControl>
					</div>
				</PanelRow>
				{/* <PanelRow>
					<ToggleControl
						label={__(
							"Allow to wrap to multiple lines",
							"wp-component-library",
						)}
						checked={allowWrap}
						onChange={onAllowWrapChange}
						className="builtnorth-wp-component-library-toggle-control"
					/>
				</PanelRow> */}
			</div>
		</PanelBody>
	);
};

export { AlignmentToolbar, JustificationToolbar, LayoutPanel };
