/**
 * Media Upload Handler
 *
 * @link https://gist.github.com/5ally/633c4142b77d46068d447cceac3dbc99
 */
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import {
    Button,
    Flex,
    Placeholder,
    ToolbarButton,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { edit, upload } from "@wordpress/icons";
import { AttachmentImage } from "../attachment-image";
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
    return (
        <MediaUploadCheck>
            <MediaUpload
                onSelect={onSelect}
                allowedTypes={ALLOWED_MEDIA_TYPES}
                value={mediaIDs}
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

/**
 * Inspector Media Upload
 *
 * @param {object} props
 * @returns {JSX.Element}
 */
function InspectorMediaUpload({
    mediaIDs,
    onSelect,
    onRemove,
    gallery,
    multiple,
    buttonTitle,
    variant,
    showImagePlaceholder,
    getImageUrlFromMediaIDs,
}) {
    const hasImage = Array.isArray(mediaIDs) ? mediaIDs.length > 0 : !!mediaIDs;

    return (
        <>
            {showImagePlaceholder && !hasImage && (
                <Placeholder
                    withIllustration={true}
                    className="built-editor-panel-image placeholder-image placeholder-image--built"
                />
            )}

            {showImagePlaceholder && hasImage && (
                <div className="built-editor-panel-image">
                    <AttachmentImage
                        className="built-editor-panel-image"
                        imageId={mediaIDs}
                        size="full"
                    />
                </div>
            )}

            <MediaUploadCheck>
                {!hasImage ? (
                    <MediaUpload
                        onSelect={onSelect}
                        allowedTypes={ALLOWED_MEDIA_TYPES}
                        value={mediaIDs}
                        render={({ open }) => (
                            <Button
                                __next40pxDefaultSize
                                className="is-full-width"
                                size="default"
                                variant={variant || "secondary"}
                                onClick={open}
                            >
                                {buttonTitle ||
                                    __(
                                        "Select or Upload Media",
                                        "polaris-blocks",
                                    )}
                            </Button>
                        )}
                        gallery={gallery}
                        multiple={multiple}
                    />
                ) : (
                    <Flex>
                        <MediaUpload
                            onSelect={onSelect}
                            allowedTypes={ALLOWED_MEDIA_TYPES}
                            value={mediaIDs}
                            render={({ open }) => (
                                <Button
                                    __next40pxDefaultSize
                                    size="default"
                                    className="is-full-width"
                                    variant="secondary"
                                    onClick={open}
                                >
                                    {__("Edit/Replace", "polaris-blocks")}
                                </Button>
                            )}
                            gallery={gallery}
                            multiple={multiple}
                        />
                        <Button
                            __next40pxDefaultSize
                            size="default"
                            variant="secondary"
                            className="is-full-width"
                            onClick={onRemove}
                            isDestructive
                        >
                            {__("Remove", "polaris-blocks")}
                        </Button>
                    </Flex>
                )}
            </MediaUploadCheck>
        </>
    );
}

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
                    value={mediaIDs}
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

// Export all components
export { EditorMediaUpload, InspectorMediaUpload, ToolbarMediaUpload };
