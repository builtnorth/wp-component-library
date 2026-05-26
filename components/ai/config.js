/**
 * AI Framework — global configuration
 *
 * Call configureAI() once at your plugin's entry point before any AI
 * components or hooks are used. This keeps provider-specific details
 * (endpoint URL, default options) out of the library itself.
 *
 * @example — Polaris plugins
 *   import { configureAI } from '@builtnorth/wp-component-library';
 *   configureAI({ endpoint: '/polaris-ai/v1/generate' });
 *
 * @example — Third-party plugin
 *   configureAI({ endpoint: '/my-plugin/v1/ai/generate' });
 */

/** @type {{ endpoint: string|null }} */
const _config = {
	endpoint: null,
};

/**
 * Set global AI defaults.
 *
 * @param {Object} options
 * @param {string} [options.endpoint] REST path for the generation endpoint.
 */
export function configureAI({ endpoint } = {}) {
	if (endpoint) {
		_config.endpoint = endpoint;
	}
}

/**
 * Read the configured endpoint. Returns null when not yet configured.
 *
 * @returns {string|null}
 */
export function getAIEndpoint() {
	return _config.endpoint;
}
