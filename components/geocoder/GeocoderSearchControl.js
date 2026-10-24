/**
 * GeocoderSearchControl
 *
 * Reusable address/place search input wrapping the shared `geocodeAddress`
 * (Nominatim) helper.
 *
 * Explicit-submit pattern: search fires only when the user presses Enter or
 * clicks the search button — never as-you-type. This is required by the
 * Nominatim usage policy, which forbids autocomplete-style request streams
 * regardless of debounce: see https://operations.osmfoundation.org/policies/nominatim/
 *
 * The search input + suggestions dropdown live in their own
 * `position: relative` container so the dropdown butts directly
 * against the bottom of the input. Attribution sits in a sibling
 * below that container, in normal flow, and is overlaid by the
 * dropdown when results are visible.
 *
 * @package Siratik/WP-Component-Library
 */

import { Button, SearchControl } from "@wordpress/components";
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { search as searchIcon } from "@wordpress/icons";

import {
	geocodeAddress,
	GEOCODER_ATTRIBUTION_HTML,
} from "./geocoder";

/**
 * @param {Object}                         props
 * @param {(result:GeocodeResult)=>void}   props.onSelect          Called when the user picks a suggestion.
 * @param {string}                         [props.id]              Stable id for the underlying SearchControl.
 * @param {string}                         [props.placeholder]
 * @param {number}                         [props.limit=8]         Max suggestions returned.
 * @param {string[]}                       [props.countryCodes]    ISO 3166-1 alpha-2 list to bias results to.
 * @param {number}                         [props.minLength=3]
 * @param {boolean}                        [props.clearOnSelect=true]
 * @param {boolean}                        [props.showAttribution=true]
 */
