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
 * @returns {WPElement} Element to render
 */
function TaxonomySelect({
    attributes: { selectedTaxonomy },
    setAttributes,
    postType,
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

    // Auto-select first taxonomy when post type changes
    useEffect(() => {
        if (filteredTaxonomies.length > 0) {
            const firstTaxonomy = filteredTaxonomies[0].slug;
            // Only set if current selection is empty or not in the filtered list
            const isCurrentSelectionValid = filteredTaxonomies.some(
                (tax) => tax.slug === selectedTaxonomy,
            );

            if (!selectedTaxonomy || !isCurrentSelectionValid) {
                setAttributes({
                    selectedTaxonomy: firstTaxonomy,
                    selectedTerms: [], // Clear terms when taxonomy changes
                });
            }
        } else if (filteredTaxonomies.length === 0 && selectedTaxonomy) {
            // Clear selection if no taxonomies available
            setAttributes({
                selectedTaxonomy: defaultSelectedTaxonomy,
                selectedTerms: [],
            });
        }
    }, [filteredTaxonomies, selectedTaxonomy, setAttributes]);

    const taxonomyOptions = filteredTaxonomies.map((tax) => ({
        label: tax.labels.singular_name || tax.name,
        value: tax.slug,
    }));

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
            isShownByDefault={true}
        >
            <SelectControl
                label={__("Select Taxonomy", "built")}
                value={selectedTaxonomy}
                options={taxonomyOptions}
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
