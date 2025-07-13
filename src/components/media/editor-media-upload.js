/**
 * Editor Media Upload Component
 */
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Button, Placeholder } from "@wordpress/components";
import { upload } from "@wordpress/icons";

const ALLOWED_MEDIA_TYPES = ["image"];

/**
 * Editor Media Upload
 *
 * @param {object} props
 * @returns {JSX.Element}
 */
function EditorMediaUpload({
    mediaIDs,
    onSelect,
    gallery,
    multiple,
    buttonTitle,
    style,
}) {
    // Handle both ID and object formats for mediaIDs
    const getMediaId = (mediaData) => {
        if (!mediaData) return null;
        if (typeof mediaData === "number") return mediaData;
        if (typeof mediaData === "object" && mediaData.id) return mediaData.id;
        return null;
    };

    const mediaId = getMediaId(mediaIDs);

    return (
        <Placeholder
            style={style}
            withIllustration={true}
            className="placeholder-image placeholder-image--built"
        >
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={onSelect}
                    allowedTypes={ALLOWED_MEDIA_TYPES}
                    value={mediaId}
                    render={({ open }) => (
                        <Button
                            icon={upload}
                            variant="primary"
                            label="Upload or Select Image(s)"
                            showTooltip
                            tooltipPosition="top center"
                            onClick={open}
                        >
                            {buttonTitle}
                        </Button>
                    )}
                    gallery={gallery}
                    multiple={multiple}
                />
            </MediaUploadCheck>
        </Placeholder>
    );
}

export { EditorMediaUpload };