import {
    SelectControl,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Default order options - can be imported and used as a base
 */
export const defaultOrderOptions = [
    { label: "Custom Order", value: "menu_order_asc" },
    { label: "Date (Newest → Oldest)", value: "date_desc" },
    { label: "Date (Oldest → Newest)", value: "date_asc" },
    { label: "Title (A → Z)", value: "title_asc" },
    { label: "Title (Z → A)", value: "title_desc" },
    { label: "Random", value: "rand_asc" },
];

/**
 * Standalone order by selection control
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @param {Array} props.orderOptions Custom order options (replaces defaults if provided)
 * @param {Array} props.additionalOrderOptions Additional options to add to defaults (deprecated, use orderOptions instead)
 * @returns {WPElement} Element to render
 */
function OrderBySelect({
    attributes: { orderPostsBy, orderPostsDirection },
    setAttributes,
    orderOptions,
    additionalOrderOptions = [], // Keep for backward compatibility
}) {
    const defaultOrderPostsBy = "date";
    const defaultOrderPostsDirection = "desc";

    // Determine which options to use
    let finalOptions;
    if (orderOptions) {
        // Use custom options if provided
        finalOptions = orderOptions;
    } else if (additionalOrderOptions.length > 0) {
        // Use defaults + additional for backward compatibility
        finalOptions = [...defaultOrderOptions, ...additionalOrderOptions];
    } else {
        // Use defaults
        finalOptions = defaultOrderOptions;
    }

    return (
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
                options={finalOptions}
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
}

export { OrderBySelect };
