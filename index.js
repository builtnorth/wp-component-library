/**
 * WordPress Component Library
 *
 * A collection of reusable components for WordPress projects.
 */

export { AttachmentImage } from "./components/attachment-image";
export {
	CustomBlockAppender,
	CustomColumnAppender,
	CustomInlineAppender,
	CustomInspectorAppender,
} from "./components/block-appender";
export { ButtonFrontend } from "./components/button";
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
export { MetaAdvanced } from "./components/meta/MetaAdvanced";
export { MetaPanel } from "./components/meta/MetaPanel";
export { DragHandle, RemoveButton, Repeater } from "./components/repeater";
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
	reorderByIds,
	SelectionModeControl,
	TaxonomySelect,
	useOrderedTerms,
} from "./components/query";
export { SectionDividerSettings } from "./components/section-divider";
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
export {
	default as SortableSelect,
	tokensToString,
} from "./components/sortable-select";
export { VariableField } from "./components/variable-field";
export { VariableInserter } from "./components/variable-inserter";
export { CaptchaPlaceholder } from "./components/captcha-placeholder";
export { default as AttributesPanel, useAttributes } from "./components/attributes-panel";

// AI Framework
export { AIContentFramework } from "./components/ai-framework";
export { AIGenerator } from "./components/ai-framework/generator";
export { AIFieldWrapper, AIFieldWithLabel } from "./components/ai-framework/field-wrapper";
export {
	extractHeadings,
	extractListItems,
	extractFirstParagraph,
	extractStructuredContent,
	cleanAIOutput,
	truncateToSentence
} from "./components/ai-framework/utilities";
