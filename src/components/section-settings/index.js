/**
 * WordPress dependencies
 */

import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
    Button,
    FocalPointPicker,
    PanelBody,
    PanelRow,
    RangeControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { AttachmentImage } from "../attachment-image";
import { InspectorMediaUpload } from "../media-upload";

const SectionSettings = (props) => {
    const {
        backgroundImage,
        handleImageSelect,
        handleImageRemove,
        focalPoint,
        handleFocalPointChange,
        opacity,
        handleOpacityChange,
    } = props;

    const imageUrl = useSelect(
        (select) => {
            if (!backgroundImage) return null;
            const image = select("core").getMedia(backgroundImage);
            return image?.source_url;
        },
        [backgroundImage],
    );

    return (
        <Fragment>
            <InspectorControls group="styles">
                <PanelBody
                    title="Background Settings"
                    className="built-inspector-image-upload"
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
                            />
                        </PanelRow>
                    )}
                    {backgroundImage && (
                        <Fragment>
                            <PanelRow>
                                <FocalPointPicker
                                    __nextHasNoMarginBottom
                                    // help={__(
                                    //     "This is the point that will be used for the background image.",
                                    //     "polaris-blocks",
                                    // )}
                                    label={__(
                                        "Image Focal Point",
                                        "polaris-blocks",
                                    )}
                                    url={imageUrl}
                                    value={focalPoint}
                                    onDragStart={handleFocalPointChange}
                                    onDrag={handleFocalPointChange}
                                    onChange={handleFocalPointChange}
                                />
                            </PanelRow>

                            <RangeControl
                                label={__("Image Opacity", "polaris-blocks")}
                                value={opacity}
                                onChange={handleOpacityChange}
                                min={0}
                                max={100}
                                initialPosition={15}
                            />

                            <PanelRow>
                                <InspectorMediaUpload
                                    variant="primary"
                                    buttonTitle={__(
                                        "Replace Media",
                                        "polaris-blocks",
                                    )}
                                    gallery={false}
                                    multiple={false}
                                    mediaIDs={backgroundImage}
                                    onSelect={handleImageSelect}
                                />
                                <Button
                                    variant="secondary"
                                    size="compact"
                                    isDestructive
                                    text={__("Remove Media")}
                                    onClick={handleImageRemove}
                                />
                            </PanelRow>
                        </Fragment>
                    )}
                </PanelBody>
            </InspectorControls>
        </Fragment>
    );
};

const SectionBackground = ({ backgroundImage, focalPoint, opacity }) => {
    const backgroundStyle = {
        ...(focalPoint && {
            objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
        }),
        opacity: opacity / 100, // Convert percentage to decimal
    };

    return (
        <div className="section__background">
            <AttachmentImage
                className="section__background--image"
                imageId={backgroundImage}
                alt=""
                size="wide_large"
                style={backgroundStyle}
            />
        </div>
    );
};

const SectionWrapper = ({ attributes, setAttributes, className, children }) => {
    const { backgroundImage, focalPoint, opacity } = attributes; // Use default if not set

    const handleImageSelect = (image) => {
        setAttributes({
            backgroundImage: image.id,
            focalPoint: focalPoint || { x: 0.5, y: 0.5 },
        });
    };

    const handleImageRemove = () => {
        setAttributes({
            backgroundImage: null,
            focalPoint: null, // Reset focal point when removing image
        });
    };

    const handleFocalPointChange = (newFocalPoint) => {
        setAttributes({ focalPoint: newFocalPoint });
    };

    const handleOpacityChange = (newOpacity) => {
        setAttributes({ opacity: newOpacity });
    };

    const customClass =
        `${className || ""} ${backgroundImage ? "has-background-image" : ""}`.trim();

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
                setAttributes={setAttributes}
            />
            <section {...blockProps}>
                {children}
                <SectionBackground
                    backgroundImage={backgroundImage}
                    focalPoint={focalPoint}
                    opacity={opacity}
                />
            </section>
        </>
    );
};

// Export individual components
export { SectionBackground, SectionSettings, SectionWrapper };
