import { PanelBody, SelectControl } from "@wordpress/components";
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
        renderPanel = true, // Whether to render the PanelBody wrapper
    } = props;

    // Render the content
    const renderContent = () => (
        <>
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
        </>
    );

    // Return with or without PanelBody wrapper
    if (renderPanel) {
        return (
            <PanelBody
                title={__("Feed Order", "built_starter")}
                initialOpen={true}
            >
                {renderContent()}
            </PanelBody>
        );
    }

    return renderContent();
}

export { QueryOrder };
