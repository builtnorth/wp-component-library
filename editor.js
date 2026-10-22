/**
 * Post-editor-only components and helpers: everything here needs
 * @wordpress/editor or its `core/editor` store. Import them from
 * `@siratik/wp-component-library/editor`; the main entry (index.js) has the
 * rest, so screens outside the post editor don't load @wordpress/editor.
 */
export {
	isMetaValueEmpty,
	isTemplateEditorSurface,
	useMetaGatedEditorVisibility,
} from "./components/meta/meta-gated-editor";
export { MetaPanel } from "./components/meta/MetaPanel";
export {
	default as AttributesPanel,
	useAttributes,
} from "./components/attributes-panel";
