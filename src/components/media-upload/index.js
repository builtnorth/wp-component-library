/**
 * Media Upload Handler
 *
 * @link https://gist.github.com/5ally/633c4142b77d46068d447cceac3dbc99
 */
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Button, Placeholder, ToolbarButton } from "@wordpress/components";
import { edit, upload } from "@wordpress/icons";

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
						text="Edit/Replace Image"
						label="Edit/Replace Image"
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
					<Button size="compact" variant="secondary" onClick={open}>
						{buttonTitle}
					</Button>
				)}
				gallery={gallery}
				multiple={multiple}
			/>
		</MediaUploadCheck>
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
}) {
	return (
		<Placeholder
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
