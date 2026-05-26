/**
 * registerBlockExtension / unregisterBlockExtension
 *
 * Drop-in replacement for @10up/block-components registerBlockExtension.
 * Fully backwards-compatible API — same arguments, same behaviour.
 *
 * Registers four WordPress hooks per extension:
 *   1. blocks.registerBlockType  — merges extra `attributes`
 *   2. editor.BlockEdit          — injects `Edit` controls (before | after block)
 *   3. editor.BlockListBlock     — applies `classNameGenerator` / `inlineStyleGenerator` in editor
 *   4. blocks.getSaveContent.extraProps — applies class/style to saved HTML
 *
 * @param {string|string[]} blockName
 *   Block name(s) to extend. Pass `"*"` or `"all"` to match every block.
 * @param {Object}   options
 * @param {Object}   [options.attributes={}]            Extra attribute definitions.
 * @param {Function} [options.classNameGenerator]       (attributes) => string
 * @param {Function} [options.inlineStyleGenerator]     (attributes) => Object
 * @param {Function} options.Edit                       React component for inspector controls.
 * @param {string}   options.extensionName              Unique name used in filter namespaces.
 * @param {'before'|'after'} [options.order='after']   Whether Edit renders before or after BlockEdit.
 */

import { addFilter, removeFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { createElement, Fragment } from "@wordpress/element";

/**
 * Minimal className utility — avoids adding clsx as a dependency.
 *
 * @param {...(string|null|undefined|false)} classes
 * @returns {string}
 */
function cx(...classes) {
	return classes.filter(Boolean).join(" ").trim();
}

export function registerBlockExtension(
	blockName,
	{
		attributes = {},
		classNameGenerator = () => "",
		inlineStyleGenerator,
		Edit,
		extensionName,
		order = "after",
	},
) {
	const isArray = Array.isArray(blockName);

	// Normalise wildcard
	if (blockName === "*") blockName = "all";

	/**
	 * Returns true when `name` should be extended.
	 *
	 * @param {string} name Block name.
	 * @returns {boolean}
	 */
	const matches = (name) => {
		if (blockName === "all") return true;
		if (isArray) return blockName.includes(name);
		return name === blockName;
	};

	// Build a stable namespace segment for hook IDs.
	const ns = isArray ? blockName.join("-") : blockName;
	const prefix = `polaris/${ns}/${extensionName}`;

	// ── 1. Attributes ────────────────────────────────────────────────────────

	addFilter(
		"blocks.registerBlockType",
		`${prefix}/addAttributesToBlock`,
		(settings, name) => {
			if (!matches(name)) return settings;
			return {
				...settings,
				attributes: { ...settings.attributes, ...attributes },
			};
		},
	);

	// ── 2. Editor controls (BlockEdit HOC) ───────────────────────────────────

	const withEdit = createHigherOrderComponent(
		(BlockEdit) => (props) => {
			const { name, isSelected } = props;

			if (!matches(name)) return createElement(BlockEdit, props);

			const before = order === "before" && isSelected;
			const after = order === "after" && isSelected;
			// Fallback: any unrecognised order value renders after (same as 10up)
			const fallback = !before && !after && isSelected;

			return createElement(
				Fragment,
				null,
				before && createElement(Edit, props),
				createElement(BlockEdit, props),
				after && createElement(Edit, props),
				fallback && createElement(Edit, props),
			);
		},
		"addSettingsToBlock",
	);

	addFilter("editor.BlockEdit", `${prefix}/addSettingsToBlock`, withEdit);

	// ── 3. Class + style in editor (BlockListBlock HOC) ──────────────────────

	const withBlockListBlock = createHigherOrderComponent(
		(BlockListBlock) => (props) => {
			const {
				name,
				attributes: blockAttrs,
				className = "",
				style = {},
				wrapperProps,
			} = props;

			if (!matches(name)) return createElement(BlockListBlock, props);

			const generatedClass = classNameGenerator(blockAttrs);
			const mergedClass = cx(className, generatedClass);

			let mergedStyle = { ...style };
			let generatedStyle = null;

			if (typeof inlineStyleGenerator === "function") {
				generatedStyle = inlineStyleGenerator(blockAttrs);
				mergedStyle = {
					...style,
					...(wrapperProps?.style ?? {}),
					...generatedStyle,
				};
			}

			if (!generatedClass && !generatedStyle) {
				return createElement(BlockListBlock, props);
			}

			return createElement(BlockListBlock, {
				...props,
				className: mergedClass,
				wrapperProps: { ...wrapperProps, style: mergedStyle },
			});
		},
		"addAdditionalPropertiesInEditor",
	);

	addFilter(
		"editor.BlockListBlock",
		`${prefix}/addAdditionalPropertiesInEditor`,
		withBlockListBlock,
	);

	// ── 4. Class + style in saved HTML ───────────────────────────────────────

	addFilter(
		"blocks.getSaveContent.extraProps",
		`${prefix}/addAdditionalPropertiesToSavedMarkup`,
		(extraProps, blockType, blockAttrs) => {
			const { className = "", style = {} } = extraProps;

			if (!matches(blockType.name)) return extraProps;

			const generatedClass = classNameGenerator(blockAttrs);
			const mergedClass = cx(className, generatedClass);

			let mergedStyle = { ...style };
			let generatedStyle = null;

			if (typeof inlineStyleGenerator === "function") {
				generatedStyle = inlineStyleGenerator(blockAttrs);
				mergedStyle = { ...style, ...generatedStyle };
			}

			if (!generatedClass && !generatedStyle) return extraProps;

			return { ...extraProps, className: mergedClass, style: mergedStyle };
		},
	);
}

/**
 * Remove a previously registered block extension.
 *
 * @param {string|string[]} blockName     Same value passed to registerBlockExtension.
 * @param {string}          extensionName Same extensionName passed to registerBlockExtension.
 */
export function unregisterBlockExtension(blockName, extensionName) {
	if (!blockName || !extensionName) return;

	if (blockName === "*") blockName = "all";

	const isArray = Array.isArray(blockName);
	const ns = isArray ? blockName.join("-") : blockName;
	const prefix = `polaris/${ns}/${extensionName}`;

	removeFilter("blocks.registerBlockType", `${prefix}/addAttributesToBlock`);
	removeFilter("editor.BlockEdit", `${prefix}/addSettingsToBlock`);
	removeFilter(
		"editor.BlockListBlock",
		`${prefix}/addAdditionalPropertiesInEditor`,
	);
	removeFilter(
		"blocks.getSaveContent.extraProps",
		`${prefix}/addAdditionalPropertiesToSavedMarkup`,
	);
}
