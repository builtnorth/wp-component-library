/**
 * Holiday / special hours list: date ranges (MM-DD) that are closed or have
 * their own hours. Controlled: `entries` is the special_opening_hours array,
 * `onChange` receives the whole next array.
 *
 * @package Siratik/WP-Component-Library
 */

import {
	Flex,
	FlexBlock,
	FlexItem,
	TextControl,
	TimePicker,
	ToggleControl,
} from "@wordpress/components";
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { DragHandle, RemoveButton, Repeater } from "../repeater";

function generateId() {
	return Math.random().toString(36).slice(2, 10);
}

function timeStringToObject(str) {
	if (!str) {
		return { hours: 9, minutes: 0 };
	}
	const [h, m] = str.split(":");
	return { hours: parseInt(h, 10), minutes: parseInt(m, 10) };
}

function timeObjectToString(obj) {
	if (!obj || typeof obj.hours !== "number") {
		return "09:00";
	}
	return `${String(obj.hours).padStart(2, "0")}:${String(obj.minutes ?? 0).padStart(2, "0")}`;
}

/**
 * A single holiday row rendered inside the Repeater.
 */
function HolidayRow({ item, onUpdate, is24HourFormat = false }) {
	const [openTime, setOpenTime] = useState(() =>
		timeStringToObject(item.opens || "09:00"),
	);
	const [closeTime, setCloseTime] = useState(() =>
		timeStringToObject(item.closes || "17:00"),
	);

	const update = (field, value) => onUpdate({ ...item, [field]: value });

	const handleOpenChange = (obj) => {
		setOpenTime(obj);
		update("opens", timeObjectToString(obj));
	};
	const handleCloseChange = (obj) => {
		setCloseTime(obj);
		update("closes", timeObjectToString(obj));
	};

	return (
		<Flex gap={3} align="start" wrap>
			<DragHandle />

			<FlexBlock style={{ minWidth: "130px" }}>
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={__("Label", "wp-component-library")}
					help={__("e.g. Christmas Day", "wp-component-library")}
					value={item.label ?? ""}
					onChange={(v) => update("label", v)}
				/>
			</FlexBlock>

			<FlexBlock style={{ minWidth: "110px" }}>
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={__("From (MM-DD)", "wp-component-library")}
					// eslint-disable-next-line @wordpress/i18n-hyphenated-range -- MM-DD date, not a range.
					help={__("e.g. 12-25", "wp-component-library")}
					value={item.date_from ?? ""}
					onChange={(v) => update("date_from", v)}
					placeholder="12-25"
					maxLength={5}
				/>
			</FlexBlock>

			<FlexBlock style={{ minWidth: "110px" }}>
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={__("To (MM-DD)", "wp-component-library")}
					// eslint-disable-next-line @wordpress/i18n-hyphenated-range -- MM-DD date, not a range.
					help={__("e.g. 12-25", "wp-component-library")}
					value={item.date_to ?? ""}
					onChange={(v) => update("date_to", v)}
					placeholder="12-25"
					maxLength={5}
				/>
			</FlexBlock>

			<FlexItem style={{ minWidth: "90px", paddingTop: "28px" }}>
				<ToggleControl
					__nextHasNoMarginBottom
					label={__("Closed", "wp-component-library")}
					checked={!!item.closed}
					onChange={(v) => update("closed", v)}
				/>
			</FlexItem>

		<FlexItem style={{ paddingTop: "26px" }}>
			{item.closed ? (
				<span style={{ color: "#757575", fontStyle: "italic" }}>
					{__("Closed all day", "wp-component-library")}
				</span>
			) : (
				<Flex align="center" gap={1}>
					<TimePicker.TimeInput
						value={openTime}
						onChange={handleOpenChange}
						is12Hour={!is24HourFormat}
					/>
					<span style={{ color: "#757575" }}>–</span>
					<TimePicker.TimeInput
						value={closeTime}
						onChange={handleCloseChange}
						is12Hour={!is24HourFormat}
					/>
				</Flex>
			)}
		</FlexItem>

			<RemoveButton />
		</Flex>
	);
}

/**
 * @param {Object}   props
 * @param {Array}    props.entries          Special hours entries.
 * @param {Function} props.onChange         Receives the next entries array.
 * @param {boolean}  [props.is24HourFormat]
 */
export function SpecialHoursControl({
	entries,
	onChange,
	is24HourFormat = false,
}) {
	const safeEntries = Array.isArray(entries) ? entries : [];

	const handleAdd = () => {
		onChange([
			...safeEntries,
			{
				id: generateId(),
				label: "",
				date_from: "",
				date_to: "",
				closed: true,
				opens: "09:00",
				closes: "17:00",
			},
		]);
	};

	const handleRemove = (id) => {
		onChange(safeEntries.filter((e) => e.id !== id));
	};

	const handleReorder = (reordered) => {
		onChange(reordered);
	};

	const handleUpdate = (id, updated) => {
		onChange(safeEntries.map((e) => (e.id === id ? updated : e)));
	};

	return (
		<div className="special-hours-section">
			<h4 style={{ marginBottom: "0.75rem", marginTop: 0 }}>
				{__("Holiday / Special Hours", "wp-component-library")}
			</h4>
			<Repeater
				items={safeEntries}
			renderItem={(item) => (
				<HolidayRow
					item={item}
					is24HourFormat={is24HourFormat}
					onUpdate={(updated) =>
						handleUpdate(item.id, updated)
					}
				/>
				)}
				onAdd={handleAdd}
				onRemove={handleRemove}
				onReorder={handleReorder}
				renderMode="integrated"
				addButtonText={__("Add exception", "wp-component-library")}
				emptyStateText={__(
					"No special hours set. Add exceptions for holidays, early closings, or special events.",
					"wp-component-library",
				)}
			/>
		</div>
	);
}

export default SpecialHoursControl;
