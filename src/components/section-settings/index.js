/**
 * WordPress dependencies
 */

import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
	Button,
	FocalPointPicker,
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import classnames from "classnames";

import { AttachmentImage } from "../attachment-image";
import { InspectorMediaUpload } from "../media-upload";

const SectionSettings = (props) => {
	const {
		backgroundImage,
		handleImageSelect,
		handleImageRemove,
		focalPoint,
		handleFocalPointChange,
		opacity,
		handleOpacityChange,
		imageStyle,
		handleImageStyleChange,
	} = props;

	const limitEditorSettings =
		window.polaris_localize?.limit_editor_settings || false;

	const imageUrl = useSelect(
		(select) => {
			if (!backgroundImage) return null;
			const image = select("core").getMedia(backgroundImage);
			return image?.source_url;
		},
		[backgroundImage],
	);

	return (
		<Fragment>
			<InspectorControls group="styles">
				<PanelBody
					title="Background Media"
					className="built-inspector-image-upload"
				>
					{!backgroundImage && (
						<PanelRow>
							<InspectorMediaUpload
								buttonTitle={__(
									"Select or Upload Media",
									"polaris-blocks",
								)}
								gallery={false}
								multiple={false}
								mediaIDs={backgroundImage}
								onSelect={handleImageSelect}
							/>
						</PanelRow>
					)}
					{backgroundImage && (
						<Fragment>
							<PanelRow>
								<InspectorMediaUpload
									variant="primary"
									buttonTitle={__(
										"Replace Media",
										"polaris-blocks",
									)}
									gallery={false}
									multiple={false}
									mediaIDs={backgroundImage}
									onSelect={handleImageSelect}
								/>
								<Button
									variant="secondary"
									size="compact"
									isDestructive
									text={__("Remove Media")}
									onClick={handleImageRemove}
								/>
							</PanelRow>
							<PanelRow>
								<FocalPointPicker
									__nextHasNoMarginBottom
									hideLabelFromVision={true}
									label={__(
										"Media Focal Point",
										"polaris-blocks",
									)}
									url={imageUrl}
									value={focalPoint}
									onDragStart={handleFocalPointChange}
									onDrag={handleFocalPointChange}
									onChange={handleFocalPointChange}
								/>
							</PanelRow>
							{!limitEditorSettings && (
								<Fragment>
									<RangeControl
										__nextHasNoMarginBottom
										label={__(
											"Media Opacity",
											"polaris-blocks",
										)}
										value={opacity}
										onChange={handleOpacityChange}
										min={0}
										max={100}
										initialPosition={15}
									/>

									<SelectControl
										label={__(
											"Media Style",
											"polaris-blocks",
										)}
										value={imageStyle}
										options={[
											{
												label: __(
													"None",
													"polaris-blocks",
												),
												value: "none",
											},
											{
												label: __(
													"Blur",
													"polaris-blocks",
												),
												value: "blur",
											},
											{
												label: __(
													"Grayscale",
													"polaris-blocks",
												),
												value: "grayscale",
											},
											{
												label: __(
													"Blur + Grayscale",
													"polaris-blocks",
												),
												value: "blur-grayscale",
											},
										]}
										onChange={handleImageStyleChange}
									/>
								</Fragment>
							)}
						</Fragment>
					)}
				</PanelBody>
			</InspectorControls>
		</Fragment>
	);
};

const SectionBackground = ({
	backgroundImage,
	focalPoint,
	opacity,
	imageStyle,
}) => {
	const backgroundStyle = {
		...(focalPoint && {
			objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
			transform: `translate(${(0.5 - focalPoint.x) * 25}%, ${(0.5 - focalPoint.y) * 25}%) scale(1.25)`,
		}),
		opacity: opacity / 100,
	};

	const imageClasses = classnames("section__background--image", {
		[`has-${imageStyle}`]: imageStyle && imageStyle !== "none",
	});

	return (
		<div className="section__background">
			<AttachmentImage
				className={imageClasses}
				imageId={backgroundImage}
				alt=""
				size="wide_large"
				style={backgroundStyle}
			/>
		</div>
	);
};

const SectionWrapper = ({ attributes, setAttributes, className, children }) => {
	const { backgroundImage, focalPoint, opacity, imageStyle } = attributes; // Use default if not set

	const handleImageSelect = (image) => {
		setAttributes({
			backgroundImage: image.id,
			focalPoint: focalPoint || { x: 0.5, y: 0.5 },
		});
	};

	const handleImageRemove = () => {
		setAttributes({
			backgroundImage: null,
			focalPoint: null, // Reset focal point when removing image
		});
	};

	const handleFocalPointChange = (newFocalPoint) => {
		setAttributes({ focalPoint: newFocalPoint });
	};

	const handleOpacityChange = (newOpacity) => {
		setAttributes({ opacity: newOpacity });
	};

	const handleImageStyleChange = (newStyle) => {
		setAttributes({ imageStyle: newStyle });
	};

	const customClass =
		`${className || ""} ${backgroundImage ? "has-background-image" : ""}`.trim();

	const blockProps = useBlockProps({
		className: customClass,
	});

	return (
		<>
			<SectionSettings
				backgroundImage={backgroundImage}
				handleImageSelect={handleImageSelect}
				handleImageRemove={handleImageRemove}
				handleFocalPointChange={handleFocalPointChange}
				focalPoint={focalPoint}
				opacity={opacity}
				handleOpacityChange={handleOpacityChange}
				imageStyle={imageStyle}
				handleImageStyleChange={handleImageStyleChange}
				setAttributes={setAttributes}
			/>
			<section {...blockProps}>
				{children}
				<SectionBackground
					backgroundImage={backgroundImage}
					focalPoint={focalPoint}
					opacity={opacity}
					imageStyle={imageStyle}
				/>
			</section>
		</>
	);
};

// Export individual components
export { SectionBackground, SectionSettings, SectionWrapper };
