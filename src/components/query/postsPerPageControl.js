import {
    RangeControl,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";

/**
 * Standalone posts per page control
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @param {string} props.label Label for the control
 * @param {number} props.min Minimum value
 * @param {number} props.max Maximum value
 * @returns {WPElement} Element to render
 */
function PostsPerPageControl({
    attributes: { postsPerPage },
    setAttributes,
    label = "Amount to Display",
    min = 1,
    max = 50,
}) {
    const defaultPostsPerPage = 6;

    return (
        <ToolsPanelItem
            hasValue={() => postsPerPage !== defaultPostsPerPage}
            label={label}
            onDeselect={() =>
                setAttributes({ postsPerPage: defaultPostsPerPage })
            }
            isShownByDefault={false}
        >
            <RangeControl
                label={label}
                value={postsPerPage}
                onChange={(postsPerPageNew) =>
                    setAttributes({ postsPerPage: postsPerPageNew })
                }
                min={min}
                max={max}
            />
        </ToolsPanelItem>
    );
}

export { PostsPerPageControl };
