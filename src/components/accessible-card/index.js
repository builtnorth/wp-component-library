/**
 * Render an accessible card link component.
 *
 * @since 0.1.0
 *
 * @param {Object} props Component properties.
 * @param {string} props.link Link URL. Defaults to '#'.
 * @param {string|null} props.target Optional. Link target.
 * @param {string|null} props.screenReader Optional. Screen reader text.
 * @param {string|null} props.className Optional. Additional class for the link.
 * @returns {WPElement} Accessible card link element to render.
 */
function AccessibleCard({
	link = "#",
	target = null,
	screenReader = "Read more about ...",
	className = null,
}) {
	// Add target attribute
	const targetAttr = target ? { target: target } : {};

	// Add class
	const linkClass = className
		? `${className}__accessible-card-link accessible-card-link`
		: "accessible-card-link";

	return (
		<a
			className={linkClass}
			aria-hidden="true"
			tabIndex="-1"
			href={link}
			{...targetAttr}
		>
			<span className="screen-reader-text">{screenReader}</span>
		</a>
	);
}

export { AccessibleCard };
