import { PanelBody, RangeControl, SelectControl } from "@wordpress/components";
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

    const displayOptions = [
        { label: "Grid", value: "grid" },
        { label: "Slider", value: "slider" },
        { label: "List", value: "list" },
        { label: "Pills", value: "pills" },
    ].filter((option) => allowedDisplayOptions.includes(option.value));

    return (
        <PanelBody
            title={__("Feed Display", "built_starter")}
            initialOpen={true}
        >
            <SelectControl
                label="Display As"
                value={displayAs}
                options={displayOptions}
                onChange={(value) => setAttributes({ displayAs: value })}
            />

            {showDisplayAmount && (
                <RangeControl
                    label={displayAmountLabel}
                    value={postsPerPage}
                    onChange={(postsPerPageNew) =>
                        setAttributes({ postsPerPage: postsPerPageNew })
                    }
                    min={1}
                    max={50}
                />
            )}

            {displayAs !== "list" && displayAs !== "pills" && (
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
            )}
            {showOrientation && displayAs !== "grid" && (
                <OrientationSettings
                    value={orientation}
                    onChange={(value) => setAttributes({ orientation: value })}
                />
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
        </PanelBody>
    );
}

export { QueryDisplay };
