/**
 * Resolve card template part options for a post type.
 *
 * Override via editor_experience.card_templates[postType] in the host plugin's
 * localize config (window.polaris_localize.blocks.editor_experience).
 *
 * @param {string} postType Post type slug.
 * @returns {string[]} Slug prefixes — a part matches if slug equals prefix or starts with prefix + '-'.
 */
export function getCardSlugPrefixesForPostType(postType) {
	if (!postType) {
		return ["card-"];
	}

	const config =
		typeof window !== "undefined" &&
		window.polaris_localize?.blocks?.editor_experience?.card_templates?.[
			postType
		];

	if (Array.isArray(config) && config.length > 0) {
		return config.map((entry) =>
			typeof entry === "string" ? entry : entry?.slug,
		).filter(Boolean);
	}

	const knownPrefixes = {
		polaris_service: ["card-service"],
		polaris_team: ["card-team"],
		polaris_coupon: ["card-coupon"],
		polaris_listing: ["polaris_listing-card", "card-listing"],
		polaris_review: ["polaris_review-card", "card-review"],
		post: ["post-card", "card-post"],
		page: ["page-card", "card-page"],
		search: ["search-result-card", "card-search"],
	};

	if (knownPrefixes[postType]) {
		return knownPrefixes[postType];
	}

	const base = postType.replace(/^polaris_/, "");

	return [`card-${base}`, `${postType}-card`];
}

/**
 * @param {string} slug Template part slug.
 * @param {string} postType Post type slug.
 * @param {Function} [customFilter] Optional (slug, postType) => boolean.
 * @returns {boolean}
 */
export function cardTemplatePartMatchesPostType(slug, postType, customFilter) {
	if (typeof customFilter === "function") {
		return customFilter(slug, postType);
	}

	if (!slug) {
		return false;
	}

	const prefixes = getCardSlugPrefixesForPostType(postType);

	return prefixes.some(
		(prefix) => slug === prefix || slug.startsWith(`${prefix}-`),
	);
}

/**
 * Default card slug for a post type (first configured prefix).
 *
 * @param {string} postType Post type slug.
 * @returns {string}
 */
export function getDefaultCardSlugForPostType(postType) {
	const prefixes = getCardSlugPrefixesForPostType(postType);

	return prefixes[0] || `${postType}-card`;
}

/**
 * Build select options from template part entities.
 *
 * @param {Array} templateParts wp_template_part records.
 * @param {string} postType Post type slug.
 * @param {Function} [slugFilter] Optional filter.
 * @returns {Array<{ label: string, value: string }>}
 */
export function buildCardTemplatePartOptions(
	templateParts,
	postType,
	slugFilter,
) {
	if (!templateParts?.length) {
		return [];
	}

	const filtered = templateParts.filter((part) =>
		cardTemplatePartMatchesPostType(part.slug, postType, slugFilter),
	);

	return filtered.map((part) => ({
		label: part.title?.rendered || part.title || part.slug,
		value: part.slug,
	}));
}
