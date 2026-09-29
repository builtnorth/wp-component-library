/**
 * Editor visibility rules for hide-when-empty blocks (hideWhenMetaEmpty).
 *
 * Frontend output is suppressed by navas-utility MetaGatedBlockSupport /
 * render.php. In the editor, blocks stay visible on template surfaces so card
 * layouts remain editable; they hide in query/post-feed loop previews when
 * their Block Bindings are empty — the block's own, or for a wrapper with no
 * bindings of its own, every bound block inside it.
 */

import { getBlockBindingsSource } from "@wordpress/blocks";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";

/**
 * @param {string|null|undefined} editorPostType Current editor post type.
 * @returns {boolean}
 */
export function isTemplateEditorSurface(editorPostType) {
	return (
		!editorPostType ||
		editorPostType === "wp_template" ||
		editorPostType === "wp_template_part" ||
		editorPostType === "wp_block"
	);
}

/**
 * @param {unknown} value Post meta value.
 * @returns {boolean}
 */
export function isMetaValueEmpty(value) {
	if (value === undefined || value === null || value === false || value === "") {
		return true;
	}

	if (Array.isArray(value)) {
		return value.length === 0;
	}

	if (typeof value === "object") {
		return !(value?.name && value?.source);
	}

	if (typeof value === "string") {
		return value.trim() === "";
	}

	return false;
}

/**
 * Bindings of a block, else of its descendants (for wrappers such as a group
 * around a bound paragraph).
 *
 * @param {object|undefined} ownBindings  The block's metadata.bindings.
 * @param {object[]}         innerBlocks  The block's inner blocks.
 * @returns {object[]} One bindings object per bound block.
 */
function collectBindings(ownBindings, innerBlocks) {
	if (ownBindings && Object.keys(ownBindings).length > 0) {
		return [ownBindings];
	}

	return (innerBlocks || []).flatMap((inner) =>
		collectBindings(inner.attributes?.metadata?.bindings, inner.innerBlocks),
	);
}

/**
 * Resolve bindings through their registered sources, as the editor does.
 *
 * @returns {unknown[]} Bound values.
 */
function resolveBoundValues(select, bindingSets, context, clientId) {
	const values = [];

	for (const bindings of bindingSets) {
		for (const [attribute, binding] of Object.entries(bindings)) {
			const source = getBlockBindingsSource(binding?.source);

			if (!source?.getValues) {
				continue;
			}

			const result = source.getValues({
				select,
				context,
				bindings: { [attribute]: binding },
				clientId,
			});
			values.push(result?.[attribute]);
		}
	}

	return values;
}

/**
 * @param {object} props
 * @param {object} props.attributes Block attributes.
 * @param {string} [props.clientId] Block client ID.
 * @param {object} [props.context] Block context (postId, postType).
 * @returns {{ shouldHide: boolean, isTemplateSurface: boolean, isLoopPreview: boolean }}
 */
export function useMetaGatedEditorVisibility({ attributes, clientId, context }) {
	const { hideWhenMetaEmpty, metaField, metadata } = attributes || {};
	const ownBindings = metadata?.bindings;
	const contextPostId = context?.postId;
	const contextPostType = context?.postType;

	return useSelect(
		(select) => {
			const defaultResult = {
				shouldHide: false,
				isTemplateSurface: false,
				isLoopPreview: false,
			};

			if (!hideWhenMetaEmpty) {
				return defaultResult;
			}

			const editor = select("core/editor");
			const editorPostType = editor?.getCurrentPostType?.() ?? null;
			const editorPostId = editor?.getCurrentPostId?.() ?? null;
			const isTemplateSurface = isTemplateEditorSurface(editorPostType);

			if (isTemplateSurface) {
				return {
					shouldHide: false,
					isTemplateSurface: true,
					isLoopPreview: false,
				};
			}

			const inPostContext = Boolean(contextPostId && contextPostType);
			const isLoopPreview =
				inPostContext &&
				editorPostId !== null &&
				Number(contextPostId) !== Number(editorPostId);

			// Editing the source post — keep visible so fields can be filled in.
			if (!isLoopPreview) {
				return defaultResult;
			}

			const bindingSets = collectBindings(
				ownBindings,
				clientId
					? select(blockEditorStore).getBlock(clientId)?.innerBlocks
					: [],
			);

			if (bindingSets.length > 0) {
				const values = resolveBoundValues(
					select,
					bindingSets,
					{ postId: contextPostId, postType: contextPostType },
					clientId,
				);

				return {
					shouldHide: values.every(isMetaValueEmpty),
					isTemplateSurface: false,
					isLoopPreview: true,
				};
			}

			// Legacy: content saved before bindings keyed the gate by metaField.
			if (!metaField) {
				return defaultResult;
			}

			const record = select(coreStore).getEntityRecord(
				"postType",
				contextPostType,
				contextPostId,
			);

			return {
				shouldHide: isMetaValueEmpty(record?.meta?.[metaField]),
				isTemplateSurface: false,
				isLoopPreview: true,
			};
		},
		[
			hideWhenMetaEmpty,
			metaField,
			ownBindings,
			clientId,
			contextPostId,
			contextPostType,
		],
	);
}
