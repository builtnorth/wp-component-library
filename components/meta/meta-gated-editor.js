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

/** Characters PHP's trim() strips (not JS's wider whitespace set). */
const PHP_TRIM = /^[ \t\n\r\0\x0B]+|[ \t\n\r\0\x0B]+$/g;

/**
 * PHP's empty() for a scalar.
 *
 * @param {unknown} value Value.
 * @returns {boolean}
 */
function isPhpEmpty(value) {
	return !value || value === "0";
}

/**
 * Whether a bound value counts as empty, as navas-utility
 * MetaGatedRender::is_value_empty() decides on the front end: arrays and
 * objects are empty unless they are a usable icon (name + source).
 *
 * @param {unknown} value Post meta value.
 * @returns {boolean}
 */
export function isMetaValueEmpty(value) {
	if (value === undefined || value === null || value === false || value === "") {
		return true;
	}

	if (Array.isArray(value)) {
		return true;
	}

	if (typeof value === "object") {
		return isPhpEmpty(value.name) || isPhpEmpty(value.source);
	}

	if (typeof value === "string") {
		return value.replace(PHP_TRIM, "") === "";
	}

	return false;
}

/**
 * Values of a block's own bindings resolved through their registered
 * sources, as the editor does; null when none resolves (no binding, or only
 * unregistered sources).
 *
 * @returns {unknown[]|null} Bound values.
 */
function ownBoundValues(select, bindings, context, clientId) {
	const values = [];

	for (const [attribute, binding] of Object.entries(bindings || {})) {
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

	return values.length > 0 ? values : null;
}

/**
 * Values of a block's own bindings, else of its descendants' bindings (for
 * wrappers such as a group around a bound paragraph), as navas-utility
 * MetaGatedRender::bound_values() reads them on the front end.
 *
 * @returns {unknown[]|null} Bound values, or null when nothing is bound.
 */
function boundValues(select, bindings, innerBlocks, context, clientId) {
	const own = ownBoundValues(select, bindings, context, clientId);

	if (own !== null) {
		return own;
	}

	let values = null;

	for (const inner of innerBlocks || []) {
		const innerValues = boundValues(
			select,
			inner.attributes?.metadata?.bindings,
			inner.innerBlocks,
			context,
			clientId,
		);

		if (innerValues !== null) {
			values = [...(values ?? []), ...innerValues];
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

			const values = boundValues(
				select,
				ownBindings,
				clientId
					? select(blockEditorStore).getBlock(clientId)?.innerBlocks
					: [],
				{ postId: contextPostId, postType: contextPostType },
				clientId,
			);

			if (values !== null) {
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
