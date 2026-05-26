/**
 * WordPress Component Library
 *
 * A collection of reusable components for WordPress projects.
 */

export { AttachmentImage } from "./components/attachment-image";
export {
	registerBlockExtension,
	unregisterBlockExtension,
} from "./components/block-extension";
export {
	CustomBlockAppender,
	CustomColumnAppender,
	CustomInlineAppender,
	CustomInspectorAppender,
} from "./components/block-appender";
export { ButtonFrontend } from "./components/button";
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
export {
	default as AttributesPanel,
	useAttributes,
} from "./components/attributes-panel";
export { Badge } from "./components/badge";
export { CaptchaPlaceholder } from "./components/captcha-placeholder";
export { useAspectRatioOptions } from "./components/media/utils/aspect-ratios";
export {
	ColumnCountControl,
	defaultOrderOptions,
	DisplayTypeSelect,
	HideCurrentPostControl,
	ManualPostSelector,
	ManualTermSelector,
	OrderBySelect,
	PostsPerPageControl,
	PostTypeSelect,
	CardTemplatePartSelect,
	CardTemplatePartPanel,
	getDefaultCardSlugForPostType,
	reorderByIds,
	SelectionModeControl,
	TaxonomySelect,
	useOrderedTerms,
} from "./components/query";
export {
	SectionDividerSettings,
	sectionHasDividerBackground,
	sectionHasCustomBackground,
	sectionHasPolarisSectionBackground, // @deprecated — use sectionHasCustomBackground
} from "./components/section-divider";
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

// AI Framework (Clean Architecture)
export {
	AIButton,
	aiCache,
	AIField,
	AIFieldWrapper,
	AIInline,
	AIModal,
	configureAI,
	useAI,
} from "./components/ai";
// Content extraction utilities removed - use AI type configs instead

export {
	getEditorExperienceSectionDivider,
	getLocalize,
	getLocalizeWindow,
	getPolarisLocalize, // @deprecated — use getLocalize
	getPolarisLocalizeWindow, // @deprecated — use getLocalizeWindow
} from "./utils/polaris-localize";
export { isAiEnabled, isAiPolicyEnabled, isAiFullyConfigured, isAiSetupRequired } from "./utils/ai-gate";

// Icon Picker & Registry
export {
	iconStore,
	ICON_STORE_NAME,
	registerIconSet,
	registerIcons,
	removeIconSet,
	loadIconSet,
	loadAllIconSets,
	useIconSets,
	useGroupedIcons,
	useIconPickerGroups,
	useAllIcons,
	useIcons,
	useIcon,
	Icon,
	IconPicker,
	IconPickerModal,
	IconPickerToolbarButton,
	InlineIconPicker,
} from "./components/icon-picker";
