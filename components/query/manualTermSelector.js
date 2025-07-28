import { __experimentalToolsPanelItem as ToolsPanelItem } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import SortableSelect from "../sortable-select";

/**
 * Standalone term selection control
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @param {string} props.selectedTaxonomy The taxonomy to select terms from
 * @param {boolean} props.renderAsToolsPanelItem Whether to render as ToolsPanelItem
 * @param {boolean} props.isShownByDefault Whether to show by default in ToolsPanel (default: true)
 * @returns {WPElement} Element to render
 */
function ManualTermSelector({
	attributes: { selectedTerms = [] },
	setAttributes,
	selectedTaxonomy,
	renderAsToolsPanelItem = true,
	isShownByDefault = true,
}) {
	const defaultSelectedTerms = [];

	// Fetch selected terms data
	const selectedTermsData = useSelect(
		(select) => {
			if (!selectedTaxonomy || selectedTerms.length === 0) {
				return [];
			}

			return (
				select("core").getEntityRecords("taxonomy", selectedTaxonomy, {
					include: selectedTerms,
					per_page: selectedTerms.length,
				}) || []
			);
		},
		[selectedTaxonomy, selectedTerms],
	);

	// Load terms with search
	const loadTerms = useCallback(
		async (inputValue) => {
			if (!selectedTaxonomy) {
				return [];
			}

			try {
				const query = {
					per_page: 20,
					hide_empty: false,
					search: inputValue || '',
				};

				// Use resolveSelect for async data fetching
				const terms = await wp.data.resolveSelect("core").getEntityRecords(
					"taxonomy",
					selectedTaxonomy,
					query,
				);

				return terms || [];
			} catch (error) {
				console.error('Error loading terms:', error);
				return [];
			}
		},
		[selectedTaxonomy],
	);

	// Handle selection change
	const handleChange = useCallback(
		(newSelection) => {
			const termIds = newSelection.map((term) => term.id);
			setAttributes({ selectedTerms: termIds });
		},
		[setAttributes],
	);

	// Format selected value for SortableSelect - maintain order
	const selectedValue = useMemo(() => {
		return selectedTerms
			.map((termId) =>
				selectedTermsData.find((term) => term.id === termId),
			)
			.filter(Boolean);
	}, [selectedTermsData, selectedTerms]);

	const control = (
		<SortableSelect
			value={selectedValue}
			onChange={handleChange}
			loadOptions={loadTerms}
			getOptionLabel={(term) => term.name || `Term #${term.id}`}
			getOptionValue={(term) => term.id}
			placeholder={__("Type to search terms...", "built")}
			label={__("Select Terms", "built")}
			help={__(
				"Start typing to search for taxonomy terms, then select them from the dropdown. Drag to reorder.",
				"built",
			)}
			isMulti={true}
			isClearable={false}
			isSearchable={true}
			hideDropdownIndicator={true}
			renderSelectedItem={(term) => (
				<span>
					{term.name}
					{term.count !== undefined && (
						<span style={{ color: "#666", marginLeft: "4px" }}>
							({term.count})
						</span>
					)}
				</span>
			)}
		/>
	);

	if (!renderAsToolsPanelItem) {
		return control;
	}

	return (
		<ToolsPanelItem
			hasValue={() => selectedTerms && selectedTerms.length > 0}
			label={__("Select Terms", "built")}
			onDeselect={() =>
				setAttributes({ selectedTerms: defaultSelectedTerms })
			}
			isShownByDefault={isShownByDefault}
		>
			{control}
		</ToolsPanelItem>
	);
}

export { ManualTermSelector };
