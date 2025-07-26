/**
 * WordPress Component Library
 *
 * A collection of reusable components for WordPress projects.
 */

/**
 * Styles
 *
 * NOTE: Styles are now built separately to prevent duplication.
 * Import the built CSS file in your project:
 * - For development: import '@builtnorth/wp-component-library/build/style.css';
 * - For production: Enqueue the CSS file separately in WordPress
 *
 * If you need styles bundled with JS (not recommended), uncomment:
 * import "./styles/index.scss";
 */

/* Components */
export { AccessibleCard } from "./components/accessible-card";
export { AttachmentImage } from "./components/attachment-image";
export {
	CustomBlockAppender,
	CustomColumnAppender,
	CustomInlineAppender,
	CustomInspectorAppender,
} from "./components/block-appender";
export { ButtonFrontend } from "./components/button";
export { default as CardRepeater } from "./components/card-repeater";
export { ReorderableList } from "./components/drag-and-drop";
export {
	AlignmentSettings,
	AlignmentToolbar,
	AllowWrapSettings,
	ContentAlignmentSettings,
	ContentAlignmentToolbar,
	JustificationSettings,
	JustificationToolbar,
	LayoutPanel,
	LayoutWidthControl,
	OrientationSettings,
	OrientationToolbar,
} from "./components/layout";
export {
	EditorMediaUpload,
	InspectorMediaUpload,
	SettingsMediaUpload,
	ToolbarMediaUpload,
} from "./components/media";
export { ImageControls } from "./components/media/image-controls";
export { MetaAdvanced } from "./components/meta/meta-advanced";
export { MetaPanel } from "./components/meta/meta-panel";
export { Pagination } from "./components/pagination";
// Query Controls - Individual ToolsPanelItems that can be composed together
export { aspectRatioOptions } from "./components/media/utils/aspect-ratios";
export {
	ColumnCountControl,
	defaultOrderOptions,
	DisplayTypeSelect,
	ManualPostSelector,
	ManualTermSelector,
	OrderBySelect,
	PostsPerPageControl,
	PostTypeSelect,
	SelectionModeControl,
	TaxonomySelect,
	reorderByIds,
	useOrderedTerms,
} from "./components/query";
export {
	SectionPattern,
	SectionPatternSettings,
} from "./components/section-pattern";
export {
	// Individual control components for custom compositions
	FocalPointControl,
	ImageSourceControl,
	MediaSelectControl,
	OpacityControl,
	SectionBackground,
	SectionSettings,
	StyleControl,
} from "./components/section-settings";
export { GetTerms } from "./components/terms";
export { default as VariableInserter } from "./components/variable-inserter";
export { default as SortableSelect } from "./components/sortable-select";
