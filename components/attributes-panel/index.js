/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { 
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	ComboboxControl,
	Button 
} from '@wordpress/components';
import { useState, useEffect, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * AttributesPanel component that uses ToolsPanel and ComboboxControl
 * to manage block attributes with meta field selection.
 *
 * @since 1.0.0
 *
 * @param {Object} props Component properties.
 * @param {Array} props.attributes Array of attribute objects with id, label, and value.
 * @param {Function} props.onChange Callback when attributes change.
 * @param {string} props.panelId Unique ID for the tools panel.
 * @returns {WPElement} AttributesPanel element to render.
 */
function AttributesPanel({
	attributes = [],
	onChange,
	panelId = 'attributes-panel',
}) {
	const [localAttributes, setLocalAttributes] = useState(attributes);

	// Get available meta fields from the current post type
	const metaFields = useSelect((select) => {
		const { getEditedPostAttribute } = select('core/editor');
		const { getPostType } = select('core');
		
		// Try to get meta from editor first
		const meta = getEditedPostAttribute?.('meta') || {};
		
		// Get registered meta fields for the post type
		const postType = getEditedPostAttribute?.('type');
		const postTypeObject = postType ? getPostType(postType) : null;
		
		// Combine meta keys from various sources
		const metaKeys = new Set();
		
		// Add keys from current post meta
		Object.keys(meta).forEach(key => metaKeys.add(key));
		
		// Add common WordPress meta fields
		const commonMetaFields = [
			'_thumbnail_id',
			'_wp_page_template',
			'_wp_attachment_metadata',
			'_wp_attached_file',
			'_edit_lock',
			'_edit_last',
		];
		commonMetaFields.forEach(key => metaKeys.add(key));
		
		// Convert to array of options for ComboboxControl
		return Array.from(metaKeys).map(key => ({
			value: key,
			label: key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()),
		}));
	}, []);

	// Create options for ComboboxControl including meta fields and custom values
	const comboboxOptions = useMemo(() => {
		const options = [
			// Default HTML attributes
			{ value: 'id', label: __('ID', 'polaris') },
			{ value: 'class', label: __('Class', 'polaris') },
			{ value: 'style', label: __('Style', 'polaris') },
			{ value: 'title', label: __('Title', 'polaris') },
			{ value: 'alt', label: __('Alt Text', 'polaris') },
			{ value: 'rel', label: __('Rel', 'polaris') },
			{ value: 'target', label: __('Target', 'polaris') },
			{ value: 'href', label: __('Href', 'polaris') },
			{ value: 'src', label: __('Src', 'polaris') },
			// Data attributes
			{ value: 'data-id', label: __('Data ID', 'polaris') },
			{ value: 'data-type', label: __('Data Type', 'polaris') },
			{ value: 'data-value', label: __('Data Value', 'polaris') },
			// ARIA attributes
			{ value: 'aria-label', label: __('ARIA Label', 'polaris') },
			{ value: 'aria-describedby', label: __('ARIA Described By', 'polaris') },
			{ value: 'aria-hidden', label: __('ARIA Hidden', 'polaris') },
			// Meta fields
			...metaFields.map(field => ({
				...field,
				label: `Meta: ${field.label}`,
			})),
		];
		
		// Add any existing custom attributes that aren't in the default list
		localAttributes.forEach(attr => {
			if (!options.find(opt => opt.value === attr.id)) {
				options.push({
					value: attr.id,
					label: attr.label || attr.id,
				});
			}
		});
		
		return options;
	}, [metaFields, localAttributes]);

	// Update local state when props change
	useEffect(() => {
		setLocalAttributes(attributes);
	}, [attributes]);

	const handleAttributeChange = (id, value) => {
		const updatedAttributes = localAttributes.map((attr) =>
			attr.id === id ? { ...attr, value } : attr
		);
		setLocalAttributes(updatedAttributes);
		onChange?.(updatedAttributes);
	};

	const handleAttributeSelect = (id, selectedValue) => {
		if (!selectedValue) return;
		
		// Check if attribute already exists
		const existingAttr = localAttributes.find(attr => attr.id === id);
		if (existingAttr) {
			// Update existing attribute
			handleAttributeChange(id, selectedValue);
		} else {
			// Find the label for this value
			const option = comboboxOptions.find(opt => opt.value === selectedValue);
			const label = option?.label || selectedValue;
			
			// Update the attribute
			const updatedAttributes = localAttributes.map(attr => 
				attr.id === id ? { ...attr, id: selectedValue, label } : attr
			);
			setLocalAttributes(updatedAttributes);
			onChange?.(updatedAttributes);
		}
	};

	const addNewAttribute = () => {
		const newAttribute = {
			id: `attr-${Date.now()}`,
			label: '',
			value: '',
			isNew: true,
		};
		const updatedAttributes = [...localAttributes, newAttribute];
		setLocalAttributes(updatedAttributes);
		onChange?.(updatedAttributes);
	};

	const removeAttribute = (id) => {
		const updatedAttributes = localAttributes.filter(attr => attr.id !== id);
		setLocalAttributes(updatedAttributes);
		onChange?.(updatedAttributes);
	};

	const resetAll = () => {
		const resetAttributes = localAttributes.map(attr => ({ ...attr, value: '' }));
		setLocalAttributes(resetAttributes);
		onChange?.(resetAttributes);
	};

	const resetAttribute = (id) => {
		handleAttributeChange(id, '');
	};

	// Check if any attributes have values
	const hasValues = localAttributes.some(attr => attr.value);

	return (
		<ToolsPanel
			label={__('Attributes', 'polaris')}
			panelId={panelId}
			hasInnerWrapper={true}
			className="attributes-tools-panel"
			resetAll={resetAll}
			dropdownMenuProps={{
				popoverProps: {
					placement: 'left-start',
					offset: 10,
				},
			}}
		>
			{localAttributes.map((attribute) => (
				<ToolsPanelItem
					key={attribute.id}
					hasValue={() => !!attribute.value}
					label={attribute.label || __('Select attribute', 'polaris')}
					onDeselect={() => removeAttribute(attribute.id)}
					resetAllFilter={() => resetAttribute(attribute.id)}
					panelId={panelId}
				>
					<div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
						<div style={{ flex: 1 }}>
							<ComboboxControl
								label={attribute.isNew ? __('Attribute', 'polaris') : attribute.label}
								value={attribute.isNew ? '' : attribute.id}
								onChange={(value) => handleAttributeSelect(attribute.id, value)}
								options={comboboxOptions}
								allowReset={false}
								placeholder={__('Select or type attribute', 'polaris')}
							/>
							{!attribute.isNew && (
								<ComboboxControl
									label={__('Value', 'polaris')}
									value={attribute.value || ''}
									onChange={(value) => handleAttributeChange(attribute.id, value)}
									options={[]}
									allowReset={false}
									placeholder={__('Enter value', 'polaris')}
									help={attribute.id.startsWith('meta:') ? __('This will pull from post meta', 'polaris') : null}
								/>
							)}
						</div>
					</div>
				</ToolsPanelItem>
			))}
			
			<div style={{ padding: '16px 16px 8px' }}>
				<Button
					variant="secondary"
					size="small"
					onClick={addNewAttribute}
					style={{ width: '100%' }}
				>
					{__('Add attribute', 'polaris')}
				</Button>
			</div>
		</ToolsPanel>
	);
}

/**
 * Hook to manage attributes state
 * 
 * @param {Array} initialAttributes Initial attributes configuration
 * @returns {Object} Attributes state and handlers
 */
export function useAttributes(initialAttributes = []) {
	const [attributes, setAttributes] = useState(initialAttributes);

	const updateAttribute = (id, value) => {
		setAttributes((prev) =>
			prev.map((attr) => (attr.id === id ? { ...attr, value } : attr))
		);
	};

	const addAttribute = (label, value = '') => {
		const newAttribute = {
			id: `custom-${Date.now()}`,
			label,
			value,
			isCustom: true,
		};
		setAttributes((prev) => [...prev, newAttribute]);
		return newAttribute;
	};

	const removeAttribute = (id) => {
		setAttributes((prev) => prev.filter((attr) => attr.id !== id));
	};

	const resetAttributes = () => {
		setAttributes((prev) => prev.map((attr) => ({ ...attr, value: '' })));
	};

	const getAttributeValue = (id) => {
		return attributes.find((attr) => attr.id === id)?.value || '';
	};

	return {
		attributes,
		setAttributes,
		updateAttribute,
		addAttribute,
		removeAttribute,
		resetAttributes,
		getAttributeValue,
	};
}

export default AttributesPanel;