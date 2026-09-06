/**
 * AI Framework - Clean Architecture
 * Provider-agnostic AI generation with automatic fallback
 */

// Hooks
export { useAI } from './hooks/useAI';
export { useAgent } from './hooks/useAgent';

// Components
export { AIField } from './components/AIField';
export { AIButton } from './components/AIButton';
export { AIInline } from './components/AIInline';
export { AIModal } from './components/AIModal';
export { AIPopover } from './components/AIPopover';
export { AgentPanel } from './components/AgentPanel';

// Admin Command Palette host (plugins call bootAgentAssistant from a thin entry)
export { mountAgentAssistant, bootAgentAssistant } from './mountAgentAssistant';

// Services
export { AICache, aiCache } from './services/AICache';

// Icons
export { aiSparkle } from './utils/icons';

// Agent helpers
export { getAgentEditorContext } from './utils/agentEditorContext';
export { notifyAgentOutcome, AGENT_NOTICE_CONTEXT } from './utils/agentNotices';
export {
	isAgentCanvasCapable,
	applyAgentCanvas,
	applyAgentCanvasWithNotice,
} from './utils/agentCanvas';

// Shortcuts
export { registerAIShortcuts, AIShortcutHandler } from './shortcuts';

// Configuration
export { configureAI, getAIEndpoint, getAITransport, buildAbilityRunRequest } from './config';

// Backward compatibility wrapper for smooth migration
export { AIField as AIFieldWrapper } from './components/AIField';