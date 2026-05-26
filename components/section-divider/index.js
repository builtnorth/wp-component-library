/**
 * Section Divider Components
 *
 * Components for handling divider settings and rendering in WordPress blocks.
 */

// Main components
export { SectionDividerSettings } from "./SectionDividerSettings";
export {
	sectionHasDividerBackground,
	sectionHasCustomBackground,
	sectionHasPolarisSectionBackground, // @deprecated alias — use sectionHasCustomBackground
} from "./sectionHasDividerBackground";
