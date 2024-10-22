import {
	Icon,
	PanelBody,
	PanelRow,
	ToggleControl,
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
} from "@wordpress/icons";

import "./index.scss";

const VerticalAlignmentToolbar = ({ value, onChange }) => {
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
			default:
				return getIcon("top"); // Default to "top" icon
		}
	};

	return (
		<ToolbarDropdownMenu
			icon={<Icon icon={getIcon(value)} />}
			label={__("Vertical Alignment", "wp-component-library")}
			controls={[
				{
					icon: <Icon icon={getIcon("top")} />,
					title: __("Align top", "wp-component-library"),
					isActive: value === "top",
					onClick: () => onChange("top"),
				},
				{
					icon: <Icon icon={getIcon("middle")} />,
					title: __("Align middle", "wp-component-library"),
					isActive: value === "center",
					onClick: () => onChange("center"),
				},
				{
					icon: <Icon icon={getIcon("bottom")} />,
					title: __("Align bottom", "wp-component-library"),
					isActive: value === "bottom",
					onClick: () => onChange("bottom"),
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
			label={__("Justification", "wp-component-library")}
			controls={[
				{
					icon: <Icon icon={justifyLeft} />,
					title: __("Left", "wp-component-library"),
					isActive: value === "left",
					onClick: () => onChange("left"),
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
					isActive: value === "right",
					onClick: () => onChange("right"),
				},
				{
					icon: <Icon icon={justifySpaceBetween} />,
					title: __("Space between", "wp-component-library"),
					isActive: value === "space-between",
					onClick: () => onChange("space-between"),
				},
			]}
		/>
	);
};

const LayoutPanel = ({
	verticalAlignment,
	justification,
	orientation,
	allowWrap,
	onVerticalAlignmentChange,
	onJustificationChange,
	onOrientationChange,
	onAllowWrapChange,
}) => {
	return (
		<PanelBody
			title={__("Layout", "wp-component-library")}
			initialOpen={false}
		>
			<div className="custom-layout-controls">
				<PanelRow>
					<div className="justification-control">
						<span className="components-base-control__label">
							{__("Justification", "wp-component-library")}
						</span>
						<ToggleGroupControl
							value={justification}
							onChange={onJustificationChange}
							isBlock
						>
							<ToggleGroupControlOptionIcon
								icon={justifyLeft}
								label={__("Left", "wp-component-library")}
								value="left"
							/>
							<ToggleGroupControlOptionIcon
								icon={justifyCenter}
								label={__("Center", "wp-component-library")}
								value="center"
							/>
							<ToggleGroupControlOptionIcon
								icon={justifyRight}
								label={__("Right", "wp-component-library")}
								value="right"
							/>
							<ToggleGroupControlOptionIcon
								icon={justifySpaceBetween}
								label={__(
									"Space between",
									"wp-component-library",
								)}
								value="space-between"
							/>
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
							{__("Vertical Alignment", "wp-component-library")}
						</span>
						<ToggleGroupControl
							value={verticalAlignment}
							onChange={onVerticalAlignmentChange}
							isBlock
							className="builtnorth-vertical-align-control"
						>
							<ToggleGroupControlOptionIcon
								icon={justifyLeft}
								label={__("Align top", "wp-component-library")}
								value="top"
							/>
							<ToggleGroupControlOptionIcon
								icon={justifyCenter}
								label={__(
									"Align middle",
									"wp-component-library",
								)}
								value="center"
							/>
							<ToggleGroupControlOptionIcon
								icon={justifyRight}
								label={__(
									"Align bottom",
									"wp-component-library",
								)}
								value="bottom"
							/>
						</ToggleGroupControl>
					</div>
				</PanelRow>
				<PanelRow>
					<ToggleControl
						label={__(
							"Allow to wrap to multiple lines",
							"wp-component-library",
						)}
						checked={allowWrap}
						onChange={onAllowWrapChange}
						className="builtnorth-wp-component-library-toggle-control"
					/>
				</PanelRow>
			</div>
		</PanelBody>
	);
};

export { JustificationToolbar, LayoutPanel, VerticalAlignmentToolbar };
