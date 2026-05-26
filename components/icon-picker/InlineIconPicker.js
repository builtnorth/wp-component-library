/**
 * InlineIconPicker Component
 *
 * Block-canvas icon picker. The icon itself (or a placeholder) is the
 * clickable element — clicking opens the shared modal.
 *
 * Matches the 10up InlineIconPicker API:
 *   <InlineIconPicker value={icon} onChange={handleChange} className="..." />
 *
 * Key implementation note:
 *   Uses InlinePickerWrap which renders as a div[role="button"] so that
 *   color: currentColor naturally cascades from the block context with
 *   no UA stylesheet interference (native <button> has color: ButtonText).
 */

import { useState, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import { IconPickerModal } from "./IconPickerModal";
import { InlinePickerWrap } from "./styles";
import { safeSvgSource } from "./utils";

const PLACEHOLDER_SVG =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H208V208H48ZM96,80a16,16,0,1,1,16,16A16,16,0,0,1,96,80Zm32,96H80a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Zm64-32-32-16-32,16V80l32-16,32,16Z"/></svg>';

/**
 * @param {Object}   props
 * @param {Object}   [props.value]     Current icon { name, iconSet, source }.
 * @param {Function} props.onChange    Called with new icon value.
 * @param {string}   [props.className] Extra class forwarded to the wrapper.
 */
export function InlineIconPicker({ value, onChange, className = "" }) {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	const handleKeyDown = useCallback((e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setIsOpen(true);
		}
	}, []);

	const hasIcon = value?.source;
	const svgContent = hasIcon
		? safeSvgSource(value.source) || PLACEHOLDER_SVG
		: PLACEHOLDER_SVG;

	return (
		<>
			{/* eslint-disable-next-line react/no-danger */}
			<InlinePickerWrap
				as="div"
				role="button"
				tabIndex={0}
				className={className || undefined}
				onClick={openModal}
				onKeyDown={handleKeyDown}
				aria-label={
					hasIcon
						? __("Change icon", "wp-component-library")
						: __("Choose icon", "wp-component-library")
				}
				dangerouslySetInnerHTML={{ __html: svgContent }}
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
