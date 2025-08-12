import { useSelect } from "@wordpress/data";
import { useMemo, useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

/**
 * useMetaFields Hook
 *
 * Fetches available meta fields from the current post
 * Filters out protected fields and formats for display
 */
export const useMetaFields = () => {
	const [templateMetaFields, setTemplateMetaFields] = useState([]);
	
	const { metaKeys, isTemplateContext } = useSelect((select) => {
		const editor = select("core/editor");
		const currentPostType = editor?.getCurrentPostType ? editor.getCurrentPostType() : null;
		
		// Check if we're in template/pattern context
		const inTemplateContext = !currentPostType || 
			currentPostType === "wp_template" || 
			currentPostType === "wp_template_part" ||
			currentPostType === "wp_block";
		
		let keys = [];
		
		if (!inTemplateContext) {
			// In post context, get from current post meta
			const meta = editor.getEditedPostAttribute("meta") || {};
			keys = Object.keys(meta);
		}
		
		return { 
			metaKeys: keys,
			isTemplateContext: inTemplateContext
		};
	}, []);

	// Fetch meta fields for template context
	useEffect(() => {
		if (!isTemplateContext) return;
		
		const fetchMetaFields = async () => {
			const allFields = new Set();
			
			try {
				// Fetch post types from REST API
				const postTypes = await apiFetch({ path: '/wp/v2/types' });
				
				// For each post type, fetch its schema
				for (const [slug, postType] of Object.entries(postTypes)) {
					// Skip certain post types
					if (['attachment', 'wp_block', 'wp_template', 'wp_template_part', 'wp_navigation'].includes(slug)) {
						continue;
					}
					
					try {
						// Fetch OPTIONS to get schema
						const response = await apiFetch({
							path: postType?._links?.self?.[0]?.href || `/wp/v2/${slug}`,
							method: 'OPTIONS',
							parse: false
						});
						
						const data = await response.json();
						
						// Extract meta fields from schema
						if (data?.schema?.properties?.meta?.properties) {
							Object.keys(data.schema.properties.meta.properties).forEach(field => {
								allFields.add(field);
							});
						}
					} catch (e) {
						// Individual post type fetch failed
						console.warn(`Failed to fetch schema for ${slug}`, e);
					}
				}
			} catch (e) {
				console.warn('Failed to fetch post types', e);
			}
			
			const fields = Array.from(allFields);
			
			// If we found fields, use them, otherwise use fallback
			if (fields.length > 0) {
				setTemplateMetaFields(fields);
			} else {
				// Fallback fields
				setTemplateMetaFields([
					'polaris_hero_title',
					'meta_image',
					'meta_description',
					'polaris_listing_website_url',
					'compass_listing_price_level'
				]);
			}
		};
		
		fetchMetaFields();
	}, [isTemplateContext]);

	// Use template meta fields if in template context
	const allMetaKeys = isTemplateContext ? templateMetaFields : metaKeys;

	const metaFieldOptions = useMemo(() => {
		const options = allMetaKeys
			.filter((field) => {
				// Exclude WordPress protected fields (start with _)
				if (field.startsWith("_")) {
					return false;
				}
				// Exclude some other internal fields
				if (field.startsWith("wp_") || field.startsWith("footnotes")) {
					return false;
				}
				// Exclude companion URL and alt fields (these are auto-managed)
				if (
					field.endsWith("_image_url") ||
					field.endsWith("_image_alt")
				) {
					return false;
				}
				return true;
			})
			.map((field) => ({
				label: field
					.replace(/_/g, " ")
					.replace(/\b\w/g, (l) => l.toUpperCase()),
				value: field,
			}))
			.sort((a, b) => a.label.localeCompare(b.label));
		
		return options;
	}, [allMetaKeys, isTemplateContext]);

	return metaFieldOptions;
};