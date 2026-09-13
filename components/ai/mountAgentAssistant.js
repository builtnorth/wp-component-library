/**
 * Mount the Polaris AI Assistant into wp-admin (Command Palette → AgentPanel).
 *
 * Plugin host entries should only call this — same pattern as shared settings pages.
 */

import { createRoot, useState, useEffect } from '@wordpress/element';
import { useCommand } from '@wordpress/commands';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { SnackbarList } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { AgentPanel } from './components/AgentPanel';
import { aiSparkle } from './utils/icons';
import { AGENT_NOTICE_CONTEXT } from './utils/agentNotices';

const ROOT_ID = 'polaris-ai-agent-root';

const noticesStyles = `
.polaris-ai-agent-notices {
	position: fixed;
	bottom: 0;
	right: 0;
	z-index: 100001;
	pointer-events: none;
}
.polaris-ai-agent-notices .components-snackbar-list {
	position: relative;
	bottom: auto;
	padding: 1rem;
	pointer-events: auto;
}
@media (min-width: 783px) {
	.polaris-ai-agent-notices .components-snackbar-list {
		padding-left: 160px;
	}
}
@media (min-width: 961px) {
	.polaris-ai-agent-notices .components-snackbar-list {
		padding-left: 36px;
	}
}
`;

function AgentNotices() {
	const notices = useSelect(
		(select) =>
			select(noticesStore)
				.getNotices(AGENT_NOTICE_CONTEXT)
				.filter((notice) => notice.type === 'snackbar'),
		[]
	);
	const { removeNotice } = useDispatch(noticesStore);

	return (
		<div className="polaris-ai-agent-notices">
			<SnackbarList
				notices={notices}
				onRemove={(id) => removeNotice(id, AGENT_NOTICE_CONTEXT)}
			/>
		</div>
	);
}

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

	useEffect(() => {
		const styleId = 'polaris-ai-agent-notices-styles';
		if (document.getElementById(styleId)) {
			return;
		}
		const style = document.createElement('style');
		style.id = styleId;
		style.textContent = noticesStyles;
		document.head.appendChild(style);
	}, []);

	// Bridge for triggers outside this component tree (e.g. the admin bar
	// button, rendered by plain PHP) — same "expose a window function"
	// pattern as registerAgentCanvasBridge.js's window.__polarisApplyAgentCanvas.
	useEffect(() => {
		window.__polarisOpenAgentAssistant = () => setIsOpen(true);
		return () => {
			delete window.__polarisOpenAgentAssistant;
		};
	}, []);

	return (
		<>
			<AgentNotices />
			<AgentPanel
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				maxRounds={4}
			/>
		</>
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
