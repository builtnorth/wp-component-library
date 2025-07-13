import {
    FormTokenField,
    Spinner,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useEffect, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Standalone term selection control
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @param {string} props.selectedTaxonomy The taxonomy to select terms from
 * @param {boolean} props.renderAsToolsPanelItem Whether to render as ToolsPanelItem
 * @param {boolean} props.isShownByDefault Whether to show by default in ToolsPanel (default: true)
 * @returns {WPElement} Element to render
 */
function ManualTermSelector({
    attributes: { selectedTerms = [] },
    setAttributes,
    selectedTaxonomy,
    renderAsToolsPanelItem = true,
    isShownByDefault = true,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const defaultSelectedTerms = [];

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

    const control = (
        <>
            <FormTokenField
                __next40pxDefaultSize={true}
                __nextHasNoMarginBottom
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
    );

    if (!renderAsToolsPanelItem) {
        return control;
    }

    return (
        <ToolsPanelItem
            hasValue={() => selectedTerms && selectedTerms.length > 0}
            label={__("Select Terms", "built")}
            onDeselect={() =>
                setAttributes({ selectedTerms: defaultSelectedTerms })
            }
            isShownByDefault={isShownByDefault}
        >
            {control}
        </ToolsPanelItem>
    );
}

export { ManualTermSelector };
