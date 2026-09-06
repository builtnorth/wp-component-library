/**
 * Mount the Polaris AI Assistant into wp-admin (Command Palette → AgentPanel).
 *
 * Plugin host entries should only call this — same pattern as shared settings pages.
 */

import { createRoot, useState } from '@wordpress/element';
import { useCommand } from '@wordpress/commands';
import { __ } from '@wordpress/i18n';
import { AgentPanel } from './components/AgentPanel';
import { aiSparkle } from './utils/icons';

const ROOT_ID = 'polaris-ai-agent-root';

function AgentAssistantApp() {
	const [isOpen, setIsOpen] = useState(false);

	useCommand({
		name: 'polaris-ai/assistant',
		label: __('AI Assistant', 'wp-component-library'),
		searchLabel: __('Ask AI Assistant site tools polaris', 'wp-component-library'),
		keywords: [
			__('ask', 'wp-component-library'),
			__('agent', 'wp-component-library'),
			__('chat', 'wp-component-library'),
			__('polaris', 'wp-component-library'),
		],
		icon: aiSparkle,
		category: 'command',
		callback: ({ close }) => {
			close();
			setIsOpen(true);
		},
	});

	return (
		<AgentPanel
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			maxRounds={4}
		/>
	);
}

/**
 * Idempotent mount for the AI Assistant Command Palette host.
 */
export function mountAgentAssistant() {
	if (typeof document === 'undefined') {
		return;
	}

	if (document.getElementById(ROOT_ID)) {
		return;
	}

	const rootElement = document.createElement('div');
	rootElement.id = ROOT_ID;
	document.body.appendChild(rootElement);

	createRoot(rootElement).render(<AgentAssistantApp />);
}

/**
 * Call mount when the DOM is ready (for plugin entry scripts).
 */
export function bootAgentAssistant() {
	if (typeof document === 'undefined') {
		return;
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', mountAgentAssistant);
	} else {
		mountAgentAssistant();
	}
}
