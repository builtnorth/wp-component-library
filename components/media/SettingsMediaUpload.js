/**
 * Settings Media Upload Component
 * Designed for admin settings contexts (not block editor)
 */
import { MediaUpload, MediaUploadCheck } from "@wordpress/media-utils";
import { Button, Flex, Placeholder } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import styled from '@emotion/styled';

const ALLOWED_MEDIA_TYPES = ["image"];

// Styled components
const StyledSettingsMediaUpload = styled.div`
    &__header {
        margin-bottom: 12px;
    }
`;

const StyledLabel = styled.h4`
    margin: 0 0 4px 0;
    font-size: 13px;
    font-weight: 600;
    color: #1e1e1e;
`;

const StyledHelp = styled.p`
    margin: 0;
    font-size: 13px;
    color: #757575;
    line-height: 1.4;
`;

const StyledPreview = styled.div`
    margin-bottom: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    background: #f9f9f9;
`;

const StyledImage = styled.img`
    max-width: 100%;
    height: auto;
    display: block;
    max-height: 200px;
    object-fit: cover;
`;

const StyledPlaceholder = styled(Placeholder)`
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .components-placeholder__label {
        font-size: 13px;
        color: #757575;
    }
    
    .components-placeholder__icon {
        margin-bottom: 8px;
        opacity: 0.3;
    }
`;

const StyledButtons = styled.div`
    .components-flex {
        align-items: center;
    }

    .components-button {
        min-width: 100px;
    }
`;

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
        <StyledSettingsMediaUpload>
            {/* Label and Help */}
            {(label || help) && (
                <div className="settings-media-upload__header">
                    {label && (
                        <StyledLabel>
                            {label}
                        </StyledLabel>
                    )}
                    {help && (
                        <StyledHelp>
                            {help}
                        </StyledHelp>
                    )}
                </div>
            )}

            {/* Image Preview or Placeholder */}
            {showImagePlaceholder && (
                <StyledPreview>
                    {hasImage && imageData ? (
                        <StyledImage
                            src={imageData.source_url}
                            alt={imageData.alt_text || "Selected image"}
                        />
                    ) : (
                        <StyledPlaceholder
                            icon="format-image"
                            label={__("No image selected", "wp-component-library")}
                        />
                    )}
                </StyledPreview>
            )}

            {/* Buttons */}
            <StyledButtons>
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
            </StyledButtons>
        </StyledSettingsMediaUpload>
    );
}

export { SettingsMediaUpload };