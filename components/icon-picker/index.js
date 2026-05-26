/**
 * Polaris Icon Picker
 *
 * Registry + UI components for icon selection in the block editor.
 * Replaces @10up/block-components icon APIs.
 */

// Store (registers on import)
export { iconStore, STORE_NAME as ICON_STORE_NAME } from "./store";

// Registration API
export { registerIconSet, registerIcons, removeIconSet } from "./api";

// React hooks
export {
	useIconSets,
	useGroupedIcons,
	useAllIcons,
	useIcons,
	useIcon,
} from "./hooks";

// UI components
export { Icon } from "./Icon";
export { IconPicker } from "./IconPicker";
export { IconPickerModal } from "./IconPickerModal";
export { IconPickerToolbarButton } from "./IconPickerToolbarButton";
export { InlineIconPicker } from "./InlineIconPicker";
