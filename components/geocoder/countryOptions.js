/**
 * Country options for the address fields. Codes match Siratik\Utility\Utilities\CountryList;
 * names come from the browser (Intl.DisplayNames) so they follow the admin's language.
 *
 * @package Siratik/WP-Component-Library
 */

const COUNTRY_CODES = [
	"AF", "AL", "DZ", "AD", "AO", "AG", "AR", "AM", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY",
	"BE", "BZ", "BJ", "BT", "BO", "BA", "BW", "BR", "BN", "BG", "BF", "BI", "CV", "KH", "CM", "CA",
	"CF", "TD", "CL", "CN", "CO", "KM", "CD", "CG", "CR", "HR", "CU", "CY", "CZ", "DK", "DJ", "DM",
	"DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FJ", "FI", "FR", "GA", "GM", "GE", "DE",
	"GH", "GR", "GD", "GT", "GN", "GW", "GY", "HT", "HN", "HU", "IS", "IN", "ID", "IR", "IQ", "IE",
	"IL", "IT", "JM", "JP", "JO", "KZ", "KE", "KI", "KP", "KR", "XK", "KW", "KG", "LA", "LV", "LB",
	"LS", "LR", "LY", "LI", "LT", "LU", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MR", "MU", "MX",
	"FM", "MD", "MC", "MN", "ME", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NZ", "NI", "NE", "NG",
	"MK", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PL", "PT", "QA", "RO", "RU",
	"RW", "KN", "LC", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SK", "SI", "SB",
	"SO", "ZA", "SS", "ES", "LK", "SD", "SR", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG",
	"TO", "TT", "TN", "TR", "TM", "TV", "UG", "UA", "AE", "GB", "US", "UY", "UZ", "VU", "VA", "VE",
	"VN", "YE", "ZM", "ZW",
];

/**
 * Display name for a country code, falling back to the code itself.
 *
 * @param {Intl.DisplayNames|null} names
 * @param {string}                 code
 * @returns {string}
 */
function countryName(names, code) {
	try {
		return names?.of(code) || code;
	} catch {
		return code;
	}
}

/**
 * SelectControl options sorted by name. A saved code that isn't in the list
 * (e.g. a territory a search returned) is kept as an option so it isn't lost.
 *
 * @param {string} [currentCode] The saved country code.
 * @returns {{label:string,value:string}[]}
 */
export function getCountryOptions(currentCode = "") {
	let names = null;
	try {
		names = new Intl.DisplayNames(
			[document.documentElement.lang || "en"],
			{ type: "region" },
		);
	} catch {
		names = null;
	}

	const codes = [...COUNTRY_CODES];
	const current = String(currentCode || "").toUpperCase();
	if (/^[A-Z]{2}$/.test(current) && !codes.includes(current)) {
		codes.push(current);
	}

	return codes
		.map((code) => ({ value: code, label: countryName(names, code) }))
		.sort((a, b) => a.label.localeCompare(b.label));
}
