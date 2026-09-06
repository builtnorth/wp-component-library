/**
 * Hook for the in-WP agent REST endpoint.
 *
 * @package
 */

import { useCallback, useReducer } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const initialState = {
	isRunning: false,
	reply: '',
	error: null,
	toolCalls: [],
	rounds: 0,
	abilities: [],
};

function agentReducer(state, action) {
	switch (action.type) {
		case 'START':
			return {
				...state,
				isRunning: true,
				error: null,
			};
		case 'SUCCESS':
			return {
				...state,
				isRunning: false,
				reply: action.payload.reply || '',
				toolCalls: action.payload.toolCalls || [],
				rounds: action.payload.rounds || 0,
				abilities: action.payload.abilities || [],
				error: null,
			};
		case 'ERROR':
			return {
				...state,
				isRunning: false,
				error: action.payload,
			};
		case 'RESET':
			return { ...initialState };
		default:
			return state;
	}
}

/**
 * Run the Polaris site assistant (`POST /polaris-ai/v1/agent`).
 *
 * @param {Object}   [options]
 * @param {number}   [options.maxRounds=4]
 * @param {string[]} [options.abilities] Optional subset of the allowlist.
 * @return {{ run: Function, isRunning: boolean, reply: string, error: string|null, toolCalls: Array, rounds: number, abilities: string[], reset: Function }}
 */
export function useAgent(options = {}) {
	const { maxRounds = 4, abilities: abilitySubset = [] } = options;
	const [state, dispatch] = useReducer(agentReducer, initialState);
	const abilityKey = JSON.stringify(abilitySubset);

	const run = useCallback(
		async (prompt) => {
			const trimmed = typeof prompt === 'string' ? prompt.trim() : '';
			if (!trimmed) {
				const err = 'Prompt is required.';
				dispatch({ type: 'ERROR', payload: err });
				throw new Error(err);
			}

			dispatch({ type: 'START' });

			try {
				const data = {
					prompt: trimmed,
					max_rounds: maxRounds,
				};
				const subset = JSON.parse(abilityKey);
				if (Array.isArray(subset) && subset.length > 0) {
					data.abilities = subset;
				}

				const result = await apiFetch({
					path: '/polaris-ai/v1/agent',
					method: 'POST',
					data,
				});

				if (!result || result.success === false) {
					const message =
						(result && (result.error || result.message)) ||
						'Agent request failed.';
					dispatch({ type: 'ERROR', payload: message });
					throw new Error(message);
				}

				dispatch({
					type: 'SUCCESS',
					payload: {
						reply: result.reply || '',
						toolCalls: result.tool_calls || [],
						rounds: result.rounds || 0,
						abilities: result.abilities || [],
					},
				});

				return result;
			} catch (err) {
				const message =
					(err && err.message) ||
					(typeof err === 'string' ? err : 'Agent request failed.');
				dispatch({ type: 'ERROR', payload: message });
				throw err;
			}
		},
		[maxRounds, abilityKey]
	);

	const reset = useCallback(() => {
		dispatch({ type: 'RESET' });
	}, []);

	return {
		run,
		reset,
		isRunning: state.isRunning,
		reply: state.reply,
		error: state.error,
		toolCalls: state.toolCalls,
		rounds: state.rounds,
		abilities: state.abilities,
	};
}
