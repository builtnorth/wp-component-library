import styled from "@emotion/styled";
import { ComboboxControl } from "@wordpress/components";

/** Core's options sit in the page flow: float them over what's below instead. */
const Field = styled.fieldset`
	min-inline-size: 0;
	margin: 0;
	padding: 0;
	border: 0;

	.components-combobox-control__suggestions-container {
		position: relative;
	}

	.components-form-token-field__suggestions-list {
		position: absolute;
		inset-block-start: 100%;
		inset-inline: 0;
		z-index: 2;
		border: 1px solid #949494;
		background: #fff;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
	}
`;

/**
 * Core's ComboboxControl as a select: its options open as a dropdown, it can
 * be disabled, and clearing it gives an empty string rather than null.
 *
 * @param {Object}   props           ComboboxControl props.
 * @param {boolean}  [props.disabled] ComboboxControl takes none: the fieldset disables its input and buttons.
 * @param {Function} props.onChange  ( value ) => void
 */
export function SearchableSelectControl({ disabled = false, onChange, ...props }) {
	return (
		<Field disabled={disabled}>
			<ComboboxControl
				__next40pxDefaultSize
				{...props}
				onChange={(value) => onChange(value ?? "")}
			/>
		</Field>
	);
}
