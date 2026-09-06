/**
 * Apply agent generate-page results into the open block editor.
 *
 * polaris-blocks registers window.__polarisApplyAgentCanvas with the real
 * createBlocksFromJSON + insert/replace implementation.
 *
 * @package
 */

import { dispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { __, sprintf } from '@wordpress/i18n';
import { AGENT_NOTICE_CONTEXT } from './agentNotices';

/**
 * @return {boolean}
 */
export function isAgentCanvasCapable() {
	return (
		typeof window !== 'undefined' &&
		typeof window.__polarisApplyAgentCanvas === 'function' &&
		!!window.wp?.data?.select?.('core/block-editor')?.getBlocks
	);
}

/**
 * @param {Object} canvas
 * @param {Array}  canvas.blocks
 * @param {string} [canvas.mode='replace']
 * @return {{ applied: boolean, count?: number, error?: string }}
 */
export function applyAgentCanvas(canvas) {
	if (!canvas || !Array.isArray(canvas.blocks) || canvas.blocks.length === 0) {
		return { applied: false, error: 'No blocks' };
	}

	if (typeof window === 'undefined' || typeof window.__polarisApplyAgentCanvas !== 'function') {
		return { applied: false, error: 'Editor canvas bridge unavailable' };
	}

	try {
		const result = window.__polarisApplyAgentCanvas({
			blocks: canvas.blocks,
			mode: canvas.mode === 'insert' ? 'insert' : 'replace',
		});
		return result && typeof result === 'object'
			? result
			: { applied: !!result };
	} catch (err) {
		return {
			applied: false,
			error: (err && err.message) || 'Failed to apply blocks',
		};
	}
}

/**
 * Apply canvas payload and show a snackbar when successful.
 *
 * @param {Object|null|undefined} canvas
 * @return {boolean}
 */
export function applyAgentCanvasWithNotice(canvas) {
	if (!canvas || !Array.isArray(canvas.blocks) || canvas.blocks.length === 0) {
		return false;
	}

	const result = applyAgentCanvas(canvas);
	if (!result.applied) {
		if (result.error) {
			dispatch(noticesStore).createNotice(
				'warning',
				result.error,
				{
					type: 'snackbar',
					isDismissible: true,
					context: AGENT_NOTICE_CONTEXT,
					id: 'polaris-ai-agent-canvas',
				}
			);
		}
		return false;
	}

	const count = result.count || canvas.blocks.length;
	dispatch(noticesStore).createNotice(
		'success',
		sprintf(
			/* translators: %d: number of top-level blocks inserted */
			__('Inserted %d blocks into the editor.', 'wp-component-library'),
			count
		),
		{
			type: 'snackbar',
			isDismissible: true,
			context: AGENT_NOTICE_CONTEXT,
			id: 'polaris-ai-agent-canvas',
		}
	);

	return true;
}
