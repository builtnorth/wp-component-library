import {
    SelectControl,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

/**
 * Standalone post type selection control
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @returns {WPElement} Element to render
 */
function PostTypeSelect({ attributes: { postType }, setAttributes }) {
    const defaultPostType = "post";

    const getPostTypesOptions = () => {
        const getPostTypeList = useSelect((select) =>
            select("core").getPostTypes({ per_page: 20 }),
        );
        let filteredPostTypes = [];
        let postTypesOptions = [];

        if (getPostTypeList) {
            filteredPostTypes = getPostTypeList.filter(
                (postType) =>
                    postType.viewable == true &&
                    postType.rest_base !== "media" &&
                    postType.rest_base !== "pages",
            );
            postTypesOptions = filteredPostTypes.map((postType) => ({
                label: postType.name,
                value: postType.slug,
            }));
        }

        return postTypesOptions;
    };

    return (
        <ToolsPanelItem
            hasValue={() => postType !== defaultPostType}
            label={__("Select Post Type", "built_starter")}
            onDeselect={() => setAttributes({ postType: defaultPostType })}
            isShownByDefault={true}
        >
            <SelectControl
                label={__("Select Post Type", "built_starter")}
                onChange={(value) => setAttributes({ postType: value })}
                options={getPostTypesOptions()}
                value={postType}
            />
        </ToolsPanelItem>
    );
}

export { PostTypeSelect };
