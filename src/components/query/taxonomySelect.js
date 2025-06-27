import {
    SelectControl,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Standalone taxonomy selection control
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @param {string} props.postType The post type to get taxonomies for
 * @param {boolean} props.showNoneOption Whether to show a "none" option (default: false)
 * @param {string} props.noneOptionLabel Label for the "none" option (default: "No Taxonomy Filter")
 * @param {boolean} props.isShownByDefault Whether to show by default in ToolsPanel (default: false)
 * @returns {WPElement} Element to render
 */
function TaxonomySelect({
    attributes: { selectedTaxonomy },
    setAttributes,
    postType,
    showNoneOption = false,
    noneOptionLabel = "No Taxonomy Filter",
    isShownByDefault = false,
}) {
    const defaultSelectedTaxonomy = "";

    // Get available taxonomies for the post type
    const { taxonomies, filteredTaxonomies } = useSelect(
        (select) => {
            if (!postType) {
                return {
                    taxonomies: [],
                    filteredTaxonomies: [],
                };
            }

            const allTaxonomies = select("core").getTaxonomies({
                per_page: -1,
            });
            const filtered = allTaxonomies
                ? allTaxonomies.filter((tax) => tax.types.includes(postType))
                : [];

            return {
                taxonomies: allTaxonomies || [],
                filteredTaxonomies: filtered,
            };
        },
        [postType],
    );

    // Auto-select first taxonomy when post type changes (only if showNoneOption is false)
    useEffect(() => {
        if (filteredTaxonomies.length > 0) {
            // Only set if current selection is empty or not in the filtered list
            const isCurrentSelectionValid =
                selectedTaxonomy === "" || // Empty is always valid when showNoneOption is true
                filteredTaxonomies.some((tax) => tax.slug === selectedTaxonomy);

            if (!isCurrentSelectionValid) {
                // If showNoneOption is true, default to empty, otherwise select first taxonomy
                const defaultValue = showNoneOption
                    ? ""
                    : filteredTaxonomies[0].slug;
                setAttributes({
                    selectedTaxonomy: defaultValue,
                    selectedTerms: [], // Clear terms when taxonomy changes
                });
            } else if (
                !showNoneOption &&
                !selectedTaxonomy &&
                filteredTaxonomies.length > 0
            ) {
                // If showNoneOption is false and no selection, select first taxonomy
                setAttributes({
                    selectedTaxonomy: filteredTaxonomies[0].slug,
                    selectedTerms: [],
                });
            }
        } else if (filteredTaxonomies.length === 0 && selectedTaxonomy) {
            // Clear selection if no taxonomies available
            setAttributes({
                selectedTaxonomy: defaultSelectedTaxonomy,
                selectedTerms: [],
            });
        }
    }, [filteredTaxonomies, selectedTaxonomy, setAttributes, showNoneOption]);

    // Build taxonomy options
    const taxonomyOptions = filteredTaxonomies.map((tax) => ({
        label: tax.labels.singular_name || tax.name,
        value: tax.slug,
    }));

    // Add "none" option if enabled
    const allOptions = showNoneOption
        ? [{ label: noneOptionLabel, value: "" }, ...taxonomyOptions]
        : taxonomyOptions;

    return (
        <ToolsPanelItem
            hasValue={() => selectedTaxonomy !== defaultSelectedTaxonomy}
            label={__("Select Taxonomy", "built")}
            onDeselect={() =>
                setAttributes({
                    selectedTaxonomy: defaultSelectedTaxonomy,
                    selectedTerms: [],
                })
            }
            isShownByDefault={isShownByDefault}
        >
            <SelectControl
                label={__("Select Taxonomy", "built")}
                value={selectedTaxonomy}
                options={allOptions}
                onChange={(value) =>
                    setAttributes({
                        selectedTaxonomy: value,
                        selectedTerms: [], // Clear terms when taxonomy changes
                    })
                }
                disabled={!postType || filteredTaxonomies.length === 0}
                help={
                    !postType
                        ? __("Please select a post type first", "built")
                        : filteredTaxonomies.length === 0
                          ? __(
                                "No taxonomies available for this post type",
                                "built",
                            )
                          : undefined
                }
            />
        </ToolsPanelItem>
    );
}

export { TaxonomySelect };
