/**
 * Section Pattern Components
 *
 * Modular components for handling pattern settings in WordPress blocks.
 * Components can be used independently or together as needed.
 */

// Main components
export { SectionPattern } from "./SectionPattern";
export { SectionPatternSettings } from "./SectionPatternSettings";

/**
 * Usage Examples:
 *
 * // Use SectionPattern independently in any block
 * <SectionPattern
 *     pattern="dots"
 *     className="my-pattern"
 * />
 *
 * // Use SectionPatternSettings with custom handlers
 * <SectionPatternSettings
 *     pattern={pattern}
 *     onPatternChange={(value) => setAttributes({pattern: value})}
 * />
 */
