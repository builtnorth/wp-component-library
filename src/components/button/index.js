/**
 * Render a button component.
 *
 * @since 0.1.0
 *
 * @param {Object} props Component properties.
 * @param {string} props.className Optional. Additional class for the button.
 * @param {string} props.style Optional. Button style. Defaults to 'default'.
 * @param {string} props.text Button text. Defaults to 'Button Text'.
 * @param {string} props.link Button link. Defaults to '#'.
 * @param {string|null} props.target Optional. Link target.
 * @param {string|null} props.screenReader Optional. Screen reader text.
 * @returns {WPElement} Button element to render.
 */
function ButtonFrontend({
	className = null,
	style = "default",
	text = "Button Text",
	link = "#",
	target = null,
	screenReader = null,
}) {
	// Add screen reader text
	const screenReaderElement = screenReader ? (
		<span className="screen-reader-text">{screenReader}</span>
	) : null;

	// Add target attribute
	const targetAttr = target ? { target: target } : {};

	// Add classes
	const wrapperClass = className
		? `${className}__button polaris-button is-style-${style}`
		: `polaris-button is-style-${style}`;
	const linkClass = className
		? `${className}__button-link polaris-button__text`
		: "polaris-button__text";

	return (
		<span className={wrapperClass}>
			<span className={linkClass}>
				{text}
				{screenReaderElement}
			</span>
		</span>
	);
}

export { ButtonFrontend };
