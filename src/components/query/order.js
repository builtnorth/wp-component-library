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
	} = props;

	return (
		<PanelBody title={__("Order", "built_starter")} initialOpen={true}>
			<SelectControl
				label="Order By"
				value={orderPostsBy}
				options={[
					{ label: "Custom Order", value: "menu_order" },
					{ label: "Date", value: "date" },
					{ label: "Title", value: "title" },
				]}
				onChange={(value) => setAttributes({ orderPostsBy: value })}
				__nextHasNoMarginBottom
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
				__nextHasNoMarginBottom
			/>
		</PanelBody>
	);
}

export { QueryOrder };
