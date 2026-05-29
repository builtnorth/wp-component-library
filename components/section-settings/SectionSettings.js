/**
 * WordPress dependencies
 */
import { InspectorControls } from "@wordpress/block-editor";
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { InspectorMediaUpload } from "../media";
import {
	FocalPointControl,
	ImageSourceToggle,
	MediaSelectControl,
	OpacityControl,
	ShowCaptionControl,
	StyleControl,
} from "./controls";

import {
	SECTION_BACKGROUND_DEFAULT_IMAGE_STYLE,
	SECTION_BACKGROUND_DEFAULT_OPACITY,
} from "./constants";

const SectionSettings = ({
	// Current values
	backgroundImage = null,
	focalPoint = null,
	opacity = SECTION_BACKGROUND_DEFAULT_OPACITY,
	imageStyle = SECTION_BACKGROUND_DEFAULT_IMAGE_STYLE,
	useFeaturedImage = false,
	showCaption = false,

	// Event handlers
	onImageSelect,
	onImageRemove,
	onFocalPointChange,
	onOpacityChange,
	onImageStyleChange,
	onFeaturedImageToggle,
	onShowCaptionChange,

	// Feature flags
	enableFeaturedImage = false,
	enableMediaStyle = false,
	enableMediaOpacity = false,
	enableShowCaption = false,

	// Panel configuration
	panelTitle = __("Background Media", "wp-component-library"),
	group = "styles",
	className = "built-inspector-section-settings",
}) => {
	const limitEditorSettings =
		window.polaris_localize?.limit_editor_settings || false;

	const { imageUrl, featuredImageUrl } = useSelect(
		(select) => {
			const { getEntityRecord } = select("core");
			const { getCurrentPostId, getCurrentPostType } = select("core/editor") || {};
			const postId = getCurrentPostId?.();
			const postType = getCurrentPostType?.() || "post";

			let featuredImageData = null;
			if (postId) {
				const post = getEntityRecord("postType", postType, postId);
				if (post?.featured_media) {
					featuredImageData = getEntityRecord(
						"postType",
						"attachment",
						post.featured_media,
					);
				}
			}

			return {
				imageUrl: backgroundImage
					? getEntityRecord("postType", "attachment", backgroundImage)
							?.source_url
					: null,
				featuredImageUrl: featuredImageData?.source_url,
			};
		},
		[backgroundImage],
	);

	const displayImageUrl = useFeaturedImage ? featuredImageUrl : imageUrl;

	// Reset function for ToolsPanel
	const resetAll = () => {
		if (enableFeaturedImage && onFeaturedImageToggle) {
			onFeaturedImageToggle(false);
		}
		if (onFocalPointChange) {
			onFocalPointChange({ x: 0.5, y: 0.5 });
		}
		if (enableMediaOpacity && onOpacityChange) {
			onOpacityChange(SECTION_BACKGROUND_DEFAULT_OPACITY);
		}
		if (enableMediaStyle && onImageStyleChange) {
			onImageStyleChange(SECTION_BACKGROUND_DEFAULT_IMAGE_STYLE);
		}
		if (enableShowCaption && onShowCaptionChange) {
			onShowCaptionChange(false);
		}
		if (onImageRemove) {
			onImageRemove();
		}
	};

	return (
		<Fragment>
			<InspectorControls group={group}>
				<ToolsPanel
					label={panelTitle}
					resetAll={resetAll}
					className={className}
				>
					{enableFeaturedImage && onFeaturedImageToggle ? (
						<ToolsPanelItem
							hasValue={() =>
								useFeaturedImage || !!backgroundImage
							}
							label={__("Image Source", "wp-component-library")}
							onDeselect={() => {
								onFeaturedImageToggle(false);
								if (onImageRemove) {
									onImageRemove();
								}
							}}
							isShownByDefault={false}
						>
							<ImageSourceToggle
								useFeaturedImage={useFeaturedImage}
								onToggle={onFeaturedImageToggle}
							/>
							{!useFeaturedImage &&
								onImageSelect &&
								onImageRemove && (
									<InspectorMediaUpload
										buttonTitle={
											backgroundImage
												? __(
														"Replace Media",
														"wp-component-library",
													)
												: __(
														"Select or Upload Media",
														"wp-component-library",
													)
										}
										gallery={false}
										multiple={false}
										mediaIDs={backgroundImage}
										onSelect={onImageSelect}
										onRemove={onImageRemove}
										showImagePlaceholder={false}
									/>
								)}
						</ToolsPanelItem>
					) : null}

					{(useFeaturedImage || backgroundImage) && (
						<Fragment>
							{onFocalPointChange && (
								<FocalPointControl
									focalPoint={focalPoint}
									onChange={onFocalPointChange}
									imageUrl={displayImageUrl}
								/>
							)}

							{!limitEditorSettings && (
								<Fragment>
									{enableMediaOpacity && onOpacityChange && (
										<OpacityControl
											opacity={opacity}
											onChange={onOpacityChange}
										/>
									)}

									{enableMediaStyle && onImageStyleChange && (
										<StyleControl
											imageStyle={imageStyle}
											onChange={onImageStyleChange}
										/>
									)}

									{enableShowCaption &&
										onShowCaptionChange && (
											<ShowCaptionControl
												showCaption={showCaption}
												onChange={onShowCaptionChange}
											/>
										)}
								</Fragment>
							)}
						</Fragment>
					)}

					{!enableFeaturedImage &&
						!useFeaturedImage &&
						onImageSelect &&
						onImageRemove && (
							<MediaSelectControl
								backgroundImage={backgroundImage}
								onSelect={onImageSelect}
								onRemove={onImageRemove}
								isShownByDefault={true}
							/>
						)}
				</ToolsPanel>
			</InspectorControls>
		</Fragment>
	);
};

export { SectionSettings };
