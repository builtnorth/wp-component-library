/**
 * Inspector Media Upload Component
 *
 * Uses wp.media() directly instead of the block editor's MediaUpload
 * slot, ensuring it works on both block editor and settings pages.
 */
import styled from "@emotion/styled";
import { BaseControl, Button, Flex, Placeholder } from "@wordpress/components";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { AttachmentImage } from "../attachment-image";

// Styled components
const StyledWrapper = styled.div`
	img {
		width: 100%;
		height: auto;
	}
`;

const StyledImageContainer = styled.div`
	.components-flex {
		height: auto;
	}
`;

const ALLOWED_MEDIA_TYPES = ["image"];

/**
 * Hook to open the native wp.media frame.
 */
function useMediaOpen({ onSelect, multiple, allowedTypes }) {
	return useCallback(() => {
		if (typeof wp === "undefined" || !wp.media) return;

		const frame = wp.media({
			title: __("Select or Upload Media", "wp-component-library"),
			multiple: multiple || false,
			library: { type: allowedTypes || ["image"] },
			button: { text: __("Select", "wp-component-library") },
		});

		frame.on("select", () => {
			const selection = frame.state().get("selection");
			if (multiple) {
				onSelect(selection.map((att) => att.toJSON()));
			} else {
				onSelect(selection.first().toJSON());
			}
		});

		frame.open();
	}, [onSelect, multiple, allowedTypes]);
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

	// Generate a unique ID for BaseControl
	const controlId = `inspector-media-upload-${mediaId || "new"}`;

	// Open native wp.media frame
	const openMedia = useMediaOpen({
		onSelect,
		multiple,
		allowedTypes: ALLOWED_MEDIA_TYPES,
	});

	const imageDisplay = (
		<>
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
						includeFigure={false}
						aspectRatio={aspectRatio}
					/>
				</StyledImageContainer>
			)}

			{showImagePlaceholder && hasFeatureImage && !hasImage && (
				<StyledImageContainer className="built-editor-panel-image">
					<AttachmentImage
						className="built-editor-panel-image"
						imageId={featureImage.id || featureImage}
						size="wide_medium"
						aspectRatio={aspectRatio}
					/>
				</StyledImageContainer>
			)}
		</>
	);

	const buttons = (
		<>
			{!hasImage ? (
				<Button
					__next40pxDefaultSize
					className="is-full-width"
					size="default"
					variant={variant || "secondary"}
					onClick={openMedia}
				>
					{buttonTitle ||
						__("Select or Upload Media", "wp-component-library")}
				</Button>
			) : (
				<Flex>
					<Button
						__next40pxDefaultSize
						size="default"
						className="is-full-width"
						variant="secondary"
						onClick={openMedia}
					>
						{__("Edit/Replace", "wp-component-library")}
					</Button>
					<Button
						__next40pxDefaultSize
						size="default"
						variant="secondary"
						className="is-full-width"
						onClick={onRemove}
						isDestructive
					>
						{__("Remove", "wp-component-library")}
					</Button>
				</Flex>
			)}
		</>
	);

	// If label or help text is provided, wrap in BaseControl
	if (label || help) {
		return (
			<StyledWrapper>
				<BaseControl id={controlId} label={label} help={help}>
					{imageDisplay}
				</BaseControl>
				{buttons}
			</StyledWrapper>
		);
	}

	// Otherwise, return controls without BaseControl wrapper
	return (
		<StyledWrapper>
			<Flex direction="column" expanded={true} style={{ flexGrow: 1 }}>
				{imageDisplay}
				{buttons}
			</Flex>
		</StyledWrapper>
	);
}

export { InspectorMediaUpload };
