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
    alignCenter,
    alignLeft,
    alignRight,
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

    const handleChange = (newValue) => {
        onChange(value === newValue ? null : newValue);
    };

    return (
        <ToolbarDropdownMenu
            icon={<Icon icon={getIcon(value)} />}
            label={__("Alignment", "wp-component-library")}
            controls={[
                {
                    icon: <Icon icon={getIcon("top")} />,
                    title: __("Top", "wp-component-library"),
                    isActive: value === "flex-start",
                    onClick: () => handleChange("flex-start"),
                },
                {
                    icon: <Icon icon={getIcon("middle")} />,
                    title: __("Center", "wp-component-library"),
                    isActive: value === "center",
                    onClick: () => handleChange("center"),
                },
                {
                    icon: <Icon icon={getIcon("bottom")} />,
                    title: __("Bottom", "wp-component-library"),
                    isActive: value === "flex-end",
                    onClick: () => handleChange("flex-end"),
                },
                {
                    icon: <Icon icon={getIcon("stretch")} />,
                    title: __("Stretch", "wp-component-library"),
                    isActive: value === "stretch",
                    onClick: () => handleChange("stretch"),
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

    const handleChange = (newValue) => {
        onChange(value === newValue ? null : newValue);
    };

    return (
        <ToolbarDropdownMenu
            icon={<Icon icon={getIcon(value)} />}
            label={__("Justification", "wp-component-library")}
            controls={[
                {
                    icon: <Icon icon={justifyLeft} />,
                    title: __("Left", "wp-component-library"),
                    isActive: value === "flex-start",
                    onClick: () => handleChange("flex-start"),
                },
                {
                    icon: <Icon icon={justifyCenter} />,
                    title: __("Center", "wp-component-library"),
                    isActive: value === "center",
                    onClick: () => handleChange("center"),
                },
                {
                    icon: <Icon icon={justifyRight} />,
                    title: __("Right", "wp-component-library"),
                    isActive: value === "flex-end",
                    onClick: () => handleChange("flex-end"),
                },
                {
                    icon: <Icon icon={justifySpaceBetween} />,
                    title: __("Space Between", "wp-component-library"),
                    isActive: value === "space-between",
                    onClick: () => handleChange("space-between"),
                },
            ]}
        />
    );
};

const OrientationToolbar = ({ value, onChange }) => {
    const getIcon = (orientation) => {
        switch (orientation) {
            case "horizontal":
                return arrowRight;
            case "vertical":
                return arrowDown;
            default:
                return arrowRight; // Default to "horizontal" icon
        }
    };

    const handleChange = (newValue) => {
        onChange(value === newValue ? null : newValue);
    };

    return (
        <ToolbarDropdownMenu
            icon={<Icon icon={getIcon(value)} />}
            label={__("Orientation", "wp-component-library")}
            controls={[
                {
                    icon: <Icon icon={arrowRight} />,
                    title: __("Horizontal", "wp-component-library"),
                    isActive: value === "horizontal",
                    onClick: () => handleChange("horizontal"),
                },
                {
                    icon: <Icon icon={arrowDown} />,
                    title: __("Vertical", "wp-component-library"),
                    isActive: value === "vertical",
                    onClick: () => handleChange("vertical"),
                },
            ]}
        />
    );
};

const ContentAlignmentToolbar = ({ value, onChange }) => {
    const handleChange = (newValue) => {
        onChange(value === newValue ? null : newValue);
    };

    const getIcon = () => {
        switch (value) {
            case "left":
                return alignLeft;
            case "center":
                return alignCenter;
            case "right":
                return alignRight;
            default:
                return alignLeft; // Default icon when no value is selected
        }
    };

    return (
        <ToolbarDropdownMenu
            icon={<Icon icon={getIcon()} />}
            label={__("Content Alignment", "wp-component-library")}
            controls={[
                {
                    icon: <Icon icon={alignLeft} />,
                    title: __("Content Left", "wp-component-library"),
                    isActive: value === "left",
                    onClick: () => handleChange("left"),
                },
                {
                    icon: <Icon icon={alignCenter} />,
                    title: __("Content Center", "wp-component-library"),
                    isActive: value === "center",
                    onClick: () => handleChange("center"),
                },
                {
                    icon: <Icon icon={alignRight} />,
                    title: __("Content Right", "wp-component-library"),
                    isActive: value === "right",
                    onClick: () => handleChange("right"),
                },
            ]}
        />
    );
};

const JustificationSettings = ({ value, onChange, orientation }) => {
    const handleChange = (newValue) => {
        onChange(newValue === undefined ? null : newValue);
    };

    return (
        <div className="justification-control">
            <span className="components-base-control__label">
                {__("Justification", "wp-component-library")}
            </span>
            <ToggleGroupControl
                value={value || ""}
                onChange={handleChange}
                isBlock
                isDeselectable
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
                        label={__("Space Between", "wp-component-library")}
                        value="space-between"
                    />
                )}
            </ToggleGroupControl>
        </div>
    );
};

const OrientationSettings = ({ value, onChange }) => {
    const handleChange = (newValue) => {
        onChange(newValue === undefined ? null : newValue);
    };

    return (
        <div className="orientation-control">
            <span className="components-base-control__label">
                {__("Orientation", "wp-component-library")}
            </span>
            <ToggleGroupControl
                value={value || ""}
                onChange={handleChange}
                isBlock
                isDeselectable
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
    );
};

const AlignmentSettings = ({ value, onChange }) => {
    const handleChange = (newValue) => {
        onChange(newValue === undefined ? null : newValue);
    };

    return (
        <div className="vertical-align-control">
            <span className="components-base-control__label">
                {__("Alignment", "wp-component-library")}
            </span>
            <ToggleGroupControl
                value={value || ""}
                onChange={handleChange}
                isBlock
                isDeselectable
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
    );
};

const ContentAlignmentSettings = ({ value, onChange }) => {
    const handleChange = (newValue) => {
        onChange(newValue === undefined ? null : newValue);
    };

    return (
        <div className="content-alignment-control">
            <span className="components-base-control__label">
                {__("Content", "wp-component-library")}
            </span>
            <ToggleGroupControl
                value={value || ""}
                onChange={handleChange}
                isBlock
                isDeselectable
            >
                <ToggleGroupControlOptionIcon
                    icon={alignLeft}
                    label={__("Content Left", "wp-component-library")}
                    value="left"
                />
                <ToggleGroupControlOptionIcon
                    icon={alignCenter}
                    label={__("Content Center", "wp-component-library")}
                    value="center"
                />
                <ToggleGroupControlOptionIcon
                    icon={alignRight}
                    label={__("Content Right", "wp-component-library")}
                    value="right"
                />
            </ToggleGroupControl>
        </div>
    );
};

const AllowWrapSettings = ({ value, onChange }) => {
    const handleChange = (newValue) => {
        onChange(newValue === undefined ? null : newValue);
    };

    return (
        <ToggleControl
            label={__(
                "Allow to wrap to multiple lines",
                "wp-component-library",
            )}
            checked={value}
            onChange={handleChange}
            className="builtnorth-wp-component-library-toggle-control"
        />
    );
};

const LayoutPanel = ({
    panelTitle,
    initialOpen = true,
    alignment,
    justification,
    orientation,
    allowWrap,
    contentAlignment,
    setAttributes,
    controls = [
        "horizontal",
        "orientation",
        "vertical",
        "content",
        "allowWrap",
    ],
}) => {
    const handleChange = (attribute) => (value) => {
        setAttributes({ [attribute]: value === undefined ? null : value });
    };

    return (
        <PanelBody
            title={panelTitle || __("Layout", "wp-component-library")}
            initialOpen={initialOpen}
        >
            <div className="builtnorth-layout-controls">
                <PanelRow>
                    {controls.includes("horizontal") && (
                        <JustificationSettings
                            value={justification}
                            onChange={handleChange("justification")}
                            orientation={orientation}
                        />
                    )}
                    {controls.includes("orientation") && (
                        <OrientationSettings
                            value={orientation}
                            onChange={handleChange("orientation")}
                        />
                    )}
                </PanelRow>
                <PanelRow>
                    {controls.includes("vertical") && (
                        <AlignmentSettings
                            value={alignment}
                            onChange={handleChange("alignment")}
                        />
                    )}
                    {controls.includes("content") && (
                        <ContentAlignmentSettings
                            value={contentAlignment}
                            onChange={handleChange("contentAlignment")}
                        />
                    )}
                </PanelRow>
                {controls.includes("allowWrap") && (
                    <PanelRow>
                        <AllowWrapSettings
                            value={allowWrap}
                            onChange={handleChange("allowWrap")}
                        />
                    </PanelRow>
                )}
            </div>
        </PanelBody>
    );
};

export {
    AlignmentToolbar,
    AllowWrapSettings,
    ContentAlignmentSettings,
    ContentAlignmentToolbar,
    JustificationSettings,
    JustificationToolbar,
    LayoutPanel,
    OrientationSettings,
    OrientationToolbar,
};
