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
 * @param {boolean} props.isShownByDefault Whether to show by default in ToolsPanel (default: true)
 * @returns {WPElement} Element to render
 */
function PostTypeSelect({
    attributes: { postType },
    setAttributes,
    isShownByDefault = true,
}) {
    const defaultPostType = "post";

    const getPostTypeList = useSelect((select) =>
        select("core").getPostTypes({ per_page: 20 }),
    );

    const getPostTypesOptions = () => {
        let filteredPostTypes = [];
        let postTypesOptions = [];

        if (getPostTypeList) {
            filteredPostTypes = getPostTypeList.filter(
                (type) =>
                    type.viewable === true &&
                    type.rest_base !== "media" &&
                    type.rest_base !== "pages",
            );
            postTypesOptions = filteredPostTypes.map((type) => ({
                label: type.name,
                value: type.slug,
            }));
        }

        return postTypesOptions;
    };

    return (
        <ToolsPanelItem
            hasValue={() => postType !== defaultPostType}
            label={__("Select Post Type", "built_starter")}
            onDeselect={() => setAttributes({ postType: defaultPostType })}
            isShownByDefault={isShownByDefault}
        >
            <SelectControl
                __nextHasNoMarginBottom={true}
                __next40pxDefaultSize
                label={__("Select Post Type", "built_starter")}
                onChange={(value) => setAttributes({ postType: value })}
                options={getPostTypesOptions()}
                value={postType}
            />
        </ToolsPanelItem>
    );
}

export { PostTypeSelect };
