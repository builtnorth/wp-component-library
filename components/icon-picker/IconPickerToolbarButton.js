/**
 * IconPickerToolbarButton Component
 *
 * Toolbar button variant of the icon picker. Shows the selected icon
 * (or a "Select Icon" label) in the block toolbar — clicking opens the modal.
 *
 * Matches the 10up IconPickerToolbarButton API:
 *   <IconPickerToolbarButton value={icon} onChange={handleChange} />
 */

import { ToolbarButton } from "@wordpress/components";
import { useState, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { IconPickerModal } from "./IconPickerModal";
import { ToolbarIconWrap } from "./styles";
import { PLACEHOLDER_SVG, safeSvgSource } from "./utils";

/**
 * @param {Object}   props
 * @param {Object}   [props.value]       Current icon { name, iconSet, source }.
 * @param {Function} props.onChange      Called with new icon value.
 * @param {string}   [props.buttonLabel] Override the toolbar button label.
 * @param {string}   [props.text]        Visible text shown beside the icon.
 */
export function IconPickerToolbarButton({
	value,
	onChange,
	buttonLabel = __("Select Icon", "wp-component-library"),
	text,
}) {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	const svgSource = safeSvgSource(value?.source ?? PLACEHOLDER_SVG) || PLACEHOLDER_SVG;

	const toolbarIcon = (
		<ToolbarIconWrap dangerouslySetInnerHTML={{ __html: svgSource }} />
	);

	return (
		<>
			<ToolbarButton
				icon={toolbarIcon}
				label={buttonLabel}
				text={text}
				onClick={openModal}
			/>
			{isOpen && (
				<IconPickerModal
					value={value}
					onChange={onChange}
					onClose={closeModal}
				/>
			)}
		</>
	);
}
