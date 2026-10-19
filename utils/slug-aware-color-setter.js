/**
 * A withColors() setter that keeps the palette slug the user picked.
 *
 * withColors' own setters only receive the hex and save the first palette
 * entry with that hex, so when two presets share a value (e.g. "white" and
 * "primary-contrast" are both #ffffff) picking the second saves the first.
 * The color dropdown also passes the slug, as core's color supports use it;
 * save that directly and leave custom colors to the withColors setter.
 *
 * @param {Function} setAttributes Block attribute setter.
 * @param {string}   name          Color attribute mapped in withColors().
 * @param {Function} setter        withColors' setter for that attribute.
 * @return {Function} onColorChange handler: ( value, slug ) => void.
 */
export function slugAwareColorSetter(setAttributes, name, setter) {
	return (value, slug) => {
		if (!value || !slug) {
			setter(value);
			return;
		}

		setAttributes({
			[name]: slug,
			[`custom${name.charAt(0).toUpperCase()}${name.slice(1)}`]: undefined,
		});
	};
}
