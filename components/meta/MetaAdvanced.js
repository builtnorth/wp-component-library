import { InspectorAdvancedControls } from "@wordpress/block-editor";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { MetaFieldSelector } from "./MetaFieldSelector";

const BaseMetaAdvanced = ({
	metaField,
	onMetaFieldChange,
	blockName,
	blockAttributes,
	clientId,
}) => {
	const isImageBlock = blockName === "core/image";
	const { updateBlockAttributes } = useDispatch("core/block-editor");
	const { editPost } = useDispatch("core/editor");

	// Get media object when we have an image ID
	const media = useSelect((select) => {
		if (!isImageBlock || !blockAttributes?.id) return null;
		return select("core").getMedia(blockAttributes.id);
	}, [isImageBlock, blockAttributes?.id]);

	// Get post meta
	const postMeta = useSelect((select) => {
		return select("core/editor").getEditedPostAttribute("meta") || {};
	}, []);

	// Save image data to meta when image changes
	useEffect(() => {
		if (!isImageBlock || !metaField || !blockAttributes?.id) {
			return;
		}

		const updates = {
			[metaField]: blockAttributes.id,
		};

		// If we have media data, also save the URL and alt
		if (media) {
			if (media.source_url) {
				updates[`${metaField}_url`] = media.source_url;
			}
			if (media.alt_text) {
				updates[`${metaField}_alt`] = media.alt_text;
			} else if (media.alt) {
				updates[`${metaField}_alt`] = media.alt;
			}
		} else if (blockAttributes.url) {
			updates[`${metaField}_url`] = blockAttributes.url;
		}

		// Save alt text from block attribute if available
		if (blockAttributes.alt !== undefined && blockAttributes.alt !== '') {
			updates[`${metaField}_alt`] = blockAttributes.alt;
		}

		editPost({
			meta: {
				...postMeta,
				...updates,
			},
		});
	}, [blockAttributes?.id, blockAttributes?.url, blockAttributes?.alt, media, metaField]);

	// Apply or remove block bindings when metaField changes
	useEffect(() => {
		if (metaField) {
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
			// Remove binding
			updateBlockAttributes(clientId, { metadata: {} });
		}
	}, [metaField]);

	return (
		<InspectorAdvancedControls>
			<MetaFieldSelector 
				value={metaField} 
				onChange={onMetaFieldChange} 
			/>
		</InspectorAdvancedControls>
	);
};

const MetaAdvanced = compose([
	withSelect((select, ownProps) => {
		const { getBlockAttributes, getBlockName } = select("core/block-editor");
		const blockAttributes = getBlockAttributes(ownProps.clientId);
		const blockName = getBlockName(ownProps.clientId);
		
		return {
			metaField: blockAttributes?.metaField || "",
			blockAttributes,
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
])(BaseMetaAdvanced);

export { MetaAdvanced };