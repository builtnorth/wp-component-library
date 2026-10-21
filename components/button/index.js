/** Variants, as on kitaris/button. */
const VARIANTS = ["primary", "secondary", "tertiary", "text-link"];

/**
 * Style and variant classes, as siratik-utility's Button::render() writes
 * them. `style` is the block style ("" or "fill", "outline"); the older form,
 * a variant passed as `style` ("default", "secondary", "tertiary",
 * "text-link"), still works.
 *
 * @param {string} style   Block style, or a legacy variant.
 * @param {string} variant Variant.
 * @return {string} Classes.
 */
const styleAndVariantClasses = (style, variant) => {
    let nextStyle = style || "";
    let nextVariant = variant || "";

    if (nextStyle === "default" || VARIANTS.includes(nextStyle)) {
        if (!nextVariant && nextStyle !== "default") {
            nextVariant = nextStyle;
        }
        nextStyle = "";
    }
    if (!VARIANTS.includes(nextVariant)) {
        nextVariant = "primary";
    }

    return [
        nextStyle && nextStyle !== "fill" ? `is-style-${nextStyle}` : "",
        `is-variant-${nextVariant}`,
    ]
        .filter(Boolean)
        .join(" ");
};

/**
 * Render a button component.
 *
 * @since 0.1.0
 *
 * @param {Object} props Component properties.
 * @param {string} props.className Optional. Additional class for the button.
 * @param {string} props.style Optional. Block style: "" (Fill) or "outline".
 *                             Legacy: a variant name.
 * @param {string} props.variant Optional. "primary" (default), "secondary",
 *                               "tertiary" or "text-link".
 * @param {string} props.text Button text. Defaults to 'Button Text'.
 * @param {string} props.link Button link. Defaults to '#'.
 * @param {string|null} props.target Optional. Link target.
 * @param {string|null} props.screenReader Optional. Screen reader text.
 * @returns {WPElement} Button element to render.
 */
function ButtonFrontend({
    className = null,
    size = "default",
    style = "",
    variant = "",
    text = "Button Text",
    screenReader = null,
}) {
    // Add screen reader text
    const screenReaderElement = screenReader ? (
        <span className="screen-reader-only">{screenReader}</span>
    ) : null;

    // Add classes
    const wrapperClass = className
        ? `${className}__button is-size-${size}`
        : `wp-block-kitaris-button ${styleAndVariantClasses(style, variant)} is-size-${size}`;
    const linkClass = className
        ? `wp-block-kitaris-button__link wp-block-kitaris-button__text`
        : "wp-block-kitaris-button__text";

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
