/**
 * AI Framework - Clean Architecture
 * Provider-agnostic AI generation with automatic fallback
 */

// Hooks
export { useAI } from './hooks/useAI';

// Components
export { AIField } from './components/AIField';
export { AIButton } from './components/AIButton';
export { AIInline } from './components/AIInline';
export { AIModal } from './components/AIModal';

// Services
export { AICache, aiCache } from './services/AICache';

// Backward compatibility wrapper for smooth migration
export { AIField as AIFieldWrapper } from './components/AIField';