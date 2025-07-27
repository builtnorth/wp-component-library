/**
 * Section Divider Component
 *
 * Component for handling divider settings in WordPress blocks.
 * Adds has-divider-top and has-divider-bottom classes based on selection.
 */

// Main components
export { SectionDividerSettings } from "./SectionDividerSettings";

/**
 * Usage Example:
 *
 * // Use SectionDividerSettings in block edit
 * <SectionDividerSettings
 *     divider={divider}
 *     onDividerChange={(value) => setAttributes({divider: value})}
 * />
 */