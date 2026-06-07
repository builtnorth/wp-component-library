/**
 * Semantic status color tokens for Polaris admin surfaces.
 *
 * Resolves from AdminColorScheme CSS variables with consistent fallbacks.
 *
 * @package WPComponentLibrary
 */

/** @type {Record<string, Record<'base' | 'light' | 'dark', string>>} */
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

/**
 * @param {'success' | 'warning' | 'error' | 'info'} type
 * @param {'base' | 'light' | 'dark'} [variant='base']
 * @returns {string}
 */
export const statusVar = (type, variant = "base") => {
	const fallback = STATUS_COLOR_FALLBACKS[type]?.[variant] ?? "#646970";
	const suffix = variant === "base" ? "" : `-${variant}`;

	return `var(--color--${type}${suffix}, ${fallback})`;
};

/**
 * Surface colors for score badges, pills, and bordered indicators.
 *
 * @param {'success' | 'warning' | 'error' | 'info'} status
 * @returns {{ bg: string, text: string, border: string }}
 */
export const getStatusSurfaceColors = (status) => ({
	bg: statusVar(status, "light"),
	text: statusVar(status, "dark"),
	border: statusVar(status, "base"),
});

/**
 * @param {number} score
 * @returns {'success' | 'info' | 'warning' | 'error'}
 */
export const getScoreStatusTier = (score) => {
	if (score >= 80) {
		return "success";
	}
	if (score >= 60) {
		return "info";
	}
	if (score >= 40) {
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
		chart: statusVar(tier, "base"),
		text: statusVar(tier, "dark"),
	};
};

/**
 * Badge intent text color — error uses base for stronger contrast on light bg.
 *
 * @param {string} intent
 * @returns {{ background: string, color: string }}
 */
export const getBadgeIntentColors = (intent) => {
	switch (intent) {
		case "error":
		case "critical":
			return {
				background: statusVar("error", "light"),
				color: statusVar("error", "base"),
			};
		case "warning":
			return {
				background: statusVar("warning", "light"),
				color: statusVar("warning", "dark"),
			};
		case "info":
		case "suggestion":
			return {
				background: statusVar("info", "light"),
				color: statusVar("info", "dark"),
			};
		case "success":
		case "passed":
			return {
				background: statusVar("success", "light"),
				color: statusVar("success", "dark"),
			};
		default:
			return {
				background: "var(--color--light-gray, #f0f0f0)",
				color: "var(--color--dark-gray, #1e1e1e)",
			};
	}
};

/** Default chart series colors aligned with admin status tokens. */
export const defaultChartStatusColors = [
	"var(--color--primary, #3858e9)",
	"#646970",
	statusVar("success"),
	statusVar("warning"),
	statusVar("error"),
	"#8b5cf6",
];
