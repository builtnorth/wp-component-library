import { useCallback, useReducer } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { aiCache } from '../services/AICache';
import { buildAbilityRunRequest, getAIEndpoint, getAITransport } from '../config';

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
 * Normalize ability result for field consumers.
 * Objects like { title: '...' } / { description: '...' } unwrap to the string.
 *
 * @param {*} result
 * @returns {*}
 */
function normalizeAbilityResult(result) {
    if (result && typeof result === 'object' && !Array.isArray(result)) {
        // Legacy polaris-ai envelope
        if (Object.prototype.hasOwnProperty.call(result, 'data') && Object.prototype.hasOwnProperty.call(result, 'success')) {
            return normalizeAbilityResult(result.data);
        }
        const keys = Object.keys(result);
        // Single string field wrappers: { title: '...' }, { description: '...' }
        if (keys.length === 1 && typeof result[keys[0]] === 'string') {
            return result[keys[0]];
        }
    }
    return result;
}

/**
 * Main AI generation hook
 * Completely type-driven - the backend handles everything based on the ability
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
            // Check if we should skip cache (manual trigger or option)
            const shouldSkipCache = options.skipCache || overrides._skipCache;
            
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
            
            const transport = options.transport || getAITransport();
            const endpoint = options.customEndpoint || getAIEndpoint();
            const customRequestBuilder = options.buildRequest;

            if (!transport && !endpoint && !customRequestBuilder) {
                const msg = 'useAI: no transport/endpoint configured. Call configureAI({ transport: \'abilities\' }) at your plugin entry point.';
                console.error(msg);
                throw new Error(msg);
            }
            
            let response;

            if (customRequestBuilder && typeof customRequestBuilder === 'function') {
                const customRequest = customRequestBuilder(typeId, fullContext, postId);
                if (customRequest) {
                    response = await apiFetch(customRequest);
                } else if (transport === 'abilities') {
                    response = await apiFetch(buildAbilityRunRequest(typeId, fullContext));
                } else {
                    response = await apiFetch({
                        path: endpoint,
                        method: 'POST',
                        data: {
                            ability: typeId,
                            input: fullContext
                        }
                    });
                }
            } else if (transport === 'abilities') {
                response = await apiFetch(buildAbilityRunRequest(typeId, fullContext));
            } else {
                response = await apiFetch({
                    path: endpoint,
                    method: 'POST',
                    data: {
                        ability: typeId,
                        input: fullContext
                    }
                });
            }

            const responseData = normalizeAbilityResult(response?.data ?? response);
            
            dispatch({ 
                type: 'SUCCESS', 
                payload: responseData,
                provider: response.provider || 'unknown'
            });
            
            // Cache the result (only if not manually triggered)
            if (!shouldSkipCache) {
                const cacheKey = aiCache.generateKey(typeId, {});
                await aiCache.set(cacheKey, responseData, options.cacheTimeout);
            }
            
            // Call onChange callback if provided
            if (options.onChange) {
                options.onChange(responseData);
            }
            
            return responseData;
            
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
