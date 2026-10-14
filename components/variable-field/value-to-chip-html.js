/**
 * Variable tokens and the editor markup built from them. Kept free of imports
 * so it can be unit-tested without the component's WordPress dependencies.
 */
const VARIABLE_TOKEN_PATTERN =
    /\{\{([a-zA-Z0-9_.-]+)\}\}|\{([a-zA-Z0-9_.-]+)\}/g;

export const formatVariableToken = (name) => `{{${name}}}`;

// Text and labels are user data; only the chip markup itself is HTML.
const escapeText = (text) =>
    String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Editor markup for a value: its text escaped, each variable token as a chip.
 *
 * @param {string}   val              Stored value, e.g. "{{title}} | {{site_name}}".
 * @param {Function} resolveChipLabel Variable name → chip label.
 * @return {string} HTML for the contenteditable container.
 */
export const valueToChipHTML = (val, resolveChipLabel) => {
    if (!val) { return ""; }
    // Add zero-width spaces between elements for better cursor positioning
    let html = escapeText(val).replace(
        VARIABLE_TOKEN_PATTERN,
        (match, doubleName, singleName) => {
            const varName = doubleName || singleName;
            const chipLabel = escapeText(resolveChipLabel(varName));

            return `<span class="variable-chip" contenteditable="false" data-variable="${varName}">${chipLabel}<span class="chip-remove">×</span></span>`;
        },
    );
    // Ensure there's always an editable space at the end
    if (!html.endsWith('\u200B')) {
        html += '\u200B';
    }
    return html;
};
