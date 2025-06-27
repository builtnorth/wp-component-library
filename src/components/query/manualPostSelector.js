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
 * @returns {WPElement} Element to render
 */
function ManualPostSelector({
    attributes: { selectedPosts = [] },
    setAttributes,
    postType = "post",
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const defaultSelectedPosts = [];

    // Fetch posts for search functionality
    const { posts, selectedPostsData, isLoading } = useSelect(
        (select) => {
            const query = {
                per_page: 20,
                status: "publish",
                search: searchTerm,
            };

            // Get posts for search
            const searchPosts = searchTerm
                ? select("core").getEntityRecords("postType", postType, query)
                : [];

            // Get data for currently selected posts
            const selectedData =
                selectedPosts.length > 0
                    ? select("core").getEntityRecords("postType", postType, {
                          include: selectedPosts,
                          per_page: selectedPosts.length,
                      })
                    : [];

            return {
                posts: searchPosts || [],
                selectedPostsData: selectedData || [],
                isLoading: select("core/data").isResolving(
                    "core",
                    "getEntityRecords",
                    ["postType", postType, query],
                ),
            };
        },
        [searchTerm, postType, selectedPosts],
    );

    // Create suggestions for FormTokenField
    const suggestions = useMemo(() => {
        if (!posts) return [];
        return posts.map((post) => ({
            id: post.id,
            value: post.title?.rendered || `Post #${post.id}`,
        }));
    }, [posts]);

    // Create values for FormTokenField (selected items as readable names)
    const selectedValues = useMemo(() => {
        return selectedPostsData.map(
            (post) => post.title?.rendered || `Post #${post.id}`,
        );
    }, [selectedPostsData]);

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
            const existingPost = selectedPostsData.find(
                (post) => post.title?.rendered === token,
            );

            if (existingPost) {
                newSelections.push(existingPost.id);
                return;
            }

            // Check if it's a new selection from search results
            const searchResult = posts.find(
                (post) => post.title?.rendered === token,
            );

            if (searchResult) {
                newSelections.push(searchResult.id);
            }
        });

        setAttributes({ selectedPosts: newSelections });
    };

    return (
        <ToolsPanelItem
            hasValue={() => selectedPosts && selectedPosts.length > 0}
            label={__("Select Posts", "built_starter")}
            onDeselect={() =>
                setAttributes({ selectedPosts: defaultSelectedPosts })
            }
            isShownByDefault={true}
        >
            <FormTokenField
                label={__("Select Posts", "built_starter")}
                value={selectedValues}
                suggestions={suggestions.map((s) => s.value)}
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
