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
import { PLACEHOLDER_SVG } from "./utils";

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
		// eslint-disable-next-line @wordpress/no-base-control-with-label-without-id -- the button has its own aria-label.
		<BaseControl
			label={label || __("Icon", "wp-component-library")}
			className={className || undefined}
			__nextHasNoMarginBottom
		>
			<Button
				variant="secondary"
				onClick={openModal}
				style={{ width: "100%", justifyContent: "flex-start", gap: "8px" }}
				aria-label={
					hasIcon
						? __("Change icon", "wp-component-library")
						: __("Choose icon", "wp-component-library")
				}
			>
				<PickerPreview dangerouslySetInnerHTML={{ __html: svgSource }} />
				<PickerName>
					{hasIcon
						? value.label || value.name
						: __("Choose icon\u2026", "wp-component-library")}
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
