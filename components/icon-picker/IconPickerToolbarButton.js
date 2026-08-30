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
import { safeSvgSource } from "./utils";

const PLACEHOLDER_SVG =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H208V208H48ZM96,80a16,16,0,1,1,16,16A16,16,0,0,1,96,80Zm32,96H80a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Zm64-32-32-16-32,16V80l32-16,32,16Z"/></svg>';

/**
 * @param {Object}   props
 * @param {Object}   [props.value]       Current icon { name, iconSet, source }.
 * @param {Function} props.onChange      Called with new icon value.
 * @param {string}   [props.buttonLabel] Override the toolbar button label.
 */
export function IconPickerToolbarButton({
	value,
	onChange,
	buttonLabel = __("Select Icon", "wp-component-library"),
}) {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	const svgSource = safeSvgSource(value?.source ?? PLACEHOLDER_SVG) || PLACEHOLDER_SVG;

	// eslint-disable-next-line react/no-danger
	const toolbarIcon = (
		<ToolbarIconWrap dangerouslySetInnerHTML={{ __html: svgSource }} />
	);

	return (
		<>
			<ToolbarButton icon={toolbarIcon} label={buttonLabel} onClick={openModal} />
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
