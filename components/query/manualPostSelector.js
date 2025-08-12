import { __experimentalToolsPanelItem as ToolsPanelItem } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import SortableSelect from "../sortable-select";

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
    const defaultSelectedPosts = [];

    // Fetch selected posts data
    const selectedPostsData = useSelect(
        (select) => {
            if (!postType || selectedPosts.length === 0) {
                return [];
            }

            return (
                select("core").getEntityRecords("postType", postType, {
                    include: selectedPosts,
                    per_page: selectedPosts.length,
                }) || []
            );
        },
        [postType, selectedPosts],
    );

    // Load posts with search
    const loadPosts = useCallback(
        async (inputValue) => {
            if (!postType) {
                return [];
            }

            try {
                const query = {
                    per_page: 20,
                    status: "publish",
                    search: inputValue || '',
                };

                // Use resolveSelect for async data fetching
                const posts = await wp.data.resolveSelect("core").getEntityRecords(
                    "postType",
                    postType,
                    query,
                );

                return posts || [];
            } catch (error) {
                console.error('Error loading posts:', error);
                return [];
            }
        },
        [postType],
    );

    // Handle selection change
    const handleChange = useCallback(
        (newSelection) => {
            const postIds = newSelection.map((post) => post.id);
            setAttributes({ selectedPosts: postIds });
        },
        [setAttributes],
    );

    // Format selected value for SortableSelect - maintain order
    const selectedValue = useMemo(() => {
        return selectedPosts
            .map((postId) =>
                selectedPostsData.find((post) => post.id === postId),
            )
            .filter(Boolean);
    }, [selectedPostsData, selectedPosts]);

    const control = (
        <SortableSelect
            value={selectedValue}
            onChange={handleChange}
            loadOptions={loadPosts}
            getOptionLabel={(post) => post.title?.rendered || `Post #${post.id}`}
            getOptionValue={(post) => post.id}
            placeholder={__("Type to search posts...", "built")}
            label={__("Select Posts", "built")}
            help={__(
                "Start typing to search for posts, then select them from the dropdown. Drag to reorder.",
                "built",
            )}
            isMulti={true}
            isClearable={false}
            isSearchable={true}
            hideDropdownIndicator={true}
        />
    );

    return (
        <ToolsPanelItem
            hasValue={() => selectedPosts && selectedPosts.length > 0}
            label={__("Select Posts", "built")}
            onDeselect={() =>
                setAttributes({ selectedPosts: defaultSelectedPosts })
            }
            isShownByDefault={isShownByDefault}
        >
            {control}
        </ToolsPanelItem>
    );
}

export { ManualPostSelector };
