/**
 * Shared geocoding helper for admin and editor address search.
 *
 * Uses Nominatim (OpenStreetMap) — free, no API key required.
 *
 * IMPORTANT — Nominatim usage policy:
 *   https://operations.osmfoundation.org/policies/nominatim/
 *
 *   - Hard limit: 1 request/second
 *   - **No autocomplete-style as-you-type queries.** Callers MUST be
 *     explicit-submit (Enter / button click) and NOT fire on every
 *     keystroke or debounced keystroke burst. Use
 *     `<GeocoderSearchControl>` which enforces this pattern.
 *   - Provide visible attribution (see `GEOCODER_ATTRIBUTION_HTML`).
 *
 * Returns normalized `GeocodeResult` objects so consumers don't have
 * to care about the raw provider response shape — this keeps the door
 * open to swapping in LocationIQ/MapTiler/Pelias later (those services
 * DO support autocomplete) without touching the React components.
 *
 * @package Siratik/WP-Component-Library
 */

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";

// ---------------------------------------------------------------------------
// Per-session geocode result cache
//
// Nominatim's own usage policy encourages result caching. sessionStorage is
// ideal: results are scoped to the browser tab (not persisted cross-session),
// which keeps data fresh while eliminating redundant round-trips when the
// user re-searches the same address within the same admin session.
//
// TTL: 10 minutes — protects against stale results after map updates while
// still providing meaningful cache hits during normal admin workflows.
// ---------------------------------------------------------------------------
const GEOCODE_CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * Build a stable sessionStorage key from the geocode parameters.
 *
 * @param {string}   query
 * @param {number}   limit
 * @param {string[]} countryCodes
 * @returns {string}
 */
function buildCacheKey(query, limit, countryCodes) {
	const payload = JSON.stringify({
		q: query.toLowerCase().trim(),
		l: limit,
		cc: Array.isArray(countryCodes) ? [...countryCodes].sort() : [],
	});
	try {
		return "geocode_" + btoa(encodeURIComponent(payload)).slice(0, 80);
	} catch {
		// btoa may throw on unusual unicode — fall back to raw (still unique).
		return "geocode_" + encodeURIComponent(payload).slice(0, 80);
	}
}

/**
 * @param {string} key
 * @returns {GeocodeResult[]|null}
 */
function readGeocodeCache(key) {
	try {
		const raw = sessionStorage.getItem(key);
		if (!raw) return null;
		const { ts, data } = JSON.parse(raw);
		if (Date.now() - ts > GEOCODE_CACHE_TTL_MS) {
			sessionStorage.removeItem(key);
			return null;
		}
		return data;
	} catch {
		return null;
	}
}

/**
 * @param {string}         key
 * @param {GeocodeResult[]} data
 */
function writeGeocodeCache(key, data) {
	try {
		sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
	} catch {
		// sessionStorage may be full or unavailable (private-browsing mode,
		// storage quota exceeded, etc.) — silently skip caching.
	}
}

/**
 * Countries we currently serve. Constrains Nominatim to these so US
 * street searches don't compete with global noise (e.g. typing "600"
 * returning Iceland / Lesotho / Taiwan before any US address).
 *
 * Override per-call by passing `countryCodes` to `geocodeAddress`,
 * or pass `countryCodes={[]}` (or any custom list) to
 * `<GeocoderSearchControl>` to search globally / a different set.
 */
export const DEFAULT_GEOCODER_COUNTRY_CODES = Object.freeze([
	"us", // United States
	"ca", // Canada
	"au", // Australia
	"gb", // United Kingdom
	"ie", // Ireland
]);

/**
 * @typedef {Object} GeocodeAddress
 * @property {string} street       House number + road (or just road).
 * @property {string} houseNumber
 * @property {string} road
 * @property {string} city         city || town || village || hamlet || suburb
 * @property {string} state
 * @property {string} postcode
 * @property {string} country
 * @property {string} countryCode  ISO-3166-1 alpha-2, uppercase.
 */

/**
 * @typedef {Object} GeocodeResult
 * @property {string}         id          Stable key for React lists.
 * @property {string}         displayName Short, comma-separated label.
 * @property {number}         lat
 * @property {number}         lng
 * @property {GeocodeAddress} address     Structured address fields.
 * @property {string}         type        OSM type/category (e.g. "house", "city").
 * @property {number}         importance  Nominatim importance score (0..1).
 */

/**
 * Run a forward geocode against Nominatim.
 *
 * @param {Object}      options
 * @param {string}      options.query
 * @param {number}      [options.limit=8]
 * @param {string}      [options.acceptLanguage="en"]
 * @param {string[]}    [options.countryCodes]  ISO 3166-1 alpha-2 list to constrain results to.
 *                                              Defaults to DEFAULT_GEOCODER_COUNTRY_CODES.
 *                                              Pass an empty array to search globally.
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<GeocodeResult[]>}
 */
