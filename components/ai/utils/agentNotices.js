/**
 * Snackbar helpers for the AI Assistant (mutation + background completion).
 *
 * Uses a dedicated notices context + SnackbarList host so toasts work on every
 * admin screen (same pattern as polaris-performance commands).
 *
 * @package
 */

import { dispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { __, sprintf } from '@wordpress/i18n';

/** Dedicated context so default SaveNotices does not double-render these. */
export const AGENT_NOTICE_CONTEXT = 'polaris-ai/agent';

/**
 * Ability leaf names that mutate site state (writes / side-effect actions).
 * generate-* is intentionally excluded — those do not persist by themselves.
 *
 * @type {RegExp[]}
 */
const MUTATION_PATTERNS = [
	/(^|\/)create-/,
	/(^|\/)update-/,
	/(^|\/)flush-/,
	/(^|\/)queue-/,
	/(^|\/)run-security/,
];

/**
 * @param {string} ability Ability name e.g. polaris/create-page.
 * @return {boolean}
 */
export function isMutationAbility(ability) {
	if (!ability || typeof ability !== 'string') {
		return false;
	}
	return MUTATION_PATTERNS.some((re) => re.test(ability));
}

/**
 * @param {Array<{ ability?: string }>} toolCalls
 * @return {string[]} Unique mutation ability names.
 */
export function getMutationAbilities(toolCalls) {
	if (!Array.isArray(toolCalls) || toolCalls.length === 0) {
		return [];
	}
	const names = toolCalls
		.map((call) => (call && call.ability ? String(call.ability) : ''))
		.filter(isMutationAbility);
	return [...new Set(names)];
}

/**
 * Human-readable snackbar for a single mutation ability.
 *
 * @param {string} ability
 * @return {string}
 */
function messageForAbility(ability) {
	const leaf = ability.includes('/') ? ability.split('/').pop() : ability;

	const known = {
		'create-page': __('Page created.', 'wp-component-library'),
		'update-page': __('Page updated.', 'wp-component-library'),
		'create-form': __('Form created.', 'wp-component-library'),
		'update-form': __('Form updated.', 'wp-component-library'),
		'update-form-confirmation': __(
			'Form confirmation updated.',
			'wp-component-library'
		),
		'create-listing': __('Listing created.', 'wp-component-library'),
		'update-listing': __('Listing updated.', 'wp-component-library'),
		'update-organization': __('Organization updated.', 'wp-component-library'),
		'update-post-seo': __('Post SEO updated.', 'wp-component-library'),
		'create-redirect': __('Redirect created.', 'wp-component-library'),
		'update-redirect': __('Redirect updated.', 'wp-component-library'),
		'queue-seo-bulk': __('SEO bulk job queued.', 'wp-component-library'),
		'update-analytics-settings': __(
			'Analytics settings updated.',
			'wp-component-library'
		),
		'flush-caches': __('Caches flushed.', 'wp-component-library'),
		'run-security-scan': __('Security scan started.', 'wp-component-library'),
		'update-backup-settings': __(
			'Backup settings updated.',
			'wp-component-library'
		),
		'create-backup': __('Backup created.', 'wp-component-library'),
	};

	if (known[leaf]) {
		return known[leaf];
	}

	return __('Assistant applied site changes.', 'wp-component-library');
}

/**
 * @param {string[]} mutations
 * @param {boolean} wasHidden
 * @return {string|null} Snackbar copy, or null to skip.
 */
export function buildAgentOutcomeMessage(mutations, wasHidden) {
	const hasMutations = mutations.length > 0;

	if (!hasMutations && !wasHidden) {
		return null;
	}

	if (!hasMutations && wasHidden) {
		return __('Assistant finished.', 'wp-component-library');
	}

	if (hasMutations && wasHidden) {
		return __('Assistant finished — site changes applied.', 'wp-component-library');
	}

	// Visible + mutations
	if (mutations.length === 1) {
		return messageForAbility(mutations[0]);
	}

	return sprintf(
		/* translators: %d: number of mutating tool calls */
		__('Assistant applied %d site changes.', 'wp-component-library'),
		mutations.length
	);
}

/**
 * Show a snackbar for a successful agent run when useful (mutations and/or
 * completion while the tab was hidden). Does not snackbar modal errors.
 *
 * @param {Object} options
 * @param {Array<{ ability?: string }>} [options.toolCalls]
 * @param {boolean} [options.wasHidden]
 */
export function notifyAgentOutcome({ toolCalls = [], wasHidden = false } = {}) {
	const mutations = getMutationAbilities(toolCalls);
	const message = buildAgentOutcomeMessage(mutations, wasHidden);

	if (!message) {
		return;
	}

	dispatch(noticesStore).createNotice('success', message, {
		type: 'snackbar',
		isDismissible: true,
		context: AGENT_NOTICE_CONTEXT,
		id: 'polaris-ai-agent-outcome',
	});
}
