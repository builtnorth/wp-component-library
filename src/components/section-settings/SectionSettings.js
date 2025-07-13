/**
 * WordPress dependencies
 */
import { InspectorControls } from "@wordpress/block-editor";
import { __experimentalToolsPanel as ToolsPanel } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import {
    FocalPointControl,
    ImageSourceControl,
    MediaSelectControl,
    OpacityControl,
    ShowCaptionControl,
    StyleControl,
} from "./controls";

const SectionSettings = ({
    // Current values
    backgroundImage = null,
    focalPoint = null,
    opacity = 15,
    imageStyle = "none",
    useFeaturedImage = false,
    showCaption = false,

    // Event handlers
    onImageSelect,
    onImageRemove,
    onFocalPointChange,
    onOpacityChange,
    onImageStyleChange,
    onFeaturedImageToggle,
    onShowCaptionChange,

    // Feature flags
    enableFeaturedImage = false,
    enableMediaStyle = false,
    enableMediaOpacity = false,
    enableShowCaption = false,

    // Panel configuration
    panelTitle = __("Background Media", "polaris-blocks"),
    group = "styles",
    className = "built-inspector-section-settings",
}) => {
    const limitEditorSettings =
        window.polaris_localize?.limit_editor_settings || false;

    const { imageUrl, featuredImageUrl } = useSelect(
        (select) => {
            const { getMedia, getEntityRecord } = select("core");
            const postId = select("core/editor")?.getCurrentPostId();

            let featuredImageData = null;
            if (postId) {
                const post = getEntityRecord("postType", "post", postId);
                if (post?.featured_media) {
                    featuredImageData = getMedia(post.featured_media);
                }
            }

            return {
                imageUrl: backgroundImage
                    ? getMedia(backgroundImage)?.source_url
                    : null,
                featuredImageUrl: featuredImageData?.source_url,
            };
        },
        [backgroundImage],
    );

    const displayImageUrl = useFeaturedImage ? featuredImageUrl : imageUrl;

    // Reset function for ToolsPanel
    const resetAll = () => {
        if (enableFeaturedImage && onFeaturedImageToggle) {
            onFeaturedImageToggle(false);
        }
        if (onFocalPointChange) {
            onFocalPointChange({ x: 0.5, y: 0.5 });
        }
        if (enableMediaOpacity && onOpacityChange) {
            onOpacityChange(15);
        }
        if (enableMediaStyle && onImageStyleChange) {
            onImageStyleChange("none");
        }
        if (enableShowCaption && onShowCaptionChange) {
            onShowCaptionChange(false);
        }
        if (onImageRemove) {
            onImageRemove();
        }
    };

    return (
        <Fragment>
            <InspectorControls group={group}>
                <ToolsPanel
                    label={panelTitle}
                    resetAll={resetAll}
                    className={className}
                >
                    {enableFeaturedImage && onFeaturedImageToggle && (
                        <ImageSourceControl
                            useFeaturedImage={useFeaturedImage}
                            onToggle={onFeaturedImageToggle}
                            isShownByDefault={true}
                        />
                    )}

                    {(useFeaturedImage || backgroundImage) && (
                        <Fragment>
                            {onFocalPointChange && (
                                <FocalPointControl
                                    focalPoint={focalPoint}
                                    onChange={onFocalPointChange}
                                    imageUrl={displayImageUrl}
                                    isShownByDefault={false}
                                />
                            )}

                            {!limitEditorSettings && (
                                <Fragment>
                                    {enableMediaOpacity && onOpacityChange && (
                                        <OpacityControl
                                            opacity={opacity}
                                            onChange={onOpacityChange}
                                            isShownByDefault={false}
                                        />
                                    )}

                                    {enableMediaStyle && onImageStyleChange && (
                                        <StyleControl
                                            imageStyle={imageStyle}
                                            onChange={onImageStyleChange}
                                            isShownByDefault={false}
                                        />
                                    )}

                                    {enableShowCaption &&
                                        onShowCaptionChange && (
                                            <ShowCaptionControl
                                                showCaption={showCaption}
                                                onChange={onShowCaptionChange}
                                                isShownByDefault={false}
                                            />
                                        )}
                                </Fragment>
                            )}
                        </Fragment>
                    )}

                    {!useFeaturedImage && onImageSelect && onImageRemove && (
                        <MediaSelectControl
                            backgroundImage={backgroundImage}
                            onSelect={onImageSelect}
                            onRemove={onImageRemove}
                            isShownByDefault={true}
                        />
                    )}
                </ToolsPanel>
            </InspectorControls>
        </Fragment>
    );
};

export { SectionSettings };
