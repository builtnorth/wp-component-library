import { PanelBody, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Render the settings block used to select the post types.
 *
 * @since 0.1.0
 *
 * @returns {WPElement} Element to render.
 */
function QueryCardDisplay(props) {
	const {
		attributes: {
			showImage,
			showTitle,
			showExcerpt,
			showTaxonomy,
			showButton,
		},
		setAttributes,
	} = props;

	return (
		<PanelBody title={__("Card Content", "built_starter")}>
			<p>
				{__(
					"Toggle the content to display in the card.",
					"built_starter",
				)}
			</p>
			<ToggleControl
				label="Image"
				checked={showImage}
				onChange={(showImageNew) =>
					setAttributes({ showImage: showImageNew })
				}
			/>
			<ToggleControl
				label="Title"
				checked={showTitle}
				onChange={(showTitleNew) =>
					setAttributes({ showTitle: showTitleNew })
				}
			/>
			<ToggleControl
				label="Excerpt"
				checked={showExcerpt}
				onChange={(showExcerptNew) =>
					setAttributes({ showExcerpt: showExcerptNew })
				}
			/>
			<ToggleControl
				label="Taxonomy"
				checked={showTaxonomy}
				onChange={(showTaxonomyNew) =>
					setAttributes({ showTaxonomy: showTaxonomyNew })
				}
			/>
			<ToggleControl
				label="Button"
				checked={showButton}
				onChange={(showButtonNew) =>
					setAttributes({ showButton: showButtonNew })
				}
			/>
		</PanelBody>
	);
}

export { QueryCardDisplay };
