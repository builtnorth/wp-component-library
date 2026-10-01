/**
 * Admin colours by role.
 *
 * Each value reads WordPress's design tokens (`--wpds-color-*`, WP 7.1+) or
 * the admin theme colour, then a fixed fallback. polaris-dashboard maps its
 * palette and whitelabel colours onto those tokens, so screens follow the
 * brand when it is active and WordPress's defaults when it is not.
 *
 * @package WPComponentLibrary
 */

/** Neutral and brand colours. */
export const ADMIN_COLOR = {
	/** Body text and icons. */
	text: "var(--wpds-color-foreground-content-neutral, #333333)",
	/** Muted text, secondary icons. */
	muted: "var(--wpds-color-foreground-content-neutral-weak, #757575)",
	/** Cards and panels. */
	surface: "var(--wpds-color-background-surface-neutral-strong, #ffffff)",
	/** Subtle panels, hover rows, placeholders. */
	surfaceSubtle: "var(--wpds-color-background-surface-neutral-weak, #f0f0f0)",
	/** Page-level background. */
	page: "var(--wpds-color-background-surface-neutral, rgb(247, 247, 247))",
	/** Borders. */
	border: "var(--wpds-color-stroke-surface-neutral, rgb(217, 219, 222))",
	/** Dividers and faint borders. */
	borderSubtle: "var(--wpds-color-stroke-surface-neutral-weak, #f0f0f0)",
	/** Brand text, links and icons. */
	brand: "var(--wpds-color-foreground-interactive-brand, var(--wp-admin-theme-color, #3858e9))",
	/** Brand fills (buttons, bars, active states). */
	brandFill:
		"var(--wpds-color-background-interactive-brand-strong, var(--wp-admin-theme-color, #3858e9))",
	/** Hovered brand fills. */
	brandFillHover:
		"var(--wpds-color-background-interactive-brand-strong-active, var(--wp-admin-theme-color-darker-10, #2145e6))",
	/** Brand borders and outlines. */
	brandStroke: "var(--wpds-color-stroke-interactive-brand, var(--wp-admin-theme-color, #3858e9))",
	/** Text and icons on a brand fill. */
	onBrand: "var(--wpds-color-foreground-interactive-brand-strong, #ffffff)",
	/** Second chart series and secondary accents (no core token). */
	secondary: "var(--polaris-admin-color-secondary, #0F9C90)",
};
