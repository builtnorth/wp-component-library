/**
 * Weekly hours editor: one row per day (closed, 24 hours, or open–close
 * times), plus optional Open 24/7 and 24-hour format toggles. Controlled:
 * `hours` uses the organization hours shape and `onHoursChange` receives the
 * whole next object.
 *
 * @package Siratik/WP-Component-Library
 */

import styled from "@emotion/styled";
import {
	Flex,
	FlexItem,
	PanelRow,
	TimePicker,
	ToggleControl,
} from "@wordpress/components";
import { Fragment, useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

const StyledWeeklyHours = styled.div`
	.business-hours {
		align-items: center;
		position: relative;
		padding-bottom: 0.75rem;
		padding-top: 0.75rem;

		&:before {
			content: "";
			border-top: 1px dashed var(--wpds-color-stroke-surface-neutral, rgb(217, 219, 222));
			position: absolute;
			width: 100%;
			top: -5px;
			left: 0;
			right: 0;
			margin: 0 auto;
		}
		&:first-of-type {
			&:before {
				display: none;
			}
		}

		&:last-of-type {
			&:after {
				content: "";
				border-bottom: 1px dashed var(--wpds-color-stroke-surface-neutral, rgb(217, 219, 222));
				position: absolute;
				width: 100%;
				bottom: -5px;
				left: 0;
				right: 0;
				margin: 0 auto;
			}
		}

		&__time-group {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			margin: 0 !important;
		}

		&__day {
			min-width: 80px;
			font-weight: 600;
			margin-bottom: 0;

			@media (max-width: 768px) {
				min-width: 60px;
				font-size: 0.875rem;
			}
		}

		&__time {
			width: 80px;

			@media (max-width: 768px) {
				width: auto;
				min-width: 70px;
			}
		}

		&__am-pm {
			width: 60px;
		}

		&__dash {
			padding-left: 0.5rem;
			padding-right: 0.5rem;

			@media (max-width: 768px) {
				padding-left: 0.25rem;
				padding-right: 0.25rem;
			}
		}

		.components-toggle-control {
			padding-left: 1rem;

			@media (max-width: 768px) {
				padding-left: 0.5rem;

				.components-form-toggle__label {
					font-size: 0.875rem;
				}
			}
		}

		&__toggle-closed,
		&__toggle-24hrs {
			@media (max-width: 480px) {
				min-width: auto !important;
			}
		}

		.components-flex {
			@media (max-width: 576px) {
				flex-wrap: wrap;
				gap: 0.5rem !important;
			}
		}

		.components-flex-item {
			@media (max-width: 576px) {
				&:first-of-type {
					width: 100%;
					margin-bottom: 0.5rem;
				}
			}

			&:last-child {
				@media (max-width: 480px) {
					width: 100%;
					min-width: auto !important;

					.components-flex {
						justify-content: flex-start !important;
					}
				}
			}
		}

		.components-datetime__time-input {
			@media (max-width: 480px) {
				font-size: 0.875rem;
			}
		}
	}
`;

const DAYS_OF_WEEK = [
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
];

/**
 * Individual Day Hours Component
 */
function DayHours({ day, dayHours, updateHours, is24HourFormat = false }) {
	const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);

	// Convert 24-hour time string to time object for TimePicker
	const timeStringToTimeObject = (timeString) => {
		if (!timeString) return { hours: 9, minutes: 0 };
		const [hours, minutes] = timeString.split(":");
		return {
			hours: parseInt(hours),
			minutes: parseInt(minutes),
		};
	};

	// Convert TimePicker time object to 24-hour format string
	const timeObjectToTimeString = (timeObject) => {
		if (
			!timeObject ||
			typeof timeObject.hours !== "number" ||
			typeof timeObject.minutes !== "number"
		) {
			return "09:00";
		}
		const hours = timeObject.hours.toString().padStart(2, "0");
		const minutes = timeObject.minutes.toString().padStart(2, "0");
		return `${hours}:${minutes}`;
	};

	// Get current times - always use 24-hour format for storage
	const currentOpenTime = dayHours.open_time || "09:00";
	const currentCloseTime = dayHours.close_time || "17:00";

	// State for TimePicker (always 24-hour format internally)
	const [openTime, setOpenTime] = useState(() =>
		timeStringToTimeObject(currentOpenTime),
	);
	const [closeTime, setCloseTime] = useState(() =>
		timeStringToTimeObject(currentCloseTime),
	);

	// Update state when props change
	useEffect(() => {
		setOpenTime(timeStringToTimeObject(dayHours.open_time || "09:00"));
		setCloseTime(timeStringToTimeObject(dayHours.close_time || "17:00"));
	}, [dayHours.open_time, dayHours.close_time]);

	const handleOpenTimeChange = (newTimeObject) => {
		setOpenTime(newTimeObject);
		const timeString = timeObjectToTimeString(newTimeObject);
		updateHours(day, "open_time", timeString);
	};

	const handleCloseTimeChange = (newTimeObject) => {
		setCloseTime(newTimeObject);
		const timeString = timeObjectToTimeString(newTimeObject);
		updateHours(day, "close_time", timeString);
	};

	return (
		<PanelRow className="business-hours">
			<Flex align="center" gap="3" style={{ width: "100%" }}>
				<FlexItem style={{ minWidth: "80px" }}>
					<p className="business-hours__day">{capitalizedDay}</p>
				</FlexItem>

				<FlexItem
					style={{ minWidth: "60px" }}
					className="business-hours__toggle-closed"
				>
					<ToggleControl
						__nextHasNoMarginBottom
						className="business-hours__closed"
						label={__("Closed", "wp-component-library")}
						checked={dayHours.closed ?? false}
						onChange={(newValue) =>
							updateHours(day, "closed", newValue)
						}
					/>
				</FlexItem>

				<FlexItem
					style={{ minWidth: "60px" }}
					className="business-hours__toggle-24hrs"
				>
					{!dayHours.closed && (
						<ToggleControl
							__nextHasNoMarginBottom
							className="business-hours__AlwaysOpen"
							label={__("24 Hrs", "wp-component-library")}
							checked={dayHours.open_24_hours ?? false}
							onChange={(newValue) =>
								updateHours(day, "open_24_hours", newValue)
							}
						/>
					)}
				</FlexItem>

				<FlexItem style={{ flex: 1, minWidth: "200px" }}>
					{dayHours.closed ? (
						<Flex justify="flex-end">
							<span
								style={{
									color: "#757575",
									fontStyle: "italic",
								}}
							>
								{__("Closed all day", "wp-component-library")}
							</span>
						</Flex>
					) : dayHours.open_24_hours ? (
						<Flex justify="flex-end">
							<span
								style={{
									color: "#757575",
								}}
							>
								{__("Open 24 hours", "wp-component-library")}
							</span>
						</Flex>
					) : (
						<Flex justify="flex-end" align="center" gap="2">
							<TimePicker.TimeInput
								key={`${day}-open-${is24HourFormat}`}
								className="business-hours__time business-hours__time--open"
								value={openTime}
								onChange={handleOpenTimeChange}
								is12Hour={!is24HourFormat}
							/>
							<span className="business-hours__dash">–</span>
							<TimePicker.TimeInput
								key={`${day}-close-${is24HourFormat}`}
								className="business-hours__time business-hours__time--close"
								value={closeTime}
								onChange={handleCloseTimeChange}
								is12Hour={!is24HourFormat}
							/>
						</Flex>
					)}
				</FlexItem>
			</Flex>
		</PanelRow>
	);
}

