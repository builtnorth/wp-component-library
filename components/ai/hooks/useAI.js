import { useState, useCallback, useReducer } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { aiCache } from '../services/AICache';

// Reducer for managing AI generation state
const aiReducer = (state, action) => {
    switch (action.type) {
        case 'START_GENERATION':
            return {
                ...state,
                isGenerating: true,
                error: null
            };
            
        case 'SUCCESS':
            return {
                ...state,
                isGenerating: false,
                value: action.payload,
                lastProvider: action.provider,
                history: [...state.history.slice(-9), action.payload],
                attempts: 0
            };
            
        case 'ERROR':
            return {
                ...state,
                isGenerating: false,
                error: action.payload,
                attempts: state.attempts + 1
            };
            
        case 'RETRY':
            return {
                ...state,
                attempts: state.attempts + 1
            };
            
        case 'UNDO':
            const previous = state.history[state.history.length - 1];
            return {
                ...state,
                value: previous || state.value,
                history: state.history.slice(0, -1)
            };
            
        case 'RESET':
            return {
                ...action.initialState,
                history: []
            };
            
        default:
            return state;
    }
};

/**
 * Main AI generation hook
 * Completely type-driven - the backend handles everything based on the type config
 */
export function useAI(typeId, options = {}) {
    const initialState = {
        value: options.initialValue || '',
        isGenerating: false,
        error: null,
        lastProvider: null,
        history: [],
        attempts: 0
    };
    
    const [state, dispatch] = useReducer(aiReducer, initialState);
    
    const generate = useCallback(async (overrides = {}) => {
        dispatch({ type: 'START_GENERATION' });
        
        try {
            // Determine if this is an SEO type (needs special handling)
            const isSEOType = typeId && typeof typeId === 'string' && typeId.startsWith('polaris-seo/');
            
            // Check if we should skip cache (manual trigger or SEO types which need variety)
            const shouldSkipCache = options.skipCache || overrides._skipCache || isSEOType;
            
            // Check cache if not skipping
            if (!shouldSkipCache) {
                const cacheKey = aiCache.generateKey(typeId, {});
                const cached = await aiCache.get(cacheKey);
                if (cached) {
                    console.log('Using cached AI response');
                    dispatch({ 
                        type: 'SUCCESS', 
                        payload: cached,
                        provider: 'cache'
                    });
                    if (options.onChange) {
                        options.onChange(cached);
                    }
                    return cached;
                }
            }
            
            // Get current post ID for context
            const editor = wp.data && wp.data.select ? wp.data.select('core/editor') : null;
            const postId = editor ? editor.getCurrentPostId() : null;
            
            // Build the full context
            const fullContext = {
                post_id: postId,
                ...options.context,
                ...overrides, // Include all overrides in context
                // Add variety flag if manually triggered
                force_variety: shouldSkipCache || overrides.force_variety
            };
            
            // Route SEO types through job-dispatcher for consistency
            // This ensures single posts use the same system as bulk operations
            let response;
            
            if (isSEOType && postId) {
                // Use the new job-dispatcher endpoint for SEO single posts
                // Determine which type to generate based on typeId
                let generationType = 'both';
                if (typeId === 'polaris-seo/title') {
                    generationType = 'title';
                } else if (typeId === 'polaris-seo/meta-description') {
                    generationType = 'description';
                }
                
                response = await apiFetch({
                    path: '/polaris-seo/v1/ai/generate-single',
                    method: 'POST',
                    data: {
                        post_id: postId,
                        type: generationType
                        // test_mode can be passed via overrides if needed for testing
                    }
                });
                
                // Extract the appropriate field from the response
                if (response && response.success) {
                    if (typeId === 'polaris-seo/title') {
                        response = { text: response.title || '', provider: 'job-dispatcher' };
                    } else if (typeId === 'polaris-seo/meta-description') {
                        response = { text: response.description || '', provider: 'job-dispatcher' };
                    } else {
                        // For 'both' type, return the first non-empty field
                        response = { 
                            text: response.title || response.description || '', 
                            provider: 'job-dispatcher' 
                        };
                    }
                } else {
                    throw new Error((response && response.message) || 'Generation failed');
                }
            } else {
                // Use the standard Polaris endpoint for non-SEO types
                response = await apiFetch({
                    path: '/polaris/v1/ai/generate',
                    method: 'POST',
                    data: {
                        type: typeId,
                        context: fullContext
                    }
                });
            }
            
            // Process response
            const processedText = response.text || response;
            
            dispatch({ 
                type: 'SUCCESS', 
                payload: processedText,
                provider: response.provider || 'unknown'
            });
            
            // Cache the result (only if not manually triggered and not an SEO type)
            // Using the isSEOType variable already declared above
            if (!shouldSkipCache && !isSEOType) {
                const cacheKey = aiCache.generateKey(typeId, {});
                await aiCache.set(cacheKey, processedText, options.cacheTimeout);
            }
            
            // Call onChange callback if provided
            if (options.onChange) {
                options.onChange(processedText);
            }
            
            return processedText;
            
        } catch (error) {
            console.error('AI Generation Error:', error);
            dispatch({ type: 'ERROR', payload: error.message || 'Generation failed' });
            
            if (options.onError) {
                options.onError(error);
            }
            
            throw error;
        }
    }, [typeId, options]);
    
    return {
        ...state,
        generate,
        canUndo: state.history.length > 0,
        reset: () => dispatch({ type: 'RESET', initialState }),
        undo: () => dispatch({ type: 'UNDO' })
    };
}