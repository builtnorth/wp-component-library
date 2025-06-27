import {
    SelectControl,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Render the settings block used to select the post types.
 *
 * @since 0.1.0
 *
 * @returns {WPElement} Element to render.
 */
function QueryOrder(props) {
    const {
        attributes: { orderPostsBy, orderPostsDirection },
        setAttributes,
        additionalOrderOptions = [],
        renderPanel = true, // Whether to render the ToolsPanel wrapper
    } = props;

    // Default values for reset functionality
    const defaultOrderPostsBy = "date";
    const defaultOrderPostsDirection = "desc";

    // Reset function for ToolsPanel
    const resetAll = () => {
        setAttributes({
            orderPostsBy: defaultOrderPostsBy,
            orderPostsDirection: defaultOrderPostsDirection,
        });
    };

    // Render the content
    const renderContent = () => (
        <ToolsPanel
            label={__("Feed Order", "built_starter")}
            resetAll={resetAll}
        >
            <ToolsPanelItem
                hasValue={() =>
                    orderPostsBy !== defaultOrderPostsBy ||
                    orderPostsDirection !== defaultOrderPostsDirection
                }
                label={__("Order By", "built_starter")}
                onDeselect={() =>
                    setAttributes({
                        orderPostsBy: defaultOrderPostsBy,
                        orderPostsDirection: defaultOrderPostsDirection,
                    })
                }
                isShownByDefault={true}
            >
                <SelectControl
                    label="Order By"
                    value={`${orderPostsBy}_${orderPostsDirection}`}
                    options={[
                        { label: "Custom Order", value: "menu_order_asc" },
                        { label: "Date (Newest → Oldest)", value: "date_desc" },
                        { label: "Date (Oldest → Newest)", value: "date_asc" },
                        { label: "Title (A → Z)", value: "title_asc" },
                        { label: "Title (Z → A)", value: "title_desc" },
                        { label: "Random", value: "rand_asc" },
                        ...additionalOrderOptions,
                    ]}
                    onChange={(value) => {
                        const [orderby, order] = value.split("_");
                        setAttributes({
                            orderPostsBy: orderby,
                            orderPostsDirection: order,
                        });
                    }}
                />
            </ToolsPanelItem>
        </ToolsPanel>
    );

    // If not rendering panel, just return the ToolsPanelItem
    const renderContentWithoutPanel = () => (
        <ToolsPanelItem
            hasValue={() =>
                orderPostsBy !== defaultOrderPostsBy ||
                orderPostsDirection !== defaultOrderPostsDirection
            }
            label={__("Order By", "built_starter")}
            onDeselect={() =>
                setAttributes({
                    orderPostsBy: defaultOrderPostsBy,
                    orderPostsDirection: defaultOrderPostsDirection,
                })
            }
            isShownByDefault={true}
        >
            <SelectControl
                label="Order By"
                value={`${orderPostsBy}_${orderPostsDirection}`}
                options={[
                    { label: "Custom Order", value: "menu_order_asc" },
                    { label: "Date (Newest → Oldest)", value: "date_desc" },
                    { label: "Date (Oldest → Newest)", value: "date_asc" },
                    { label: "Title (A → Z)", value: "title_asc" },
                    { label: "Title (Z → A)", value: "title_desc" },
                    { label: "Random", value: "rand_asc" },
                    ...additionalOrderOptions,
                ]}
                onChange={(value) => {
                    const [orderby, order] = value.split("_");
                    setAttributes({
                        orderPostsBy: orderby,
                        orderPostsDirection: order,
                    });
                }}
            />
        </ToolsPanelItem>
    );

    // Return with or without ToolsPanel wrapper
    if (renderPanel) {
        return renderContent();
    }

    return renderContentWithoutPanel();
}

export { QueryOrder };
