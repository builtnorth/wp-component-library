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
// MetaPanel, AttributesPanel and the meta-gated editor helpers need the post
// editor (@wordpress/editor or its store): they live in
// `@siratik/wp-component-library/editor` (editor.js), so screens outside the
// post editor never load @wordpress/editor through this entry.
export { DragHandle, RemoveButton, Repeater } from "./components/repeater";
export { SocialProfilesControl } from "./components/social-profiles";
// Query Controls - Individual ToolsPanelItems that can be composed together
export { Badge } from "./components/badge";
// Address search (Nominatim, explicit submit only).
export {
	AddressEntryControl,
	GeocoderSearchControl,
	geocodeAddress,
	getCountryOptions,
	toOrganizationLocation,
	GEOCODER_ATTRIBUTION_HTML,
	DEFAULT_GEOCODER_COUNTRY_CODES,
} from "./components/geocoder";
// Weekly business hours editor (controlled).
export { SpecialHoursControl, WeeklyHoursControl } from "./components/business-hours";
export { SegmentedBar } from "./components/segmented-bar";
export { StylePicker } from "./components/style-picker";
export {
	STATUS_COLOR_FALLBACKS,
	statusColor,
	statusVar,
	getStatusSurfaceColors,
	getScoreStatusTier,
	getScoreSurfaceColors,
	getScoreChartColors,
	getBadgeIntentColors,
	defaultChartStatusColors,
} from "./constants/statusColors";
export { ADMIN_COLOR } from "./constants/adminColors";
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
	default as SortableSelect,
	tokensToString,
} from "./components/sortable-select";
export {
	LinkToolsPanel,
	LinkToolsPanelItems,
	LINK_DEFAULTS,
} from "./components/link-tools-panel";
export { VariableField } from "./components/variable-field";
export { VariableInserter } from "./components/variable-inserter";


export {
	getEditorExperiencePatterns,
	getEditorExperienceSectionDivider,
	getLocalize,
	getLocalizeWindow,
	getKitarisLocalize, // @deprecated — use getLocalize
	getKitarisLocalizeWindow, // @deprecated — use getLocalizeWindow
	SKIN_CHANGED_EVENT,
} from "./utils/kitaris-localize";

// Color controls
export { slugAwareColorSetter } from "./utils/slug-aware-color-setter";

// Icon Picker & Registry
export {
	iconStore,
	ICON_STORE_NAME,
	registerIconSet,
	registerIcons,
	registerConfigIconSets,
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
	safeSvgSource,
} from "./components/icon-picker";
