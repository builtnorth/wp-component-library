import { useSelect } from "@wordpress/data";

/**
 * AttachmentImage
 *
 * @param {object} props
 * @param {number} props.id The ID of the image to display.
 * @param {string} props.className Optional. The class to add to the image.
 * @param {string} props.customAlt Optional. The custom alt text to use for the image.
 * @param {boolean} props.showCaption Optional. Whether to show the caption.
 * @param {string} props.wrapClass Optional. The class to add to the figure.
 * @param {boolean} props.includeFigure Optional. Whether to include the figure.
 * @param {string} props.size Optional. The size of the image.
 * @param {string} props.maxWidth Optional. The maximum width of the image.
 * @returns {*} React JSX
 */
function AttachmentImage({
	imageId,
	className = "image",
	customAlt = null,
	showCaption = false,
	wrapClass = null,
	includeFigure = true,
	size = "full",
	maxWidth = "100px",
	...overrideProps
}) {
	const { image } = useSelect((select) => ({
		image: select("core").getMedia(imageId),
	}));

	if (!image) return null;

	const appendToFirstClass = (classString, appendix) => {
		const classes = classString.split(" ");
		if (classes.length > 0) {
			classes[0] = `${classes[0]}${appendix}`;
		}
		return classes.join(" ");
	};

	const imageAttributes = () => {
		let attributes = {
			className: appendToFirstClass(className, "__img"),
			src: image.source_url,
			alt: customAlt || image.alt_text,
			width: image.media_details.width,
			height: image.media_details.height,
			sizes: `(max-width: ${maxWidth}) 100vw, ${maxWidth}`,
		};

		if (
			image.media_details &&
			image.media_details.sizes &&
			image.media_details.sizes[size]
		) {
			attributes.src = image.media_details.sizes[size].source_url;
			attributes.srcSet = image.media_details.sizes[size].source_url;
			attributes.width = image.media_details.sizes[size].width;
			attributes.height = image.media_details.sizes[size].height;
		}

		return { ...attributes, ...overrideProps };
	};

	const imgElement = <img {...imageAttributes()} />;
	const captionElement =
		showCaption && image.caption.rendered ? (
			<figcaption className={appendToFirstClass(className, "__caption")}>
				{image.caption.rendered}
			</figcaption>
		) : null;

	if (includeFigure) {
		return (
			<figure className={appendToFirstClass(className, "__figure")}>
				{imgElement}
				{captionElement}
			</figure>
		);
	}

	return (
		<>
			{imgElement}
			{captionElement}
		</>
	);
}

// Export Component
export { AttachmentImage };
