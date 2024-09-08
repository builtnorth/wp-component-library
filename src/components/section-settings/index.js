/**
 * WordPress dependencies
 */

import { InspectorControls } from "@wordpress/block-editor";
import { Button, PanelBody, PanelRow } from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { AttachmentImage } from "../attachment-image";
import { InspectorMediaUpload } from "../media-upload";

const SectionSettings = (props) => {
	const { backgroundImage, handleImageSelect, handleImageRemove } = props;

	return (
		<Fragment>
			<InspectorControls group="styles">
				<PanelBody
					title="Background Image"
					className="built-inspector-image-upload"
				>
					{!backgroundImage && (
						<PanelRow>
							<InspectorMediaUpload
								buttonTitle={__("Select or Upload Image")}
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
								<div className="image__wrap--cover">
									<AttachmentImage
										imageId={backgroundImage}
										alt={backgroundImage.alt}
										size="square_small"
									/>
								</div>
							</PanelRow>
							<PanelRow>
								<Button
									variant="secondary"
									size="compact"
									isDestructive
									text={__("Remove Image")}
									onClick={handleImageRemove}
								/>
							</PanelRow>
						</Fragment>
					)}
				</PanelBody>
			</InspectorControls>
		</Fragment>
	);
};

const SectionBackground = (props) => {
	const { backgroundImage } = props;

	return (
		<div className="section__background">
			<AttachmentImage
				className="section__background--image"
				imageId={backgroundImage}
				alt=""
				size="wide_large"
			/>
		</div>
	);
};

// Export individual components
export { SectionBackground, SectionSettings };
