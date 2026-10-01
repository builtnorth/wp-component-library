/**
 * Status colours for Polaris admin surfaces.
 *
 * Each value reads WordPress's design tokens (`--wpds-color-*`, WP 7.1+),
 * then a fixed fallback. polaris-dashboard maps its status colours onto those
 * tokens. Warning uses core's `caution` family, as core's Notice does.
 *
 * @package WPComponentLibrary
 */

import { ADMIN_COLOR } from "./adminColors";

/**
 * Fixed fallbacks (polaris-dashboard's default status colours).
 *
 * @type {Record<string, Record<'base' | 'light' | 'dark', string>>}
 */
export const STATUS_COLOR_FALLBACKS = {
	success: {
		base: "#4ab866",
		light: "#edfaef",
		dark: "#007017",
	},
	warning: {
		base: "#f0b849",
		light: "#fef8e6",
		dark: "#b26200",
	},
	error: {
		base: "#cc1818",
		light: "#fcebea",
		dark: "#8a0000",
	},
	info: {
		base: "#3858e9",
		light: "#e6f2ff",
		dark: "#005cb8",
	},
};

/** Core design-token family for each status. */
const CORE_FAMILY = {
	success: "success",
	warning: "caution",
	error: "error",
	info: "info",
};

/**
 * Core token for each role, and the fallback variant it uses.
 *
 * - content: text on a tinted surface
 * - accent: text, icons and chart series on neutral chrome
 * - stroke: borders, dots and markers
 * - surface: tinted backgrounds
 */
const ROLES = {
	content: ["foreground-content-%s", "dark"],
	accent: ["foreground-content-%s-weak", "base"],
	stroke: ["stroke-surface-%s-strong", "base"],
	surface: ["background-surface-%s-weak", "light"],
};

/**
 * A status colour by role.
 *
 * @param {'success' | 'warning' | 'error' | 'info'} type
 * @param {'content' | 'accent' | 'stroke' | 'surface'} [role='accent']
 * @returns {string}
 */
export const statusColor = (type, role = "accent") => {
	const [token, variant] = ROLES[role] ?? ROLES.accent;
	const family = CORE_FAMILY[type] ?? "error";
	const fallback = STATUS_COLOR_FALLBACKS[type]?.[variant] ?? "#646970";

	return `var(--wpds-color-${token.replace("%s", family)}, ${fallback})`;
};

/**
 * A status colour by variant: base (text and icons), light (tinted
 * backgrounds) or dark (text on a tinted background).
 *
 * @param {'success' | 'warning' | 'error' | 'info'} type
 * @param {'base' | 'light' | 'dark'} [variant='base']
 * @returns {string}
 */
export const statusVar = (type, variant = "base") => {
	const role = { base: "accent", light: "surface", dark: "content" }[variant] ?? "accent";

	return statusColor(type, role);
};

/**
 * Surface colors for score badges, pills, and bordered indicators.
 *
 * @param {'success' | 'warning' | 'error' | 'info'} status
 * @returns {{ bg: string, text: string, border: string }}
 */
export const getStatusSurfaceColors = (status) => ({
	bg: statusColor(status, "surface"),
	text: statusColor(status, "content"),
	border: statusColor(status, "stroke"),
});

/**
 * Map a 0–100 score onto the four status intents.
 *
 * @param {number} score
 * @returns {'success' | 'info' | 'warning' | 'error'}
 */
export const getScoreStatusTier = (score) => {
	const value = Number(score);

	if (!Number.isFinite(value)) {
		return "error";
	}

	if (value >= 90) {
		return "success";
	}
	if (value >= 70) {
		return "info";
	}
	if (value >= 50) {
		return "warning";
	}

	return "error";
};

/**
 * @param {number} score
 * @returns {{ bg: string, text: string, border: string }}
 */
export const getScoreSurfaceColors = (score) =>
	getStatusSurfaceColors(getScoreStatusTier(score));

/**
 * @param {number} score
 * @returns {{ chart: string, text: string }}
 */
export const getScoreChartColors = (score) => {
	const tier = getScoreStatusTier(score);

	return {
		chart: statusColor(tier, "accent"),
		text: statusColor(tier, "content"),
	};
};

/**
 * Badge intent text color — error uses the accent for stronger contrast on a
 * light background.
 *
 * @param {string} intent
 * @returns {{ background: string, color: string }}
 */
export const getBadgeIntentColors = (intent) => {
	switch (intent) {
		case "error":
		case "critical":
			return {
				background: statusColor("error", "surface"),
				color: statusColor("error", "accent"),
			};
		case "warning":
			return {
				background: statusColor("warning", "surface"),
				color: statusColor("warning", "content"),
			};
		case "info":
		case "suggestion":
			return {
				background: statusColor("info", "surface"),
				color: statusColor("info", "content"),
			};
		case "success":
		case "passed":
			return {
				background: statusColor("success", "surface"),
				color: statusColor("success", "content"),
			};
		default:
			return {
				background: ADMIN_COLOR.surfaceSubtle,
				color: ADMIN_COLOR.text,
			};
	}
};

/** Default chart series colors aligned with admin status tokens. */
export const defaultChartStatusColors = [
	ADMIN_COLOR.brandFill,
	"#646970",
	statusColor("success"),
	statusColor("warning"),
	statusColor("error"),
	"#8b5cf6",
];
