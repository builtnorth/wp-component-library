import {
    FormTokenField,
    Notice,
    PanelBody,
    Spinner,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useEffect, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Component for manual post/taxonomy selection in query blocks
 *
 * @since 0.1.0
 *
 * @returns {WPElement} Element to render.
 */
function QueryManualSelect(props) {
    const {
        attributes: {
            selectionMode = "auto",
            selectedPosts = [],
            selectedTerms = [],
            postType = "post",
            selectedTaxonomy = "",
        },
        setAttributes,
        label = "Selection Mode",
        searchType = "posts", // "posts" or "taxonomy"
    } = props;

    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Determine what we're selecting and the current selections
    const isSelectingTaxonomy = searchType === "taxonomy";
    const currentSelections = isSelectingTaxonomy
        ? selectedTerms
        : selectedPosts;
    const selectionAttribute = isSelectingTaxonomy
        ? "selectedTerms"
        : "selectedPosts";

    // Fetch items for search functionality
    const { items, selectedItemsData, isLoading } = useSelect(
        (select) => {
            if (isSelectingTaxonomy) {
                // For taxonomy selection
                if (!selectedTaxonomy)
                    return {
                        items: [],
                        selectedItemsData: [],
                        isLoading: false,
                    };

                const query = {
                    per_page: 20,
                    hide_empty: false,
                    search: searchTerm,
                };

                // Get terms for search
                const searchItems = searchTerm
                    ? select("core").getEntityRecords(
                          "taxonomy",
                          selectedTaxonomy,
                          query,
                      )
                    : [];

                // Get data for currently selected terms
                const selectedData =
                    currentSelections.length > 0
                        ? select("core").getEntityRecords(
                              "taxonomy",
                              selectedTaxonomy,
                              {
                                  include: currentSelections,
                                  per_page: currentSelections.length,
                              },
                          )
                        : [];

                return {
                    items: searchItems || [],
                    selectedItemsData: selectedData || [],
                    isLoading: select("core/data").isResolving(
                        "core",
                        "getEntityRecords",
                        ["taxonomy", selectedTaxonomy, query],
                    ),
                };
            } else {
                // For post selection
                const query = {
                    per_page: 20,
                    status: "publish",
                    search: searchTerm,
                };

                // Get posts for search
                const searchItems = searchTerm
                    ? select("core").getEntityRecords(
                          "postType",
                          postType,
                          query,
                      )
                    : [];

                // Get data for currently selected posts
                const selectedData =
                    currentSelections.length > 0
                        ? select("core").getEntityRecords(
                              "postType",
                              postType,
                              {
                                  include: currentSelections,
                                  per_page: currentSelections.length,
                              },
                          )
                        : [];

                return {
                    items: searchItems || [],
                    selectedItemsData: selectedData || [],
                    isLoading: select("core/data").isResolving(
                        "core",
                        "getEntityRecords",
                        ["postType", postType, query],
                    ),
                };
            }
        },
        [
            searchTerm,
            postType,
            selectedTaxonomy,
            currentSelections,
            isSelectingTaxonomy,
        ],
    );

    // Create suggestions for FormTokenField
    const suggestions = useMemo(() => {
        if (!items) return [];

        return items.map((item) => ({
            id: item.id,
            value: isSelectingTaxonomy
                ? item.name || `Term #${item.id}`
                : item.title?.rendered || `Post #${item.id}`,
        }));
    }, [items, isSelectingTaxonomy]);

    // Create values for FormTokenField (selected items as readable names)
    const selectedValues = useMemo(() => {
        return selectedItemsData.map((item) =>
            isSelectingTaxonomy
                ? item.name || `Term #${item.id}`
                : item.title?.rendered || `Post #${item.id}`,
        );
    }, [selectedItemsData, isSelectingTaxonomy]);

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
        // Find IDs for the selected tokens
        const newSelections = [];

        tokens.forEach((token) => {
            // Check if it's an existing selection
            const existingItem = selectedItemsData.find((item) =>
                isSelectingTaxonomy
                    ? item.name === token
                    : item.title?.rendered === token,
            );

            if (existingItem) {
                newSelections.push(existingItem.id);
                return;
            }

            // Check if it's a new selection from search results
            const searchResult = items.find((item) =>
                isSelectingTaxonomy
                    ? item.name === token
                    : item.title?.rendered === token,
            );

            if (searchResult) {
                newSelections.push(searchResult.id);
            }
        });

        setAttributes({ [selectionAttribute]: newSelections });
    };

    // Handle search input
    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    // Handle selection mode change - preserve selected items
    const handleSelectionModeChange = (value) => {
        setAttributes({
            selectionMode: value,
            // Don't clear selections - preserve them when switching modes
        });
    };

    // Get appropriate labels
    const itemType = isSelectingTaxonomy ? "term" : "post";
    const itemTypePlural = isSelectingTaxonomy ? "terms" : "posts";
    const searchPlaceholder = isSelectingTaxonomy
        ? __("Type to search terms...", "built_starter")
        : __("Type to search posts...", "built_starter");
    const helpText = isSelectingTaxonomy
        ? __(
              "Start typing to search for taxonomy terms, then select them from the dropdown.",
              "built_starter",
          )
        : __(
              "Start typing to search for posts, then select them from the dropdown.",
              "built_starter",
          );

    // Check if taxonomy is required but not selected
    const showTaxonomyWarning = isSelectingTaxonomy && !selectedTaxonomy;

    return (
        <PanelBody title={__(label, "built_starter")} initialOpen={true}>
            <ToggleGroupControl
                label={__("Selection Mode", "built_starter")}
                value={selectionMode}
                onChange={handleSelectionModeChange}
                isBlock
            >
                <ToggleGroupControlOption
                    label={__("Auto", "built_starter")}
                    value="auto"
                />
                <ToggleGroupControlOption
                    label={__("Manual", "built_starter")}
                    value="manual"
                />
            </ToggleGroupControl>

            {selectionMode === "manual" && (
                <>
                    {showTaxonomyWarning ? (
                        <Notice status="warning" isDismissible={false}>
                            {__(
                                "Please select a taxonomy first to enable manual term selection.",
                                "built_starter",
                            )}
                        </Notice>
                    ) : (
                        <>
                            <FormTokenField
                                label={__(
                                    `Select ${itemTypePlural.charAt(0).toUpperCase() + itemTypePlural.slice(1)}`,
                                    "built_starter",
                                )}
                                value={selectedValues}
                                suggestions={suggestions.map((s) => s.value)}
                                onChange={handleTokenChange}
                                onInputChange={handleSearch}
                                placeholder={searchPlaceholder}
                                help={helpText}
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
                                    <span>
                                        {__(
                                            `Searching ${itemTypePlural}...`,
                                            "built_starter",
                                        )}
                                    </span>
                                </div>
                            )}

                            {currentSelections.length > 0 && (
                                <Notice status="info" isDismissible={false}>
                                    {__(
                                        `${currentSelections.length} ${currentSelections.length === 1 ? itemType : itemTypePlural} selected`,
                                        "built_starter",
                                    )}
                                </Notice>
                            )}

                            {currentSelections.length === 0 && (
                                <Notice status="warning" isDismissible={false}>
                                    {__(
                                        `No ${itemTypePlural} selected. Please select ${itemTypePlural} to display.`,
                                        "built_starter",
                                    )}
                                </Notice>
                            )}
                        </>
                    )}
                </>
            )}

            {selectionMode === "auto" && currentSelections.length > 0 && (
                <Notice status="info" isDismissible={false}>
                    {__(
                        `${itemTypePlural.charAt(0).toUpperCase() + itemTypePlural.slice(1)} will be queried automatically. ${currentSelections.length} manually selected ${currentSelections.length === 1 ? itemType : itemTypePlural} are saved and will be used when switching back to manual mode.`,
                        "built_starter",
                    )}
                </Notice>
            )}

            {selectionMode === "auto" && currentSelections.length === 0 && (
                <Notice status="info" isDismissible={false}>
                    {__(
                        `${itemTypePlural.charAt(0).toUpperCase() + itemTypePlural.slice(1)} will be queried automatically based on your settings below.`,
                        "built_starter",
                    )}
                </Notice>
            )}
        </PanelBody>
    );
}

export { QueryManualSelect };
