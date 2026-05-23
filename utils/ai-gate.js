/**
 * AI Feature Gate — JS utility
 *
 * Reads the AI gate flags that Polaris PHP localizes into the block editor
 * (window.polaris_localize.blocks.editor_experience.ai) and the admin
 * (window.polarisLocalizeAdmin.ai).
 *
 * Use isAiEnabled() before rendering any AI UI component. Components that
 * render null when disabled produce no DOM, no network requests, and no
 * keyboard shortcuts — matching the PHP-side gate.
 */

/**
 * Get the AI gate data from whichever window context has it.
 * Handles the editor iframe / canvas iframe chain gracefully.
 *
 * @returns {{ enabled: boolean, available: boolean, features_visible: boolean, setup_required: boolean }}
 */
function getAiGateData() {
    // 1. Block editor Redux store — most reliable source.
    //    PHP injects this via block_editor_settings_all (filter_editor_settings),
    //    and wp.data is shared across all iframe contexts in the block editor.
    try {
        /* global wp */
        const storeSettings = wp?.data
            ?.select('core/block-editor')
            ?.getSettings?.();
        if (storeSettings?.polarisAi) {
            return storeSettings.polarisAi;
        }
    } catch ( _e ) {
        // wp.data may not be available in non-editor contexts — continue below.
    }

    // 2. polaris_localize (inline script on wp-blocks, main admin document).
    //    Also check window.parent in case we are inside an iframe canvas.
    const editorAi =
        window.polaris_localize?.blocks?.editor_experience?.ai ||
        window.parent?.polaris_localize?.blocks?.editor_experience?.ai;
    if (editorAi) {
        return editorAi;
    }

    // 3. Admin context: polarisLocalizeAdmin.ai (LocalizationManager).
    const adminAi =
        window.polarisLocalizeAdmin?.ai ||
        window.parent?.polarisLocalizeAdmin?.ai;
    if (adminAi) {
        return adminAi;
    }

    // Safe defaults — hide everything when no data is present.
    return {
        enabled: false,
        available: false,
        features_visible: false,
        setup_required: false,
    };
}

/**
 * Whether AI features should be visible. True whenever the AI policy is
 * enabled (editor_experience.enable_ai = true), regardless of whether a
 * provider key has been configured. If a user clicks an AI button without
 * a provider, the REST API will return a descriptive error.
 *
 * @returns {boolean}
 */
export function isAiEnabled() {
    return getAiGateData().enabled === true;
}

/**
 * Alias of isAiEnabled(). Kept for semantic clarity in places that
 * explicitly want to check the policy layer only (e.g. integration card
 * filtering).
 *
 * @returns {boolean}
 */
export function isAiPolicyEnabled() {
    return getAiGateData().enabled === true;
}

/**
 * Whether AI is fully configured: policy on AND a provider key is active.
 * Use this when you need to differentiate between "policy on, no key" and
 * "policy on, ready to generate" (e.g. showing a provider-setup notice).
 *
 * @returns {boolean}
 */
export function isAiFullyConfigured() {
    return getAiGateData().features_visible === true;
}

/**
 * Whether AI is policy-enabled but no provider has been configured yet.
 * Use this to show a "set up your AI provider" notice in the admin.
 *
 * @returns {boolean}
 */
export function isAiSetupRequired() {
    return getAiGateData().setup_required === true;
}
