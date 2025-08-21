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
            // Check if we should skip cache (manual trigger or SEO types which need variety)
            const shouldSkipCache = options.skipCache || overrides._skipCache || 
                                  typeId.includes('seo/title') || typeId.includes('seo/meta');
            
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
            const postId = wp.data.select('core/editor')?.getCurrentPostId();
            
            // Build the full context
            const fullContext = {
                post_id: postId,
                ...options.context,
                ...overrides, // Include all overrides in context
                // Add variety flag if manually triggered
                force_variety: shouldSkipCache || overrides.force_variety
            };
            
            // Call Polaris core endpoint - it handles everything
            // Fetches config, extracts data, builds prompt
            const response = await apiFetch({
                path: '/polaris/v1/ai/generate',
                method: 'POST',
                data: {
                    type: typeId,
                    context: fullContext
                }
            });
            
            // Process response
            const processedText = response.text || response;
            
            dispatch({ 
                type: 'SUCCESS', 
                payload: processedText,
                provider: response.provider || 'unknown'
            });
            
            // Cache the result (only if not manually triggered and not an SEO type)
            const isSEOType = typeId.includes('seo/title') || typeId.includes('seo/meta');
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