export async function geocodeAddress({
	query,
	limit = 8,
	acceptLanguage = "en",
	countryCodes = DEFAULT_GEOCODER_COUNTRY_CODES,
	signal,
} = {}) {
	const trimmed = (query || "").trim();
	if (trimmed.length < 3) return [];

	// Check session cache before hitting the network.
	const cacheKey = buildCacheKey(trimmed, limit, countryCodes);
	const cached = readGeocodeCache(cacheKey);
	if (cached) return cached;

	const params = new URLSearchParams({
		q: trimmed,
		format: "jsonv2",
		addressdetails: "1",
		dedupe: "1",
		limit: String(limit),
		"accept-language": acceptLanguage,
	});

	if (Array.isArray(countryCodes) && countryCodes.length > 0) {
		params.set(
			"countrycodes",
			countryCodes
				.filter((c) => typeof c === "string" && c.length === 2)
				.map((c) => c.toLowerCase())
				.join(","),
		);
	}

	try {
		const response = await fetch(`${NOMINATIM_BASE}?${params.toString()}`, {
			headers: { Accept: "application/json" },
			signal,
		});
		if (!response.ok) return [];
		const data = await response.json();
		if (!Array.isArray(data)) return [];
		const results = data.map(toGeocodeResult).filter(Boolean);
		writeGeocodeCache(cacheKey, results);
		return results;
	} catch (err) {
		// Aborted requests are expected (explicit-submit UX can still abort
		// an in-flight request if the user submits a new search quickly).
		if (err?.name === "AbortError") return [];
		console.error("Nominatim geocoding error:", err);
		return [];
	}
}

/**
 * Normalize a raw Nominatim feature into a GeocodeResult.
 *
 * @param {Object} item
 * @returns {GeocodeResult|null}
 */
function toGeocodeResult(item) {
	const lat = Number(item.lat);
	const lng = Number(item.lon);
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

	const a = item.address || {};
	const houseNumber = a.house_number || "";
	const road = a.road || a.pedestrian || a.footway || a.cycleway || "";
	const street = houseNumber && road ? `${houseNumber} ${road}` : road;

	return {
		id: `${item.osm_type ?? "x"}-${item.osm_id ?? `${lng},${lat}`}-${item.place_id ?? ""}`,
		displayName: formatDisplayName(item, { street, road }),
		lat,
		lng,
		address: {
			street,
			houseNumber,
			road,
			city: a.city || a.town || a.village || a.hamlet || a.suburb || "",
			state: a.state || a.region || a["ISO3166-2-lvl4"] || "",
			postcode: a.postcode || "",
			country: a.country || "",
			countryCode: (a.country_code || "").toUpperCase(),
		},
		type: item.type || item.category || "",
		importance: typeof item.importance === "number" ? item.importance : 0,
	};
}

/**
 * Build a short, readable label. Nominatim's own `display_name` is
 * comma-heavy and very long ("Boston, Suffolk County, Massachusetts,
 * United States, 02108, United States of America") so we rebuild it
 * from the structured address fields.
 */
function formatDisplayName(item, { street, road }) {
	const a = item.address || {};
	const parts = [];

	if (street) {
		parts.push(street);
	} else if (road) {
		parts.push(road);
	} else {
		const poi =
			a.amenity ||
			a.shop ||
			a.tourism ||
			a.leisure ||
			a.office ||
			a.building ||
			item.name;
		if (poi) parts.push(poi);
	}

	const city = a.city || a.town || a.village || a.hamlet || a.suburb;
	if (city) parts.push(city);
	if (a.state) parts.push(a.state);
	if (a.postcode) parts.push(a.postcode);
	if (a.country_code) parts.push(a.country_code.toUpperCase());

	return parts.length ? parts.join(", ") : item.display_name || "";
}

/**
 * Convert a GeocodeResult into the organization location
 * field shape consumed by LocationMapField.
 *
 * @param {GeocodeResult} result
 * @returns {{street:string,city:string,state:string,zip:string,country:string,lat:number,lng:number}|null}
 */
export function toOrganizationLocation(result) {
	if (!result) return null;
	const a = result.address;
	return {
		street: a.street || "",
		city: a.city || "",
		state: a.state || "",
		zip: a.postcode || "",
		country: a.countryCode || "US",
		lat: result.lat,
		lng: result.lng,
	};
}

/**
 * Visible attribution required by the Nominatim usage policy.
 * Render this somewhere near the search control (small print is fine).
 */
export const GEOCODER_ATTRIBUTION_HTML =
	'Search by <a href="https://nominatim.openstreetmap.org" target="_blank" rel="noopener noreferrer">Nominatim</a> / © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';