/**
 * Weekly schedule UI + optional branch-only toggles (24/7, time format).
 * Use with controlled `hours` / `onHoursChange` for primary hours body or extra locations.
 *
 * @param {Object} props
 * @param {Object} props.hours Hours blob (same shape as organization `hours`).
 * @param {Function} props.onHoursChange Full hours object updater.
 * @param {boolean} props.includeSecondaryToggles Show Open 24/7 + 24h format (extra locations modal).
 */
export function WeeklyHoursControl({
	hours,
	onHoursChange,
	includeSecondaryToggles = false,
	className = "",
}) {
	const businessHours = hours || {};
	const always_open = businessHours.always_open ?? false;
	const is24HourFormat = businessHours.is_24_hour_format ?? false;

	const updateHours = (day, field, value) => {
		onHoursChange({
			...businessHours,
			[day]: {
				...(businessHours?.[day] || {}),
				[field]: value,
			},
		});
	};

	const updateGlobalSetting = (field, value) => {
		onHoursChange({
			...businessHours,
			[field]: value,
		});
	};

	return (
		<StyledWeeklyHours className={`weekly-hours-control business-hours-schedule-form ${className}`.trim()}>
			{includeSecondaryToggles ? (
				<Flex
					gap="2rem"
					align="center"
					wrap
					style={{ marginBottom: "1rem" }}
				>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__("Open 24/7", "wp-component-library")}
						checked={always_open}
						onChange={(newValue) =>
							updateGlobalSetting("always_open", newValue)
						}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__("24-hour format", "wp-component-library")}
						checked={is24HourFormat}
						onChange={(newValue) =>
							updateGlobalSetting(
								"is_24_hour_format",
								newValue,
							)
						}
					/>
				</Flex>
			) : null}

			{always_open ? (
				<div
					style={{
						textAlign: "center",
						padding: "2rem",
						color: "#757575",
					}}
				>
					<p>
						{__(
							"Hours are set to open 24/7 all days.",
							"wp-component-library",
						)}
					</p>
				</div>
			) : (
				<Fragment>
					{DAYS_OF_WEEK.map((day) => (
						<Fragment key={day}>
							<DayHours
								day={day}
								dayHours={businessHours?.[day] || {}}
								updateHours={updateHours}
								is24HourFormat={is24HourFormat}
							/>
						</Fragment>
					))}
				</Fragment>
			)}
		</StyledWeeklyHours>
	);
}

export default WeeklyHoursControl;
