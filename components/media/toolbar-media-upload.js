/**
 * Toolbar Media Upload Component
 */
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { ToolbarButton } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { edit } from "@wordpress/icons";

const ALLOWED_MEDIA_TYPES = ["image"];

/**
 * Toolbar Media Upload
 *
 * @param {object} props
 * @returns {JSX.Element}
 */
function ToolbarMediaUpload({
    mediaIDs,
    onSelect,
    gallery,
    multiple,
    buttonTitle,
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
        <MediaUploadCheck>
            <MediaUpload
                onSelect={onSelect}
                allowedTypes={ALLOWED_MEDIA_TYPES}
                value={mediaId}
                render={({ open }) => (
                    <ToolbarButton
                        icon={edit}
                        label={__("Edit/Replace Media", "polaris-blocks")}
                        onClick={open}
                    />
                )}
                gallery={gallery}
                multiple={multiple}
            />
        </MediaUploadCheck>
    );
}

export { ToolbarMediaUpload };