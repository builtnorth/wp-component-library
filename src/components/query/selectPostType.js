import { PanelBody, SelectControl } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

/**
 * Render the settings block used to select the post types.
 *
 * @since 0.1.0
 *
 * @returns {WPElement} Element to render.
 */
function QuerySelectPostType(props) {
	const {
		attributes: { selectedPostType },
		setAttributes,
	} = props;

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
				//postType.rest_base == 'posts' ||
				//postType.rest_base == 'built_promotion'
			);
			postTypesOptions = filteredPostTypes.map((postType) => ({
				label: postType.name,
				value: postType.slug,
			}));
		}

		return postTypesOptions;
	};

	return (
		<PanelBody>
			<SelectControl
				label={__("Select Post Type", "built_starter")}
				onChange={(value) => setAttributes({ selectedPostType: value })}
				options={getPostTypesOptions()}
				value={selectedPostType}
			/>
		</PanelBody>
	);
}

export { QuerySelectPostType };
