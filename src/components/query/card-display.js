import { PanelBody, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

function QueryCardDisplay({ attributes, setAttributes, cardDisplayOptions }) {
	const { showImage, showTitle, showExcerpt, showTaxonomy, showButton } =
		attributes;

	return (
		<PanelBody title={__("Card Content", "built_starter")}>
			<p>
				{__(
					"Toggle the content to display in the card.",
					"built_starter",
				)}
			</p>
			{cardDisplayOptions.image && (
				<ToggleControl
					label="Image"
					checked={showImage}
					onChange={(value) => setAttributes({ showImage: value })}
				/>
			)}
			{cardDisplayOptions.title && (
				<ToggleControl
					label="Title"
					checked={showTitle}
					onChange={(value) => setAttributes({ showTitle: value })}
				/>
			)}
			{cardDisplayOptions.excerpt && (
				<ToggleControl
					label="Excerpt"
					checked={showExcerpt}
					onChange={(value) => setAttributes({ showExcerpt: value })}
				/>
			)}
			{cardDisplayOptions.taxonomy && (
				<ToggleControl
					label="Taxonomy"
					checked={showTaxonomy}
					onChange={(value) => setAttributes({ showTaxonomy: value })}
				/>
			)}
			{cardDisplayOptions.button && (
				<ToggleControl
					label="Button"
					checked={showButton}
					onChange={(value) => setAttributes({ showButton: value })}
				/>
			)}
		</PanelBody>
	);
}

export { QueryCardDisplay };
