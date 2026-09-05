/**
 * AI Framework — global configuration
 *
 * Call configureAI() once at your plugin's entry point before any AI
 * components or hooks are used.
 *
 * Prefer WordPress Abilities REST for single generation:
 *   configureAI({ transport: 'abilities' });
 *
 * Optional legacy/custom endpoint (POST { ability, input }):
 *   configureAI({ endpoint: '/my-plugin/v1/ai/generate' });
 */

/** @type {{ transport: 'abilities'|null, endpoint: string|null }} */
const _config = {
	transport: null,
	endpoint: null,
};

/**
 * Set global AI defaults.
 *
 * @param {Object} options
 * @param {'abilities'} [options.transport] Use core wp-abilities/v1/.../run.
 * @param {string}      [options.endpoint]  Legacy single REST path (ability+input body).
 */
export function configureAI({ transport, endpoint } = {}) {
	if (transport === 'abilities') {
		_config.transport = 'abilities';
	}
	if (endpoint) {
		_config.endpoint = endpoint;
	}
}

/**
 * @returns {'abilities'|null}
 */
export function getAITransport() {
	return _config.transport;
}

/**
 * Read the configured endpoint. Returns null when not yet configured.
 *
 * @returns {string|null}
 */
export function getAIEndpoint() {
	return _config.endpoint;
}

/**
 * Build an apiFetch request for an ability run.
 *
 * @param {string} abilityName Full ability id, e.g. polaris-seo/generate-seo-title.
 * @param {Object} input       Ability input payload.
 * @returns {{ path: string, method: string, data?: Object }}
 */
export function buildAbilityRunRequest(abilityName, input = {}) {
	return {
		path: `/wp-abilities/v1/abilities/${abilityName}/run`,
		method: 'POST',
		data: { input },
	};
}
