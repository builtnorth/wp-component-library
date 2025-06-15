import {
    FormTokenField,
    PanelBody,
    SelectControl,
    Spinner,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useEffect, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

function QueryTaxonomy(props) {
    const {
        attributes: { selectedTaxonomy, selectedTerms },
        setAttributes,
        postType,
    } = props;

    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Get available taxonomies for the post type
    const taxonomies = useSelect((select) =>
        select("core").getTaxonomies({ per_page: -1 }),
    );

    const filteredTaxonomies = taxonomies
        ? taxonomies.filter((tax) => tax.types.includes(postType))
        : [];

    const taxonomyOptions = filteredTaxonomies.map((tax) => ({
        label: tax.labels.singular_name || tax.name,
        value: tax.slug,
    }));

    // Fetch terms for the selected taxonomy
    const { terms, selectedTermsData, isLoading } = useSelect(
        (select) => {
            if (!selectedTaxonomy) {
                return {
                    terms: [],
                    selectedTermsData: [],
                    isLoading: false,
                };
            }

            const query = {
                per_page: 20,
                hide_empty: false,
                search: searchTerm,
            };

            // Get terms for search
            const searchTerms = searchTerm
                ? select("core").getEntityRecords(
                      "taxonomy",
                      selectedTaxonomy,
                      query,
                  )
                : [];

            // Get data for currently selected terms
            const selectedData =
                selectedTerms.length > 0
                    ? select("core").getEntityRecords(
                          "taxonomy",
                          selectedTaxonomy,
                          {
                              include: selectedTerms,
                              per_page: selectedTerms.length,
                          },
                      )
                    : [];

            return {
                terms: searchTerms || [],
                selectedTermsData: selectedData || [],
                isLoading: select("core/data").isResolving(
                    "core",
                    "getEntityRecords",
                    ["taxonomy", selectedTaxonomy, query],
                ),
            };
        },
        [searchTerm, selectedTaxonomy, selectedTerms],
    );

    // Create suggestions for FormTokenField
    const suggestions = useMemo(() => {
        if (!terms) return [];
        return terms.map((term) => ({
            id: term.id,
            value: term.name || `Term #${term.id}`,
        }));
    }, [terms]);

    // Create values for FormTokenField (selected items as readable names)
    const selectedValues = useMemo(() => {
        return selectedTermsData.map((term) => term.name || `Term #${term.id}`);
    }, [selectedTermsData]);

    // Handle search with debouncing
    useEffect(() => {
        if (searchTerm) {
            setIsSearching(true);
            const timeoutId = setTimeout(() => {
                setIsSearching(false);
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [searchTerm]);

    // Handle token field changes
    const handleTokenChange = (tokens) => {
        const newSelections = [];

        tokens.forEach((token) => {
            // Check if it's an existing selection
            const existingTerm = selectedTermsData.find(
                (term) => term.name === token,
            );

            if (existingTerm) {
                newSelections.push(existingTerm.id);
                return;
            }

            // Check if it's a new selection from search results
            const searchResult = terms.find((term) => term.name === token);

            if (searchResult) {
                newSelections.push(searchResult.id);
            }
        });

        setAttributes({ selectedTerms: newSelections });
    };

    return (
        <PanelBody title={__("Taxonomy Filter", "built")}>
            <SelectControl
                label={__("Select Taxonomy", "built")}
                value={selectedTaxonomy}
                options={[
                    { label: __("None", "built"), value: "" },
                    ...taxonomyOptions,
                ]}
                onChange={(value) =>
                    setAttributes({
                        selectedTaxonomy: value,
                        selectedTerms: [],
                    })
                }
            />
            {selectedTaxonomy && (
                <>
                    <FormTokenField
                        label={__("Select Terms", "built")}
                        value={selectedValues}
                        suggestions={suggestions.map((s) => s.value)}
                        onChange={handleTokenChange}
                        onInputChange={setSearchTerm}
                        placeholder={__("Type to search terms...", "built")}
                        help={__(
                            "Start typing to search for taxonomy terms, then select them from the dropdown.",
                            "built",
                        )}
                    />
                    {(isLoading || isSearching) && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginTop: "8px",
                            }}
                        >
                            <Spinner />
                            <span>{__("Searching terms...", "built")}</span>
                        </div>
                    )}
                </>
            )}
        </PanelBody>
    );
}

export { QueryTaxonomy };
