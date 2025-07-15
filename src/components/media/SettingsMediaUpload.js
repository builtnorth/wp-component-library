/**
 * Settings Media Upload Component
 * Designed for admin settings contexts (not block editor)
 */
import { MediaUpload, MediaUploadCheck } from "@wordpress/media-utils";
import { Button, Flex, Placeholder } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

const ALLOWED_MEDIA_TYPES = ["image"];

/**
 * Settings Media Upload
 * 
 * @param {object} props
 * @param {number|null} props.imageId - The ID of the selected image
 * @param {Function} props.onSelect - Callback when image is selected
 * @param {Function} props.onRemove - Callback when image is removed
 * @param {string} props.label - Label for the control
 * @param {string} props.help - Help text for the control
 * @param {string} props.buttonTitle - Custom button text
 * @param {boolean} props.showImagePlaceholder - Whether to show image preview
 * @param {string} props.size - Image size for preview (default: 'medium')
 * @returns {JSX.Element}
 */
function SettingsMediaUpload({
    imageId,
    onSelect,
    onRemove,
    label = null,
    help = null,
    buttonTitle = null,
    showImagePlaceholder = true,
    size = "medium",
}) {
    // Get image data for preview
    const imageData = useSelect(
        (select) => {
            if (!imageId) return null;
            return select("core").getMedia(imageId);
        },
        [imageId]
    );

    const hasImage = !!imageId;

    return (
        <div className="settings-media-upload">
            {/* Label and Help */}
            {(label || help) && (
                <div className="settings-media-upload__header">
                    {label && (
                        <h4 className="settings-media-upload__label">
                            {label}
                        </h4>
                    )}
                    {help && (
                        <p className="settings-media-upload__help">
                            {help}
                        </p>
                    )}
                </div>
            )}

            {/* Image Preview or Placeholder */}
            {showImagePlaceholder && (
                <div className="settings-media-upload__preview">
                    {hasImage && imageData ? (
                        <img
                            src={imageData.source_url}
                            alt={imageData.alt_text || "Selected image"}
                            className="settings-media-upload__image"
                        />
                    ) : (
                        <Placeholder
                            icon="format-image"
                            label={__("No image selected", "wp-component-library")}
                            className="settings-media-upload__placeholder"
                        />
                    )}
                </div>
            )}

            {/* Buttons */}
            <div className="settings-media-upload__buttons">
                <MediaUploadCheck>
                    <Flex gap={2}>
                        <MediaUpload
                            onSelect={onSelect}
                            allowedTypes={ALLOWED_MEDIA_TYPES}
                            value={imageId}
                            render={({ open }) => (
                                <Button
                                    variant="secondary"
                                    onClick={open}
                                    size="default"
                                >
                                    {buttonTitle || 
                                        (hasImage 
                                            ? __("Change Image", "wp-component-library")
                                            : __("Upload Image", "wp-component-library")
                                        )
                                    }
                                </Button>
                            )}
                        />
                        
                        {hasImage && (
                            <Button
                                variant="secondary"
                                isDestructive={true}
                                onClick={onRemove}
                                size="default"
                            >
                                {__("Remove Image", "wp-component-library")}
                            </Button>
                        )}
                    </Flex>
                </MediaUploadCheck>
            </div>
        </div>
    );
}

export { SettingsMediaUpload };