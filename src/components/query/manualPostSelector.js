import {
    FormTokenField,
    Spinner,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useEffect, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Standalone manual post selection control
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @param {string} props.postType The post type to select from
 * @param {boolean} props.isShownByDefault Whether to show by default in ToolsPanel (default: true)
 * @returns {WPElement} Element to render
 */
function ManualPostSelector({
    attributes: { selectedPosts = [] },
    setAttributes,
    postType = "post",
    isShownByDefault = true,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const defaultSelectedPosts = [];

    // Memoize the search query to prevent recreation
    const searchQuery = useMemo(
        () => ({
            per_page: 20,
            status: "publish",
            search: searchTerm,
        }),
        [searchTerm],
    );

    // Memoize the selected posts query to prevent recreation
    const selectedPostsQuery = useMemo(
        () => ({
            include: selectedPosts,
            per_page: selectedPosts.length,
        }),
        [selectedPosts],
    );

    // Get posts for search functionality
    const searchPosts = useSelect(
        (select) => {
            if (!searchTerm) {
                return null;
            }
            return select("core").getEntityRecords(
                "postType",
                postType,
                searchQuery,
            );
        },
        [searchTerm, postType, searchQuery],
    );

    // Get data for currently selected posts
    const selectedPostsData = useSelect(
        (select) => {
            if (selectedPosts.length === 0) {
                return null;
            }
            return select("core").getEntityRecords(
                "postType",
                postType,
                selectedPostsQuery,
            );
        },
        [selectedPosts, postType, selectedPostsQuery],
    );

    // Get loading state
    const isLoading = useSelect(
        (select) => {
            if (!searchTerm) {
                return false;
            }
            return select("core/data").isResolving("core", "getEntityRecords", [
                "postType",
                postType,
                searchQuery,
            ]);
        },
        [searchTerm, postType, searchQuery],
    );

    // Memoize posts with fallback to prevent new array creation
    const posts = useMemo(() => {
        return searchPosts || [];
    }, [searchPosts]);

    // Memoize selected posts data with fallback to prevent new array creation
    const memoizedSelectedPostsData = useMemo(() => {
        return selectedPostsData || [];
    }, [selectedPostsData]);

    // Create suggestions for FormTokenField
    const suggestions = useMemo(() => {
        if (!posts || posts.length === 0) return [];
        return posts.map((post) => ({
            id: post.id,
            value: post.title?.rendered || `Post #${post.id}`,
        }));
    }, [posts]);

    // Create values for FormTokenField (selected items as readable names)
    const selectedValues = useMemo(() => {
        return memoizedSelectedPostsData.map(
            (post) => post.title?.rendered || `Post #${post.id}`,
        );
    }, [memoizedSelectedPostsData]);

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
            const existingPost = memoizedSelectedPostsData.find(
                (post) =>
                    (post.title?.rendered || `Post #${post.id}`) === token,
            );

            if (existingPost) {
                newSelections.push(existingPost.id);
                return;
            }

            // Check if it's a new selection from search results
            const searchResult = posts.find(
                (post) =>
                    (post.title?.rendered || `Post #${post.id}`) === token,
            );

            if (searchResult) {
                newSelections.push(searchResult.id);
            }
        });

        setAttributes({ selectedPosts: newSelections });
    };

    // Create unique suggestions by appending post ID to duplicates
    const uniqueSuggestions = useMemo(() => {
        const titleCounts = {};
        const uniqueSuggestionsList = [];

        suggestions.forEach((suggestion) => {
            const title = suggestion.value;
            titleCounts[title] = (titleCounts[title] || 0) + 1;
        });

        suggestions.forEach((suggestion) => {
            const title = suggestion.value;
            // If there are duplicates, append the post ID to make it unique
            const displayValue =
                titleCounts[title] > 1
                    ? `${title} (ID: ${suggestion.id})`
                    : title;

            uniqueSuggestionsList.push(displayValue);
        });

        return uniqueSuggestionsList;
    }, [suggestions]);

    return (
        <ToolsPanelItem
            hasValue={() => selectedPosts && selectedPosts.length > 0}
            label={__("Select Posts", "built_starter")}
            onDeselect={() =>
                setAttributes({ selectedPosts: defaultSelectedPosts })
            }
            isShownByDefault={isShownByDefault}
        >
            <FormTokenField
                __next40pxDefaultSize={true}
                __nextHasNoMarginBottom
                label={__("Select Posts", "built_starter")}
                value={selectedValues}
                suggestions={uniqueSuggestions}
                onChange={handleTokenChange}
                onInputChange={setSearchTerm}
                placeholder={__("Type to search posts...", "built_starter")}
                help={__(
                    "Start typing to search for posts, then select them from the dropdown.",
                    "built_starter",
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
                    <span>{__("Searching posts...", "built_starter")}</span>
                </div>
            )}
        </ToolsPanelItem>
    );
}

export { ManualPostSelector };
