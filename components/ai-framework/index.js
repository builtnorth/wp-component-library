/**
 * AI Content Generation Framework
 * 
 * A lightweight framework for AI-powered content generation.
 * Plugins register their own content types and behaviors.
 */

/**
 * Core AI content type registry - pure framework
 */
export class AIContentFramework {
    static types = new Map();
    
    /**
     * Register a content type
     * @param {string} type - Unique type identifier (e.g., 'plugin/type')
     * @param {Object} config - Type configuration
     */
    static registerType(type, config) {
        // Validate required methods
        if (typeof config.buildPrompt !== 'function') {
            throw new Error(`AI type "${type}" must implement buildPrompt()`);
        }
        
        // Register with defaults for optional methods
        this.types.set(type, {
            id: type,
            label: config.label || type,
            description: config.description || '',
            
            // Required
            buildPrompt: config.buildPrompt,
            
            // Optional with sensible defaults
            extractContent: config.extractContent || ((context) => context),
            validateOutput: config.validateOutput || (() => ({ valid: true })),
            postProcess: config.postProcess || ((text) => text.trim()),
            
            // UI configuration
            supportedModes: config.supportedModes || ['button', 'prompt'],
            defaultMode: config.defaultMode || 'button',
            buttonLabel: config.buttonLabel,
            buttonIcon: config.buttonIcon,
            
            // Generation options
            temperature: config.temperature ?? 0.7,
            maxTokens: config.maxTokens ?? 150,
            
            // Allow any additional config
            ...config
        });
        
        // Fire action for other plugins to know
        wp.hooks.doAction('ai_framework_type_registered', type, config);
    }
    
    /**
     * Unregister a type
     */
    static unregisterType(type) {
        this.types.delete(type);
        wp.hooks.doAction('ai_framework_type_unregistered', type);
    }
    
    /**
     * Get a registered type
     */
    static getType(type) {
        return this.types.get(type);
    }
    
    /**
     * Check if a type is registered
     */
    static hasType(type) {
        return this.types.has(type);
    }
    
    /**
     * Get all registered types
     */
    static getAllTypes() {
        return Array.from(this.types.values());
    }
    
    /**
     * Get types for a specific plugin
     */
    static getTypesForPlugin(pluginPrefix) {
        return this.getAllTypes().filter(type => type.id.startsWith(pluginPrefix + '/'));
    }
}

// Make it globally available
window.AIContentFramework = AIContentFramework;