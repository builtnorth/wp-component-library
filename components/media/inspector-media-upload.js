/**
 * Inspector Media Upload Component
 */
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Button, Flex, Placeholder } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { AttachmentImage } from "../attachment-image";
import styled from '@emotion/styled';

// Styled components
const StyledImageContainer = styled.div`
    .components-flex {
        height: auto;
    }
`;

const ALLOWED_MEDIA_TYPES = ["image"];

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
	showFeatureImage = false,
	featureImage = null,
	label = null,
	help = null,
	showImagePlaceholder,
	getImageUrlFromMediaIDs,
	aspectRatio = 16 / 9,
}) {
	// Handle both ID and object formats for mediaIDs
	const getMediaId = (mediaData) => {
		if (!mediaData) return null;
		if (typeof mediaData === "number") return mediaData;
		if (typeof mediaData === "object" && mediaData.id) return mediaData.id;
		return null;
	};

	const mediaId = getMediaId(mediaIDs);
	const hasImage = !!mediaId;
	const hasFeatureImage = !!(
		showFeatureImage &&
		featureImage &&
		featureImage !== 0
	);

	return (
		<Flex direction="column" expanded={true} style={{ flexGrow: 1 }}>
			{(label || help) && (
				<div className="built-label-and-help">
					{label && <p className="built-pseudo-label">{label}</p>}
					{help && <p className="built-help-text">{help}</p>}
				</div>
			)}
			{showImagePlaceholder && !hasImage && !hasFeatureImage && (
				<Placeholder
					withIllustration={true}
					className="built-editor-panel-image placeholder-image placeholder-image--built"
					style={{ aspectRatio: aspectRatio }}
				/>
			)}

			{showImagePlaceholder && hasImage && (
				<StyledImageContainer className="built-editor-panel-image">
					<AttachmentImage
						className="built-editor-panel-image"
						imageId={mediaId}
						size="wide_medium"
						aspectRatio={aspectRatio}
					/>
				</StyledImageContainer>
			)}

			{showImagePlaceholder && hasFeatureImage && !hasImage && (
				<StyledImageContainer className="built-editor-panel-image">
					<AttachmentImage
						className="built-editor-panel-image"
						imageId={featureImage}
						size="wide_medium"
						aspectRatio={aspectRatio}
					/>
				</StyledImageContainer>
			)}

			<MediaUploadCheck>
				{!hasImage ? (
					<MediaUpload
						onSelect={onSelect}
						allowedTypes={ALLOWED_MEDIA_TYPES}
						value={mediaId}
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
					<Flex direction="column">
						<MediaUpload
							onSelect={onSelect}
							allowedTypes={ALLOWED_MEDIA_TYPES}
							value={mediaId}
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
		</Flex>
	);
}

export { InspectorMediaUpload };