export function GeocoderSearchControl({
	onSelect,
	id = "geocoder-search",
	placeholder = __("Search address, city, or ZIP — then press Enter", "wp-component-library"),
	limit = 8,
	countryCodes,
	minLength = 3,
	clearOnSelect = true,
	showAttribution = true,
}) {
	const [value, setValue] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);

	const containerRef = useRef(null);
	const abortRef = useRef(null);

	const runSearch = useCallback(
		async (query) => {
			const trimmed = (query || "").trim();
			if (trimmed.length < minLength) {
				setSuggestions([]);
				setShowSuggestions(false);
				setHasSearched(false);
				return;
			}

			// User mashed Enter twice — cancel the prior request so the
			// later one always wins.
			if (abortRef.current) {
				abortRef.current.abort();
			}
			const controller = new AbortController();
			abortRef.current = controller;

			setIsSearching(true);
			setHasSearched(true);
			try {
				const results = await geocodeAddress({
					query: trimmed,
					limit,
					countryCodes,
					signal: controller.signal,
				});
				if (controller.signal.aborted) return;
				setSuggestions(results);
				setShowSuggestions(true);
				setSelectedIndex(-1);
			} finally {
				if (abortRef.current === controller) {
					abortRef.current = null;
					setIsSearching(false);
				}
			}
		},
		[limit, countryCodes, minLength],
	);

	// Typing only updates local state. Editing after a search clears the
	// stale dropdown so it's obvious the user needs to re-submit.
	const handleChange = useCallback((next) => {
		setValue(next);
		setShowSuggestions(false);
		setSuggestions([]);
		setSelectedIndex(-1);
		setHasSearched(false);
	}, []);

	const handleSelect = useCallback(
		(suggestion) => {
			onSelect?.(suggestion);
			if (clearOnSelect) setValue("");
			setSuggestions([]);
			setShowSuggestions(false);
			setSelectedIndex(-1);
			setHasSearched(false);
		},
		[onSelect, clearOnSelect],
	);

	const handleKeyDown = useCallback(
		(e) => {
			// Enter picks the highlighted suggestion when the dropdown is
			// open; otherwise it submits the search.
			if (e.key === "Enter") {
				e.preventDefault();
				if (
					showSuggestions &&
					selectedIndex >= 0 &&
					suggestions[selectedIndex]
				) {
					handleSelect(suggestions[selectedIndex]);
					return;
				}
				runSearch(value);
				return;
			}

			if (e.key === "Escape") {
				setShowSuggestions(false);
				setSelectedIndex(-1);
				return;
			}

			if (!showSuggestions || suggestions.length === 0) return;

			if (e.key === "ArrowDown") {
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev < suggestions.length - 1 ? prev + 1 : prev,
				);
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
			}
		},
		[
			showSuggestions,
			suggestions,
			selectedIndex,
			handleSelect,
			runSearch,
			value,
		],
	);

	// Click-outside to dismiss.
	useEffect(() => {
		if (!showSuggestions) return undefined;
		const handler = (event) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target)
			) {
				setShowSuggestions(false);
				setSelectedIndex(-1);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [showSuggestions]);

	// Cancel any in-flight request on unmount so React doesn't try to
	// set state on a torn-down component.
	useEffect(() => {
		return () => {
			if (abortRef.current) abortRef.current.abort();
		};
	}, []);

	const canSearch = value.trim().length >= minLength && !isSearching;

	const showNoResults =
		showSuggestions &&
		!isSearching &&
		hasSearched &&
		suggestions.length === 0 &&
		value.trim().length >= minLength;

	return (
		<div ref={containerRef} className="geocoder-search">
			{/* Positioning context for the dropdown only — keeps the
			    suggestions visually flush with the bottom of the input. */}
			<div style={{ position: "relative" }}>
				<div style={{ display: "flex", gap: "6px", alignItems: "stretch" }}>
					<div style={{ flex: 1, minWidth: 0 }}>
						<SearchControl
							__nextHasNoMarginBottom
							id={id}
							value={value}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							placeholder={placeholder}
							autoComplete="off"
						/>
					</div>
					<Button
						__next40pxDefaultSize
						variant="secondary"
						icon={searchIcon}
						label={__("Search", "wp-component-library")}
						showTooltip
						disabled={!canSearch}
						onClick={() => runSearch(value)}
					/>
				</div>

				{isSearching && (
					<DropdownPanel>
						<div
							style={{
								padding: "8px 12px",
								fontSize: "13px",
								color: "#646970",
							}}
						>
							{__("Searching…", "wp-component-library")}
						</div>
					</DropdownPanel>
				)}

				{!isSearching && showSuggestions && suggestions.length > 0 && (
					<DropdownPanel>
						{suggestions.map((s, idx) => (
							<button
								type="button"
								key={s.id}
								onMouseEnter={() => setSelectedIndex(idx)}
								onClick={() => handleSelect(s)}
								style={{
									display: "block",
									width: "100%",
									textAlign: "left",
									padding: "8px 12px",
									fontSize: "13px",
									border: "none",
									borderBottom:
										idx < suggestions.length - 1
											? "1px solid #f0f0f1"
											: "none",
									background:
										idx === selectedIndex
											? "#f0f0f1"
											: "#fff",
									cursor: "pointer",
								}}
							>
								{s.displayName}
							</button>
						))}
					</DropdownPanel>
				)}

				{showNoResults && (
					<DropdownPanel>
						<div
							style={{
								padding: "8px 12px",
								fontSize: "13px",
								color: "#646970",
								fontStyle: "italic",
							}}
						>
							{__("No matches found.", "wp-component-library")}
						</div>
					</DropdownPanel>
				)}
			</div>

			{showAttribution && (
				<div
					style={{
						marginTop: "4px",
						fontSize: "11px",
						color: "#757575",
						lineHeight: 1.4,
					}}
					dangerouslySetInnerHTML={{
						__html: GEOCODER_ATTRIBUTION_HTML,
					}}
				/>
			)}
		</div>
	);
}

/**
 * Absolute-positioned panel that hangs directly below the search input.
 */
function DropdownPanel({ children }) {
	return (
		<div
			style={{
				position: "absolute",
				top: "100%",
				left: 0,
				right: 0,
				marginTop: "-1px",
				background: "#fff",
				border: "1px solid #ddd",
				borderTop: "none",
				borderRadius: "0 0 2px 2px",
				maxHeight: "260px",
				overflowY: "auto",
				zIndex: 1000,
				boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
			}}
		>
			{children}
		</div>
	);
}

export default GeocoderSearchControl;
