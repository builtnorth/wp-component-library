import { InspectorAdvancedControls } from "@wordpress/block-editor";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { useEffect, useRef, memo } from "@wordpress/element";
import { useSelect, useDispatch, select as wpSelect } from "@wordpress/data";
import { MetaFieldSelector } from "./MetaFieldSelector";

const BaseMetaAdvanced = ({
	metaField,
	onMetaFieldChange,
	blockName,
	clientId,
}) => {
	const isImageBlock = blockName === "core/image";
	
	
	const { updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent } = useDispatch("core/block-editor");
	const { editPost } = useDispatch("core/editor");

	// Only get the specific attributes we need
	const { imageId, imageUrl, imageAlt } = useSelect((select) => {
		const attributes = select("core/block-editor").getBlockAttributes(clientId) || {};
		
		if (!isImageBlock) {
			return { imageId: null, imageUrl: '', imageAlt: '' };
		}
		
		return { 
			imageId: attributes.id || null,
			imageUrl: attributes.url || '',
			imageAlt: attributes.alt || ''
		};
	}, [clientId, isImageBlock]);

	// Get media data separately to avoid re-renders
	const media = useSelect((select) => {
		if (!isImageBlock || !imageId) return null;
		return select("core").getMedia(imageId);
	}, [isImageBlock, imageId]);

	// Track the last synced ID and whether we've initialized
	const lastSyncedId = useRef(null);
	const isInitialized = useRef(false);
	
	// Save image data to meta when image ID changes
	useEffect(() => {
		if (!isImageBlock || !metaField || !imageId) {
			return;
		}

		// Skip if we already synced this ID
		if (lastSyncedId.current === imageId) {
			return;
		}

		// Mark as initialized after first render
		if (!isInitialized.current) {
			isInitialized.current = true;
			// Skip the first render to avoid saving on mount
			lastSyncedId.current = imageId;
			return;
		}

		// Update last synced ID
		lastSyncedId.current = imageId;

		// Get current data from store
		const postMeta = wpSelect("core/editor").getEditedPostAttribute("meta") || {};

		const updates = {
			[metaField]: imageId,
		};

		// Get the latest media data
		const currentMedia = wpSelect("core").getMedia(imageId);
		const attributes = wpSelect("core/block-editor").getBlockAttributes(clientId) || {};

		// If we have media data, also save the URL and alt
		if (currentMedia) {
			if (currentMedia.source_url) {
				updates[`${metaField}_url`] = currentMedia.source_url;
			}
			if (currentMedia.alt_text) {
				updates[`${metaField}_alt`] = currentMedia.alt_text;
			} else if (currentMedia.alt) {
				updates[`${metaField}_alt`] = currentMedia.alt;
			}
		} else if (attributes.url) {
			updates[`${metaField}_url`] = attributes.url;
		}

		// Save alt text
		if (attributes.alt) {
			updates[`${metaField}_alt`] = attributes.alt;
		}

		editPost({
			meta: {
				...postMeta,
				...updates,
			},
		});
	}, [imageId, metaField, clientId, isImageBlock, editPost]); // Include necessary dependencies

	// Track if we've initialized bindings
	const hasInitializedBindings = useRef(false);
	
	// Apply or remove block bindings when metaField changes
	useEffect(() => {
		// Skip on first render
		if (!hasInitializedBindings.current) {
			hasInitializedBindings.current = true;
			
			// Check if there's already a metaField set
			if (!metaField) {
				return; // No need to do anything if no metaField
			}
		}
		
		// Get current block attributes to check existing bindings
		const currentAttributes = wpSelect("core/block-editor").getBlockAttributes(clientId) || {};
		const currentBindings = currentAttributes.metadata?.bindings;
		
		if (metaField) {
			// Different binding for image vs content blocks
			if (isImageBlock) {
				// Check if bindings are already set correctly for images
				if (
					currentBindings?.id?.source === "core/post-meta" &&
					currentBindings?.id?.args?.key === metaField &&
					currentBindings?.url?.source === "core/post-meta" &&
					currentBindings?.url?.args?.key === `${metaField}_url` &&
					currentBindings?.alt?.source === "core/post-meta" &&
					currentBindings?.alt?.args?.key === `${metaField}_alt`
				) {
					// Bindings are already correct, skip update
					return;
				}
				
				// Bind ID, URL, and alt from separate meta fields
				const newBindings = {
					metadata: {
						bindings: {
							id: {
								source: "core/post-meta",
								args: { key: metaField },
							},
							url: {
								source: "core/post-meta",
								args: { key: `${metaField}_url` },
							},
							alt: {
								source: "core/post-meta",
								args: { key: `${metaField}_alt` },
							},
						},
					},
				};
				
				updateBlockAttributes(clientId, newBindings);
			} else {
				// For non-image blocks (heading, paragraph, button), bind content
				if (
					currentBindings?.content?.source === "core/post-meta" &&
					currentBindings?.content?.args?.key === metaField
				) {
					// Binding is already correct, skip update
					return;
				}
				
				// Bind content to meta field
				const newBindings = {
					metadata: {
						bindings: {
							content: {
								source: "core/post-meta",
								args: { key: metaField },
							},
						},
					},
				};
				
				updateBlockAttributes(clientId, newBindings);
			}
		} else if (currentBindings && Object.keys(currentBindings).length > 0) {
			// Build attributes object to clear bindings and reset values
			const attributesToUpdate = { 
				metadata: undefined, // Use undefined to remove
				metaField: undefined
			};
			
			// For image blocks, we need to handle the Tools Panel reset differently
			// The Tools Panel expects these specific values to show as "reset"
			if (currentBindings.id || currentBindings.url || currentBindings.alt) {
				// For images, setting to undefined should trigger reset
				attributesToUpdate.id = undefined;
				attributesToUpdate.url = undefined; 
				attributesToUpdate.alt = undefined;
			}
			
			// For content blocks
			if (currentBindings.content) {
				attributesToUpdate.content = undefined;
			}
			
			updateBlockAttributes(clientId, attributesToUpdate);
		}
	}, [metaField]); // Only watch metaField changes

	return (
		<InspectorAdvancedControls>
			<MetaFieldSelector 
				value={metaField} 
				onChange={onMetaFieldChange} 
			/>
		</InspectorAdvancedControls>
	);
};

// Memoized version to prevent unnecessary re-renders
const MetaAdvancedMemo = memo(BaseMetaAdvanced, (prevProps, nextProps) => {
	return (
		prevProps.metaField === nextProps.metaField &&
		prevProps.blockName === nextProps.blockName &&
		prevProps.clientId === nextProps.clientId
	);
});

const MetaAdvanced = compose([
	withSelect((select, ownProps) => {
		const { getBlockAttributes, getBlockName } = select("core/block-editor");
		const blockName = getBlockName(ownProps.clientId);
		
		// Get only the metaField to minimize re-renders
		const blockAttributes = getBlockAttributes(ownProps.clientId);
		const metaField = blockAttributes?.metaField || "";
		
		return {
			metaField,
			blockName,
		};
	}),
	withDispatch((dispatch, ownProps) => {
		const { updateBlockAttributes } = dispatch("core/block-editor");

		return {
			onMetaFieldChange: (value) => {
				updateBlockAttributes(ownProps.clientId, { metaField: value });
			},
		};
	}),
])(MetaAdvancedMemo);

export { MetaAdvanced };