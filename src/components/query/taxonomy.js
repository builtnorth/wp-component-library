import {
	FormTokenField,
	PanelBody,
	SelectControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

function QueryTaxonomy(props) {
	const {
		attributes: { selectedTaxonomy, selectedTerms },
		setAttributes,
		postType,
	} = props;

	const taxonomies = useSelect((select) =>
		select("core").getTaxonomies({ per_page: -1 }),
	);

	const filteredTaxonomies = taxonomies
		? taxonomies.filter((tax) => tax.types.includes(postType))
		: [];

	const taxonomyOptions = filteredTaxonomies.map((tax) => ({
		label: tax.labels.singular_name || tax.name,
		value: tax.slug,
	}));

	const terms = useSelect((select) =>
		selectedTaxonomy
			? select("core").getEntityRecords("taxonomy", selectedTaxonomy, {
					per_page: -1,
				})
			: [],
	);

	const termOptions = terms
		? terms.map((term) => ({
				label: term.name,
				value: term.id.toString(), // Convert id to string
			}))
		: [];

	return (
		<PanelBody title={__("Taxonomy Filter", "built")} initialOpen={false}>
			<SelectControl
				label={__("Select Taxonomy", "built")}
				value={selectedTaxonomy}
				options={[
					{ label: __("None", "built"), value: "" },
					...taxonomyOptions,
				]}
				onChange={(value) =>
					setAttributes({
						selectedTaxonomy: value,
						selectedTerms: [],
					})
				}
			/>
			{selectedTaxonomy && (
				<FormTokenField
					label={__("Select Terms", "built")}
					value={selectedTerms.map((termId) => {
						const term = termOptions.find(
							(t) => t.value === termId.toString(),
						);
						return term ? term.label : "";
					})}
					suggestions={termOptions.map((option) => option.label)}
					onChange={(termNames) => {
						const newSelectedTerms = termNames
							.map((name) => {
								const term = termOptions.find(
									(t) => t.label === name,
								);
								return term ? term.value : null;
							})
							.filter((id) => id !== null);
						setAttributes({ selectedTerms: newSelectedTerms });
					}}
				/>
			)}
		</PanelBody>
	);
}

export { QueryTaxonomy };
