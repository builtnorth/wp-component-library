/**
 * Editor visibility rules for meta-gated blocks (hideWhenMetaEmpty).
 *
 * Frontend output is suppressed by wp-utility MetaGatedBlockSupport / render.php.
 * In the editor, blocks stay visible on template surfaces so card layouts remain
 * editable; they hide in query/post-feed loop previews when meta is empty.
 */

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
 * @param {object} props
 * @param {object} props.attributes Block attributes.
 * @param {object} [props.context] Block context (postId, postType).
 * @returns {{ shouldHide: boolean, isTemplateSurface: boolean, isLoopPreview: boolean }}
 */
export function useMetaGatedEditorVisibility({ attributes, context }) {
	const { hideWhenMetaEmpty, metaField } = attributes || {};
	const contextPostId = context?.postId;
	const contextPostType = context?.postType;

	return useSelect(
		(select) => {
			const defaultResult = {
				shouldHide: false,
				isTemplateSurface: false,
				isLoopPreview: false,
			};

			if (!hideWhenMetaEmpty || !metaField) {
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

			// Editing the source post — keep visible so meta can be filled in.
			if (inPostContext && !isLoopPreview) {
				return defaultResult;
			}

			if (!isLoopPreview) {
				return defaultResult;
			}

			const record = select(coreStore).getEntityRecord(
				"postType",
				contextPostType,
				contextPostId,
			);
			const metaValue = record?.meta?.[metaField];

			return {
				shouldHide: isMetaValueEmpty(metaValue),
				isTemplateSurface: false,
				isLoopPreview: true,
			};
		},
		[
			hideWhenMetaEmpty,
			metaField,
			contextPostId,
			contextPostType,
		],
	);
}
