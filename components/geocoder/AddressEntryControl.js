/**
 * Address entry: a Search / Type it in toggle over one address.
 *
 * Search uses GeocoderSearchControl and shows a summary; Type it in shows the
 * address fields (with line 2) and a Find on map button. Lookups only run on
 * an explicit Search or Find on map click, never while typing.
 *
 * The value uses the organization location keys: address_street,
 * address_street_2, address_city, address_state, address_zip,
 * address_country, location_lat, location_lng, location_zoom. Extra keys
 * are passed through untouched.
 *
 * @package Siratik/WP-Component-Library
 */

import styled from "@emotion/styled";
import {
	Button,
	Notice,
	SelectControl,
	TextControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { GeocoderSearchControl } from "./GeocoderSearchControl";
import {
	geocodeAddress,
	toAddressQuery,
	toOrganizationLocation,
} from "./geocoder";
import { getCountryOptions } from "./countryOptions";

// Zoom after picking a search result, and after Find on map (a specific address).
const SEARCH_RESULT_ZOOM = 12;
const FIND_ON_MAP_ZOOM = 16;

const StyledAddressEntry = styled.div`
	display: grid;
	gap: 16px;

	.address-entry__summary {
		padding: 16px;
		background: #f9f9f9;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
	}

	.address-entry__summary-title {
		margin: 0 0 8px;
		font-size: 13px;
		font-weight: 600;
	}

	.address-entry__line {
		margin: 0;
	}

	.address-entry__empty {
		margin: 0;
		color: #757575;
		font-style: italic;
	}

	.address-entry__remove {
		margin-top: 12px;
	}

	.address-entry__fields {
		display: grid;
		gap: 16px;
	}

	.address-entry__row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	.address-entry__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}

	.address-entry__notice {
		margin: 0;
	}
`;

/**
 * @param {Object}   props
 * @param {Object}   props.value               Current address/location object.
 * @param {Function} props.onChange            Called with the next object (all keys kept).
 * @param {Function} [props.onRemove]          Shows a Remove address button when set.
 * @param {string}   [props.searchControlId]   Id for the search input.
 * @param {string}   [props.notFoundMessage]   Shown when Find on map finds nothing.
 * @param {boolean}  [props.showFindOnMap]     False hides Find on map (no pin to place).
 * @param {string}   [props.className]
 */
export function AddressEntryControl({
	value,
	onChange,
	onRemove,
	searchControlId = "address-entry-search",
	notFoundMessage,
	showFindOnMap = true,
	className = "",
}) {
	const location = value && typeof value === "object" ? value : {};

	// Latest value for async work (Find on map) and quick successive edits.
	const valueRef = useRef(location);
	valueRef.current = location;

	// "search" or "manual". Both edit the same address; switching clears nothing.
	const [entryMode, setEntryMode] = useState("search");

	// "idle" | "searching" | "not_found"
	const [findStatus, setFindStatus] = useState("idle");
	const findAbortRef = useRef(null);

	useEffect(() => () => findAbortRef.current?.abort(), []);

	const setField = useCallback(
		(key) => (next) => {
			setFindStatus("idle");
			onChange({ ...valueRef.current, [key]: next });
		},
		[onChange],
	);

	// A result replaces the address and pin; line 2 is kept (results never have one).
	const handleSelectResult = useCallback(
		(result) => {
			const parsed = toOrganizationLocation(result);
			if (!parsed) {
				return;
			}
			onChange({
				...valueRef.current,
				address_street: parsed.street,
				address_city: parsed.city,
				address_state: parsed.state,
				address_zip: parsed.zip,
				address_country: parsed.country,
				location_lat: parsed.lat,
				location_lng: parsed.lng,
				location_zoom: SEARCH_RESULT_ZOOM,
			});
		},
		[onChange],
	);

	// One lookup, only on click. Line 2 is left out: suite numbers make lookups fail.
	const handleFindOnMap = useCallback(async () => {
		const current = valueRef.current;
		const query = toAddressQuery(current);
		const country = String(current.address_country || "").toLowerCase();

		findAbortRef.current?.abort();
		const controller = new AbortController();
		findAbortRef.current = controller;
		setFindStatus("searching");

		const results = await geocodeAddress({
			query,
			limit: 1,
			signal: controller.signal,
			...(/^[a-z]{2}$/.test(country) ? { countryCodes: [country] } : {}),
		});
		if (controller.signal.aborted) {
			return;
		}

		const match = results[0];
		if (!match) {
			setFindStatus("not_found");
			return;
		}

		setFindStatus("idle");
		onChange({
			...valueRef.current,
			location_lat: match.lat,
			location_lng: match.lng,
			location_zoom: FIND_ON_MAP_ZOOM,
		});
	}, [onChange]);

	const handleRemove = useCallback(() => {
		setFindStatus("idle");
		onRemove?.();
	}, [onRemove]);

	const countryOptions = useMemo(
		() => getCountryOptions(location.address_country),
		[location.address_country],
	);

	const hasAddress = Boolean(
		location.address_street || location.address_city || location.address_zip,
	);
	const canFindOnMap = Boolean(
		String(location.address_street || "").trim() ||
			String(location.address_city || "").trim() ||
			String(location.address_zip || "").trim(),
	);
	const cityLine = [
		location.address_city,
		[location.address_state, location.address_zip].filter(Boolean).join(" "),
		location.address_country,
	]
		.filter(Boolean)
		.join(", ");

	return (
		<StyledAddressEntry className={`address-entry ${className}`.trim()}>
			<ToggleGroupControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={__("Address entry", "wp-component-library")}
				value={entryMode}
				onChange={(mode) => setEntryMode(mode || "search")}
				isBlock
			>
				<ToggleGroupControlOption
					value="search"
					label={__("Search", "wp-component-library")}
				/>
				<ToggleGroupControlOption
					value="manual"
					label={__("Type it in", "wp-component-library")}
				/>
			</ToggleGroupControl>

			{entryMode === "search" ? (
				<>
					<GeocoderSearchControl
						id={searchControlId}
						placeholder={__(
							"Enter an address and press Search",
							"wp-component-library",
						)}
						onSelect={handleSelectResult}
					/>

					<div className="address-entry__summary">
						<p className="address-entry__summary-title">
							{__("Address", "wp-component-library")}
						</p>
						{hasAddress ? (
							<>
								{location.address_street && (
									<p className="address-entry__line">
										{location.address_street}
									</p>
								)}
								{location.address_street_2 && (
									<p className="address-entry__line">
										{location.address_street_2}
									</p>
								)}
								{cityLine && (
									<p className="address-entry__line">{cityLine}</p>
								)}
								{onRemove && (
									<Button
										variant="secondary"
										size="small"
										isDestructive
										onClick={handleRemove}
										className="address-entry__remove"
									>
										{__("Remove address", "wp-component-library")}
									</Button>
								)}
							</>
						) : (
							<p className="address-entry__empty">
								{__("No address selected", "wp-component-library")}
							</p>
						)}
					</div>
				</>
			) : (
				<div className="address-entry__fields">
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__("Street address", "wp-component-library")}
						value={location.address_street ?? ""}
						onChange={setField("address_street")}
						autoComplete="address-line1"
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__("Address line 2", "wp-component-library")}
						placeholder={__("Suite, unit, floor", "wp-component-library")}
						value={location.address_street_2 ?? ""}
						onChange={setField("address_street_2")}
						autoComplete="address-line2"
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__("City", "wp-component-library")}
						value={location.address_city ?? ""}
						onChange={setField("address_city")}
						autoComplete="address-level2"
					/>
					<div className="address-entry__row">
						<TextControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={__("State / province", "wp-component-library")}
							value={location.address_state ?? ""}
							onChange={setField("address_state")}
							autoComplete="address-level1"
						/>
						<TextControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={__("ZIP / postal code", "wp-component-library")}
							value={location.address_zip ?? ""}
							onChange={setField("address_zip")}
							autoComplete="postal-code"
						/>
					</div>
					<SelectControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__("Country", "wp-component-library")}
						value={String(location.address_country || "US").toUpperCase()}
						options={countryOptions}
						onChange={setField("address_country")}
					/>
					<div className="address-entry__actions">
						{showFindOnMap && (
							<Button
								variant="secondary"
								size="compact"
								onClick={handleFindOnMap}
								isBusy={findStatus === "searching"}
								disabled={!canFindOnMap || findStatus === "searching"}
								accessibleWhenDisabled
							>
								{__("Find on map", "wp-component-library")}
							</Button>
						)}
						{onRemove && hasAddress && (
							<Button
								variant="tertiary"
								size="compact"
								isDestructive
								onClick={handleRemove}
							>
								{__("Remove address", "wp-component-library")}
							</Button>
						)}
					</div>
					{findStatus === "not_found" && (
						<Notice
							status="warning"
							isDismissible={false}
							className="address-entry__notice"
						>
							{notFoundMessage ||
								__(
									"Couldn't find that address. Check it and try again.",
									"wp-component-library",
								)}
						</Notice>
					)}
				</div>
			)}
		</StyledAddressEntry>
	);
}

export default AddressEntryControl;
