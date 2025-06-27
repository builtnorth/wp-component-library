/**
 * WordPress dependencies
 */

import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
    FocalPointPicker,
    PanelRow,
    RangeControl,
    SelectControl,
    ToggleControl,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import classnames from "classnames";

import { AttachmentImage } from "../attachment-image";
import { InspectorMediaUpload } from "../media";

const SectionSettings = (props) => {
    const {
        backgroundImage,
        handleImageSelect,
        handleImageRemove,
        focalPoint,
        handleFocalPointChange,
        opacity,
        handleOpacityChange,
        imageStyle,
        handleImageStyleChange,
        blockName,
        useFeaturedImage,
        handleFeaturedImageToggle,
    } = props;

    const limitEditorSettings =
        window.polaris_localize?.limit_editor_settings || false;

    const { imageUrl, featuredImageUrl } = useSelect(
        (select) => {
            const { getMedia, getPostType, getEntityRecord } = select("core");
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

    // Check for both possible block names
    const isHeroBlock =
        blockName === "polaris/hero" || blockName === "polaris-blocks/hero";
    const displayImageUrl = useFeaturedImage ? featuredImageUrl : imageUrl;

    // Default values for reset functionality
    const defaultUseFeaturedImage = false;
    const defaultFocalPoint = { x: 0.5, y: 0.5 };
    const defaultOpacity = 15;
    const defaultImageStyle = "none";
    const defaultBackgroundImage = null;

    // Reset function for ToolsPanel
    const resetAll = () => {
        if (isHeroBlock) {
            handleFeaturedImageToggle(defaultUseFeaturedImage);
        }
        handleFocalPointChange(defaultFocalPoint);
        handleOpacityChange(defaultOpacity);
        handleImageStyleChange(defaultImageStyle);
        handleImageRemove(); // Reset background image
    };

    return (
        <Fragment>
            <InspectorControls group="styles">
                <ToolsPanel
                    label={__("Background Media", "polaris-blocks")}
                    resetAll={resetAll}
                    className="built-inspector-image-upload"
                >
                    {isHeroBlock && (
                        <ToolsPanelItem
                            hasValue={() =>
                                useFeaturedImage !== defaultUseFeaturedImage
                            }
                            label={__("Use Featured Image", "polaris-blocks")}
                            onDeselect={() =>
                                handleFeaturedImageToggle(
                                    defaultUseFeaturedImage,
                                )
                            }
                            isShownByDefault={true}
                        >
                            <ToggleControl
                                label={__(
                                    "Use Featured Image",
                                    "polaris-blocks",
                                )}
                                checked={useFeaturedImage}
                                onChange={handleFeaturedImageToggle}
                            />
                        </ToolsPanelItem>
                    )}

                    {!useFeaturedImage && (
                        <ToolsPanelItem
                            hasValue={() =>
                                backgroundImage !== defaultBackgroundImage
                            }
                            label={__("Background Media", "polaris-blocks")}
                            onDeselect={() => handleImageRemove()}
                            isShownByDefault={true}
                        >
                            {!backgroundImage && (
                                <PanelRow>
                                    <InspectorMediaUpload
                                        buttonTitle={__(
                                            "Select or Upload Media",
                                            "polaris-blocks",
                                        )}
                                        gallery={false}
                                        multiple={false}
                                        mediaIDs={backgroundImage}
                                        onSelect={handleImageSelect}
                                        onRemove={handleImageRemove}
                                    />
                                </PanelRow>
                            )}
                            {backgroundImage && (
                                <PanelRow>
                                    <InspectorMediaUpload
                                        buttonTitle={__(
                                            "Replace Media",
                                            "polaris-blocks",
                                        )}
                                        gallery={false}
                                        multiple={false}
                                        mediaIDs={backgroundImage}
                                        onSelect={handleImageSelect}
                                        onRemove={handleImageRemove}
                                    />
                                </PanelRow>
                            )}
                        </ToolsPanelItem>
                    )}

                    {(useFeaturedImage || backgroundImage) && (
                        <Fragment>
                            {displayImageUrl && (
                                <ToolsPanelItem
                                    hasValue={() => {
                                        if (!focalPoint) return false;
                                        return (
                                            focalPoint.x !==
                                                defaultFocalPoint.x ||
                                            focalPoint.y !== defaultFocalPoint.y
                                        );
                                    }}
                                    label={__(
                                        "Media Focal Point",
                                        "polaris-blocks",
                                    )}
                                    onDeselect={() =>
                                        handleFocalPointChange(
                                            defaultFocalPoint,
                                        )
                                    }
                                    isShownByDefault={true}
                                >
                                    <FocalPointPicker
                                        __nextHasNoMarginBottom
                                        hideLabelFromVision={true}
                                        label={__(
                                            "Media Focal Point",
                                            "polaris-blocks",
                                        )}
                                        url={displayImageUrl}
                                        value={focalPoint || defaultFocalPoint}
                                        onDragStart={handleFocalPointChange}
                                        onDrag={handleFocalPointChange}
                                        onChange={handleFocalPointChange}
                                    />
                                </ToolsPanelItem>
                            )}

                            {!limitEditorSettings && (
                                <Fragment>
                                    <ToolsPanelItem
                                        hasValue={() =>
                                            opacity !== defaultOpacity
                                        }
                                        label={__(
                                            "Media Opacity",
                                            "polaris-blocks",
                                        )}
                                        onDeselect={() =>
                                            handleOpacityChange(defaultOpacity)
                                        }
                                        isShownByDefault={false}
                                    >
                                        <RangeControl
                                            __nextHasNoMarginBottom
                                            label={__(
                                                "Media Opacity",
                                                "polaris-blocks",
                                            )}
                                            value={opacity}
                                            onChange={handleOpacityChange}
                                            min={0}
                                            max={100}
                                            initialPosition={15}
                                        />
                                    </ToolsPanelItem>

                                    <ToolsPanelItem
                                        hasValue={() =>
                                            imageStyle !== defaultImageStyle
                                        }
                                        label={__(
                                            "Media Style",
                                            "polaris-blocks",
                                        )}
                                        onDeselect={() =>
                                            handleImageStyleChange(
                                                defaultImageStyle,
                                            )
                                        }
                                        isShownByDefault={false}
                                    >
                                        <SelectControl
                                            label={__(
                                                "Media Style",
                                                "polaris-blocks",
                                            )}
                                            value={imageStyle}
                                            options={[
                                                {
                                                    label: __(
                                                        "None",
                                                        "polaris-blocks",
                                                    ),
                                                    value: "none",
                                                },
                                                {
                                                    label: __(
                                                        "Blur",
                                                        "polaris-blocks",
                                                    ),
                                                    value: "blur",
                                                },
                                                {
                                                    label: __(
                                                        "Grayscale",
                                                        "polaris-blocks",
                                                    ),
                                                    value: "grayscale",
                                                },
                                                {
                                                    label: __(
                                                        "Blur + Grayscale",
                                                        "polaris-blocks",
                                                    ),
                                                    value: "blur-grayscale",
                                                },
                                            ]}
                                            onChange={handleImageStyleChange}
                                        />
                                    </ToolsPanelItem>
                                </Fragment>
                            )}
                        </Fragment>
                    )}
                </ToolsPanel>
            </InspectorControls>
        </Fragment>
    );
};

const SectionBackground = ({
    backgroundImage,
    focalPoint,
    opacity,
    imageStyle,
    useFeaturedImage,
}) => {
    const { featuredImageId, postId, currentPost } = useSelect(
        (select) => {
            const postId = select("core/editor")?.getCurrentPostId();
            const currentPost = select("core/editor")?.getCurrentPost();
            let featuredImageId = null;
            if (useFeaturedImage && currentPost && currentPost.featured_media) {
                featuredImageId = currentPost.featured_media;
            }
            return { featuredImageId, postId, currentPost };
        },
        [useFeaturedImage],
    );

    const backgroundStyle = {
        ...(focalPoint && {
            objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
            transform: `translate(${(0.5 - focalPoint.x) * 25}%, ${(0.5 - focalPoint.y) * 25}%) scale(1.25)`,
        }),
        opacity: opacity / 100,
    };

    const imageClasses = classnames("section-background", {
        [`has-${imageStyle}`]: imageStyle && imageStyle !== "none",
    });

    const imageId = useFeaturedImage ? featuredImageId : backgroundImage;
    if (useFeaturedImage && !postId) {
        console.log("[SectionBackground] Waiting for postId...");
        return null;
    }
    if (useFeaturedImage && postId && !currentPost) {
        console.log("[SectionBackground] Waiting for currentPost data...");
        return null;
    }
    if (!imageId) return null;

    return (
        <div className="section-background">
            <AttachmentImage
                className={imageClasses}
                imageId={imageId}
                alt=""
                size="wide_large"
                style={backgroundStyle}
                includeFigure={false}
            />
        </div>
    );
};

const SectionWrapper = ({
    attributes,
    setAttributes,
    className,
    children,
    blockName,
}) => {
    const {
        backgroundImage,
        focalPoint,
        opacity,
        imageStyle,
        useFeaturedImage,
    } = attributes;

    const handleImageSelect = (image) => {
        setAttributes({
            backgroundImage: image.id,
            focalPoint: focalPoint || { x: 0.5, y: 0.5 },
        });
    };

    const handleImageRemove = () => {
        setAttributes({
            backgroundImage: null,
            focalPoint: null,
        });
    };

    const handleFocalPointChange = (newFocalPoint) => {
        setAttributes({ focalPoint: newFocalPoint });
    };

    const handleOpacityChange = (newOpacity) => {
        setAttributes({ opacity: newOpacity });
    };

    const handleImageStyleChange = (newStyle) => {
        setAttributes({ imageStyle: newStyle });
    };

    const handleFeaturedImageToggle = (value) => {
        setAttributes({ useFeaturedImage: value });
    };

    const customClass =
        `${className || ""} ${backgroundImage || useFeaturedImage ? "has-background-image" : ""}`.trim();

    const blockProps = useBlockProps({
        className: customClass,
    });

    return (
        <>
            <SectionSettings
                backgroundImage={backgroundImage}
                handleImageSelect={handleImageSelect}
                handleImageRemove={handleImageRemove}
                handleFocalPointChange={handleFocalPointChange}
                focalPoint={focalPoint}
                opacity={opacity}
                handleOpacityChange={handleOpacityChange}
                imageStyle={imageStyle}
                handleImageStyleChange={handleImageStyleChange}
                setAttributes={setAttributes}
                blockName={blockName}
                useFeaturedImage={useFeaturedImage}
                handleFeaturedImageToggle={handleFeaturedImageToggle}
            />
            <section {...blockProps}>
                {children}
                <SectionBackground
                    backgroundImage={backgroundImage}
                    focalPoint={focalPoint}
                    opacity={opacity}
                    imageStyle={imageStyle}
                    useFeaturedImage={useFeaturedImage}
                />
            </section>
        </>
    );
};

// Export individual components
export { SectionBackground, SectionSettings, SectionWrapper };
