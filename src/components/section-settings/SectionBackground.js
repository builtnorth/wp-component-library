/**
 * WordPress dependencies
 */
import { useSelect } from "@wordpress/data";
import classnames from "classnames";

import { AttachmentImage } from "../attachment-image";

const SectionBackground = ({
    backgroundImage = null,
    focalPoint = null,
    opacity = 15,
    imageStyle = "none",
    useFeaturedImage = false,
    className = "",
    imageSize = "wide_large",
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

    const imageClasses = classnames("background", className, {
        [`has-${imageStyle}`]: imageStyle && imageStyle !== "none",
    });

    const imageId = useFeaturedImage ? featuredImageId : backgroundImage;

    // Early returns for loading states
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
