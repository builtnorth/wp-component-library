import {
    RangeControl,
    SelectControl,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { OrientationSettings } from "../layout";

/**
 * Render the settings block used to select the post types.
 *
 * @since 0.1.0
 *
 * @returns {WPElement} Element to render.
 */
function QueryDisplay(props) {
    const {
        attributes: {
            postsPerPage,
            columnCount,
            displayAs,
            showPagination,
            orientation,
        },
        setAttributes,
        allowedDisplayOptions = ["grid", "slider", "list", "pills"],
        displayAmountLabel = "Amount to Display",
        showOrientation = false,
        showDisplayAmount = true,
    } = props;

    // Default values for reset functionality
    const defaultDisplayAs = "grid";
    const defaultPostsPerPage = 6;
    const defaultColumnCount = 3;
    const defaultOrientation = "horizontal";

    // Reset function for ToolsPanel
    const resetAll = () => {
        setAttributes({
            displayAs: defaultDisplayAs,
            postsPerPage: defaultPostsPerPage,
            columnCount: defaultColumnCount,
            orientation: defaultOrientation,
        });
    };

    const displayOptions = [
        { label: "Grid", value: "grid" },
        { label: "Slider", value: "slider" },
        { label: "List", value: "list" },
        { label: "Pills", value: "pills" },
    ].filter((option) => allowedDisplayOptions.includes(option.value));

    return (
        <ToolsPanel
            label={__("Display Settings", "built_starter")}
            resetAll={resetAll}
        >
            <ToolsPanelItem
                hasValue={() => displayAs !== defaultDisplayAs}
                label={__("Display Type", "built_starter")}
                onDeselect={() =>
                    setAttributes({ displayAs: defaultDisplayAs })
                }
                isShownByDefault={true}
            >
                <SelectControl
                    label="Display As"
                    value={displayAs}
                    options={displayOptions}
                    onChange={(value) => setAttributes({ displayAs: value })}
                />
            </ToolsPanelItem>

            {showDisplayAmount && (
                <ToolsPanelItem
                    hasValue={() => postsPerPage !== defaultPostsPerPage}
                    label={displayAmountLabel}
                    onDeselect={() =>
                        setAttributes({ postsPerPage: defaultPostsPerPage })
                    }
                    isShownByDefault={false}
                >
                    <RangeControl
                        label={displayAmountLabel}
                        value={postsPerPage}
                        onChange={(postsPerPageNew) =>
                            setAttributes({ postsPerPage: postsPerPageNew })
                        }
                        min={1}
                        max={50}
                    />
                </ToolsPanelItem>
            )}

            {displayAs !== "list" && displayAs !== "pills" && (
                <ToolsPanelItem
                    hasValue={() => columnCount !== defaultColumnCount}
                    label={__("Columns/Slides", "built_starter")}
                    onDeselect={() =>
                        setAttributes({ columnCount: defaultColumnCount })
                    }
                    isShownByDefault={false}
                >
                    <RangeControl
                        label={
                            displayAs == "grid"
                                ? __("Columns")
                                : __("Slides to Show")
                        }
                        value={columnCount}
                        onChange={(columnCountNew) =>
                            setAttributes({ columnCount: columnCountNew })
                        }
                        min={1}
                        max={4}
                    />
                </ToolsPanelItem>
            )}

            {showOrientation && displayAs !== "grid" && (
                <ToolsPanelItem
                    hasValue={() => orientation !== defaultOrientation}
                    label={__("Orientation", "built_starter")}
                    onDeselect={() =>
                        setAttributes({ orientation: defaultOrientation })
                    }
                    isShownByDefault={false}
                >
                    <OrientationSettings
                        value={orientation}
                        onChange={(value) =>
                            setAttributes({ orientation: value })
                        }
                    />
                </ToolsPanelItem>
            )}
            {/* {displayAs !== "slider" && (
				<ToggleControl
					label="Show Pagination"
					help="Show pagination if there are more posts than the amount to display."
					checked={showPagination}
					onChange={(showPaginationNew) =>
						setAttributes({ showPagination: showPaginationNew })
					}
				/>
			)} */}
        </ToolsPanel>
    );
}

export { QueryDisplay };
