/**
 * WordPress dependencies
 */
import { InspectorControls } from "@wordpress/block-editor";
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
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
	contextPostId = null,
	contextPostType = null,
}) => {
	const limitEditorSettings =
		window.polaris_localize?.limit_editor_settings || false;

	const displayImageUrl = useSelect(
		(select) => {
			const { getEntityRecord, getEditedEntityRecord } = select(coreStore);
			const editor = select("core/editor");
			const editorPostId = editor?.getCurrentPostId?.() ?? null;
			const editorPostType = editor?.getCurrentPostType?.() ?? "post";
			const resolvedPostId = contextPostId ?? editorPostId;
			const resolvedPostType = contextPostType ?? editorPostType;

			let featuredMediaId = null;
			if (useFeaturedImage && resolvedPostId && resolvedPostType) {
				const post =
					getEditedEntityRecord(
						"postType",
						resolvedPostType,
						resolvedPostId,
					) ??
					getEntityRecord(
						"postType",
						resolvedPostType,
						resolvedPostId,
					);
				featuredMediaId = post?.featured_media || null;
			}

			const effectiveImageId = useFeaturedImage
				? featuredMediaId || backgroundImage
				: backgroundImage;

			if (!effectiveImageId) {
				return null;
			}

			return (
				getEntityRecord("postType", "attachment", effectiveImageId)
					?.source_url ?? null
			);
		},
		[
			backgroundImage,
			useFeaturedImage,
			contextPostId,
			contextPostType,
		],
	);

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
