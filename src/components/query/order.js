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
                value={orderPostsBy}
                options={[
                    { label: "Custom Order", value: "menu_order" },
                    { label: "Date", value: "date" },
                    { label: "Title", value: "title" },
                    ...additionalOrderOptions,
                ]}
                onChange={(value) => setAttributes({ orderPostsBy: value })}
            />

            <SelectControl
                label="Order Direction"
                value={orderPostsDirection}
                options={[
                    { label: "Ascending", value: "asc" },
                    { label: "Descending", value: "desc" },
                ]}
                onChange={(value) =>
                    setAttributes({ orderPostsDirection: value })
                }
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
