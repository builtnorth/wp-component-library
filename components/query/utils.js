/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

/**
 * Utility functions for query components
 */

/**
 * Reorder an array of items based on a given order of IDs
 * 
 * @param {Array} items - Array of objects to reorder
 * @param {Array} orderedIds - Array of IDs in the desired order
 * @param {Function} getItemId - Function to extract ID from an item (default: item => item.id)
 * @returns {Array} Reordered array
 */
export function reorderByIds(items, orderedIds, getItemId = (item) => item.id) {
	if (!items || !orderedIds || orderedIds.length === 0) {
		return items || [];
	}

	// Create a map for quick lookup
	const itemMap = new Map();
	items.forEach((item) => {
		itemMap.set(getItemId(item), item);
	});

	// Build the ordered array
	const ordered = [];
	orderedIds.forEach((id) => {
		const item = itemMap.get(id);
		if (item) {
			ordered.push(item);
		}
	});

	return ordered;
}

/**
 * Hook to fetch and reorder terms based on selectedTerms order
 * 
 * Example usage:
 * ```js
 * const orderedTerms = useOrderedTerms(selectedTerms, taxonomy);
 * ```
 */
export function useOrderedTerms(selectedTerms, taxonomy) {
	const { terms } = useSelect(
		(select) => {
			if (!taxonomy || !selectedTerms || selectedTerms.length === 0) {
				return { terms: [] };
			}

			const fetchedTerms = select('core').getEntityRecords('taxonomy', taxonomy, {
				include: selectedTerms,
				per_page: selectedTerms.length,
			});

			return { terms: fetchedTerms || [] };
		},
		[selectedTerms, taxonomy]
	);

	// Reorder terms to match selectedTerms order
	return useMemo(() => {
		return reorderByIds(terms, selectedTerms);
	}, [terms, selectedTerms]);
}