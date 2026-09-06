/**
 * AgentPanel — prompt + reply UI for the in-WP site assistant.
 *
 * @package
 */

import { useState } from '@wordpress/element';
import {
	Button,
	Modal,
	TextareaControl,
	Notice,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { aiSparkle } from '../utils/icons';
import { useAgent } from '../hooks/useAgent';

/**
 * @param {Object}   props
 * @param {boolean}  props.isOpen
 * @param {Function} props.onClose
 * @param {number}   [props.maxRounds=4]
 * @param {string[]} [props.abilities]
 */
export function AgentPanel({
	isOpen,
	onClose,
	maxRounds = 4,
	abilities = [],
}) {
	const [prompt, setPrompt] = useState('');
	const { run, isRunning, reply, error, toolCalls, rounds, reset } = useAgent({
		maxRounds,
		abilities,
	});

	if (!isOpen) {
		return null;
	}

	const handleClose = () => {
		reset();
		setPrompt('');
		onClose();
	};

	const handleSend = async () => {
		try {
			await run(prompt);
		} catch {
			// Error held in hook state.
		}
	};

	return (
		<Modal
			title={__('AI Assistant', 'wp-component-library')}
			onRequestClose={handleClose}
			className="polaris-ai-agent-panel"
			style={{ maxWidth: '560px' }}
			icon={aiSparkle}
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
				<TextareaControl
					label={__('What do you need?', 'wp-component-library')}
					help={__(
						'The assistant can use allowlisted site tools. Prefer a clear, small request.',
						'wp-component-library'
					)}
					value={prompt}
					onChange={setPrompt}
					rows={4}
					disabled={isRunning}
					placeholder={__(
						'e.g. List recent posts by title. Do not change anything.',
						'wp-component-library'
					)}
				/>

				<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
					<Button variant="tertiary" onClick={handleClose} disabled={isRunning}>
						{__('Close', 'wp-component-library')}
					</Button>
					<Button
						variant="primary"
						icon={aiSparkle}
						onClick={handleSend}
						disabled={isRunning || !prompt.trim()}
					>
						{isRunning
							? __('Working…', 'wp-component-library')
							: __('Ask', 'wp-component-library')}
					</Button>
				</div>

				{isRunning && (
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<Spinner />
						<span>{__('Running assistant…', 'wp-component-library')}</span>
					</div>
				)}

				{error && (
					<Notice status="error" isDismissible={false}>
						{error}
					</Notice>
				)}

				{reply && (
					<div>
						<strong>{__('Reply', 'wp-component-library')}</strong>
						<p style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{reply}</p>
						{rounds > 0 && (
							<p style={{ opacity: 0.7, fontSize: '12px' }}>
								{__('Rounds:', 'wp-component-library')} {rounds}
							</p>
						)}
					</div>
				)}

				{toolCalls && toolCalls.length > 0 && (
					<details>
						<summary>
							{__('Tools used', 'wp-component-library')} ({toolCalls.length})
						</summary>
						<ul style={{ marginTop: '8px' }}>
							{toolCalls.map((call, index) => (
								<li key={`${call.ability || 'tool'}-${index}`}>
									{call.ability || __('Unknown tool', 'wp-component-library')}
								</li>
							))}
						</ul>
					</details>
				)}
			</div>
		</Modal>
	);
}
