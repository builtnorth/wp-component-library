/**
 * IconPicker Component
 *
 * Inspector-panel icon picker. Shows the currently selected icon
 * (or a placeholder) as a button — clicking opens the shared modal.
 *
 * Matches the 10up IconPicker API:
 *   <IconPicker value={icon} onChange={handleChange} label="Icon" />
 */

import { BaseControl, Button } from "@wordpress/components";
import { useState, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { IconPickerModal } from "./IconPickerModal";
import { PickerPreview, PickerName } from "./styles";

const PLACEHOLDER_SVG =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H208V208H48ZM96,80a16,16,0,1,1,16,16A16,16,0,0,1,96,80Zm32,96H80a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Zm64-32-32-16-32,16V80l32-16,32,16Z"/></svg>';

/**
 * @param {Object}   props
 * @param {Object}   [props.value]      Current icon { name, iconSet, source }.
 * @param {Function} props.onChange     Called with new icon value.
 * @param {string}   [props.label]      Label for the BaseControl.
 * @param {string}   [props.className]
 */
export function IconPicker({ value, onChange, label = "", className = "" }) {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	const hasIcon = value?.source;
	const svgSource = hasIcon ? value.source : PLACEHOLDER_SVG;

	return (
		<BaseControl
			label={label || __("Icon", "polaris-blocks")}
			className={className || undefined}
			__nextHasNoMarginBottom
		>
			<Button
				variant="secondary"
				onClick={openModal}
				style={{ width: "100%", justifyContent: "flex-start", gap: "8px" }}
				aria-label={
					hasIcon
						? __("Change icon", "polaris-blocks")
						: __("Choose icon", "polaris-blocks")
				}
			>
				{/* eslint-disable-next-line react/no-danger */}
				<PickerPreview dangerouslySetInnerHTML={{ __html: svgSource }} />
				<PickerName>
					{hasIcon
						? value.label || value.name
						: __("Choose icon\u2026", "polaris-blocks")}
				</PickerName>
			</Button>

			{isOpen && (
				<IconPickerModal
					value={value}
					onChange={onChange}
					onClose={closeModal}
				/>
			)}
		</BaseControl>
	);
}
