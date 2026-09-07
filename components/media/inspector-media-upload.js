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

/**
 * CSS aspect-ratio accepts a number (e.g. 1.91) or a ratio string ("16/9").
 *
 * @param {number|string} ratio
 * @returns {string}
 */
function toCssAspectRatio(ratio) {
	if (typeof ratio === "number" && Number.isFinite(ratio) && ratio > 0) {
		return String(ratio);
	}
	if (typeof ratio === "string" && ratio.trim() !== "") {
		return ratio.trim();
	}
	return String(16 / 9);
}

// Styled components
const StyledWrapper = styled.div`
	max-width: ${(props) =>
		props.maxWidth != null && props.maxWidth !== ""
			? typeof props.maxWidth === "number"
				? `${props.maxWidth}px`
				: props.maxWidth
			: "none"};

	/* Shared frame so placeholder and selected image occupy the same box. */
	.built-inspector-media-preview {
		width: 100%;
		aspect-ratio: ${(props) => props.$aspectRatio};
		overflow: hidden;
		box-sizing: border-box;
		background: #f0f0f0;
	}

	.built-inspector-media-preview .components-placeholder {
		width: 100%;
		height: 100%;
		min-height: 0 !important;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.built-inspector-media-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
	}
`;

const StyledImageContainer = styled.div`
	width: 100%;
	height: 100%;

	.components-flex {
		height: auto;
	}
`;

const StyledActions = styled.div`
	margin-top: 12px;
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
 * @param {number|string|null} [props.maxWidth] Optional max width for the
 *   preview/placeholder (number = px). Default: none (full width).
 * @param {number|string} [props.aspectRatio=16/9] Locked preview box ratio;
 *   selected images use object-fit: cover inside the same box as the placeholder.
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
	maxWidth = null,
}) {
	// Handle ID, [id], and attachment object formats for mediaIDs.
	const getMediaId = (mediaData) => {
		if (!mediaData) return null;
		if (typeof mediaData === "number") return mediaData;
		if (typeof mediaData === "string" && /^\d+$/.test(mediaData)) {
			return parseInt(mediaData, 10);
		}
		if (Array.isArray(mediaData)) {
			return getMediaId(mediaData[0]);
		}
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
	const cssAspectRatio = toCssAspectRatio(aspectRatio);

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
				<div className="built-inspector-media-preview">
					<Placeholder
						withIllustration={true}
						className="built-editor-panel-image placeholder-image placeholder-image--built"
					/>
				</div>
			)}

			{showImagePlaceholder && hasImage && (
				<div className="built-inspector-media-preview">
					<StyledImageContainer className="built-editor-panel-image">
						<AttachmentImage
							className="built-editor-panel-image"
							imageId={mediaId}
							size="wide_medium"
							includeFigure={false}
							aspectRatio={cssAspectRatio}
						/>
					</StyledImageContainer>
				</div>
			)}

			{showImagePlaceholder && hasFeatureImage && !hasImage && (
				<div className="built-inspector-media-preview">
					<StyledImageContainer className="built-editor-panel-image">
						<AttachmentImage
							className="built-editor-panel-image"
							imageId={featureImage.id || featureImage}
							size="wide_medium"
							includeFigure={false}
							aspectRatio={cssAspectRatio}
						/>
					</StyledImageContainer>
				</div>
			)}
		</>
	);

	const buttons = (
		<StyledActions>
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
		</StyledActions>
	);

	// If label or help text is provided, wrap in BaseControl
	if (label || help) {
		return (
			<StyledWrapper maxWidth={maxWidth} $aspectRatio={cssAspectRatio}>
				<BaseControl id={controlId} label={label} help={help}>
					{imageDisplay}
				</BaseControl>
				{buttons}
			</StyledWrapper>
		);
	}

	// Otherwise, return controls without BaseControl wrapper
	return (
		<StyledWrapper maxWidth={maxWidth} $aspectRatio={cssAspectRatio}>
			<Flex direction="column" expanded={true} style={{ flexGrow: 1 }}>
				{imageDisplay}
				{buttons}
			</Flex>
		</StyledWrapper>
	);
}

export { InspectorMediaUpload };
