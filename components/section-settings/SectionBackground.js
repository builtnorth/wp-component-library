/**
 * WordPress dependencies
 */
import { useBlockEditContext } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import classnames from "classnames";

import { AttachmentImage } from "../attachment-image";
import {
	SECTION_BACKGROUND_DEFAULT_IMAGE_STYLE,
	SECTION_BACKGROUND_DEFAULT_OPACITY,
} from "./constants";

const SectionBackground = ({
    backgroundImage = null,
    focalPoint = null,
    opacity = SECTION_BACKGROUND_DEFAULT_OPACITY,
    imageStyle = SECTION_BACKGROUND_DEFAULT_IMAGE_STYLE,
    useFeaturedImage = false,
    className = "",
    imageSize = "wide_large",
    contextPostId = null,
    contextPostType = null,
}) => {
    const blockEditContext = useBlockEditContext()?.context ?? {};

    const effectivePostId =
        contextPostId ?? blockEditContext.postId ?? null;
    const effectivePostType =
        contextPostType ?? blockEditContext.postType ?? null;

    const { featuredImageId } = useSelect(
        (select) => {
            const editor = select("core/editor");
            const editorPostId = editor?.getCurrentPostId?.() ?? null;
            const editorPostType = editor?.getCurrentPostType?.() ?? null;
            const resolvedPostId = effectivePostId || editorPostId;
            const resolvedPostType = effectivePostType || editorPostType;

            let featuredImageId = null;

            if (!useFeaturedImage || !resolvedPostId || !resolvedPostType) {
                return { featuredImageId };
            }

            const loadFromEntity =
                effectivePostId &&
                (editorPostId === null ||
                    Number(effectivePostId) !== Number(editorPostId));

            if (loadFromEntity) {
                const record = select(coreStore).getEntityRecord(
                    "postType",
                    resolvedPostType,
                    resolvedPostId,
                );
                featuredImageId = record?.featured_media || null;
            } else {
                const currentPost = editor?.getCurrentPost?.();
                featuredImageId = currentPost?.featured_media || null;
            }

            return { featuredImageId };
        },
        [useFeaturedImage, effectivePostId, effectivePostType],
    );

    const backgroundStyle = {
        ...(focalPoint && {
            objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
            transform: `translate(${(0.5 - focalPoint.x) * 25}%, ${(0.5 - focalPoint.y) * 25}%) scale(1.25)`,
        }),
        opacity: opacity / 100,
    };

    const imageClasses = classnames("background", className, {
        [`has-${imageStyle}`]: imageStyle && imageStyle !== "none",
    });

    const imageId = useFeaturedImage
        ? featuredImageId || backgroundImage
        : backgroundImage;

    if (!imageId) {
        return null;
    }

    return (
        <div className="background">
            <AttachmentImage
                className={imageClasses}
                imageId={imageId}
                alt=""
                size={imageSize}
                style={backgroundStyle}
                includeFigure={false}
            />
        </div>
    );
};

export { SectionBackground };
