/**
 * Section Settings Components
 *
 * Modular components for handling background media settings in WordPress blocks.
 * Components can be used independently or together as needed.
 */

// Main components
export { SectionBackground } from "./SectionBackground";
export { SectionSettings } from "./SectionSettings";

// Individual control components
export {
    FocalPointControl,
    ImageSourceControl,
    MediaSelectControl,
    OpacityControl,
    StyleControl,
} from "./controls";

/**
 * Usage Examples:
 *
 * // Use SectionBackground independently in any block
 * <SectionBackground
 *     backgroundImage={123}
 *     focalPoint={{x: 0.3, y: 0.7}}
 *     opacity={80}
 *     imageStyle="blur"
 * />
 *
 * // Use SectionSettings with custom handlers
 * <SectionSettings
 *     backgroundImage={backgroundImage}
 *     focalPoint={focalPoint}
 *     onImageSelect={(image) => setAttributes({backgroundImage: image.id})}
 *     onFocalPointChange={(point) => setAttributes({focalPoint: point})}
 *     enableFeaturedImage={true}
 *     enableMediaStyle={true}
 * />
 *
 * // Use individual controls for custom panels
 * <ToolsPanel label="My Custom Panel">
 *     <MediaSelectControl
 *         backgroundImage={backgroundImage}
 *         onSelect={handleSelect}
 *         onRemove={handleRemove}
 *     />
 *     <OpacityControl
 *         opacity={opacity}
 *         onChange={handleOpacityChange}
 *     />
 * </ToolsPanel>
 */
