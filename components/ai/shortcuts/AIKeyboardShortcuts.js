import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { __ } from '@wordpress/i18n';

/**
 * Register AI keyboard shortcuts
 */
export function registerAIKeyboardShortcuts() {
    const { registerShortcut } = useDispatch(keyboardShortcutsStore);
    
    useEffect(() => {
        // Register the AI generation shortcut
        registerShortcut({
            name: 'polaris/ai-generate',
            category: 'block',
            description: __('Open AI content generator', 'polaris'),
            keyCombination: {
                modifier: 'primaryAlt', // Cmd/Ctrl + Alt
                character: 'g', // G for Generate
            },
            aliases: [
                {
                    modifier: 'access', // Alt + Shift (accessibility shortcut)
                    character: 'g',
                },
            ],
        });
        
        // Register shortcut for AI heading generation
        registerShortcut({
            name: 'polaris/ai-heading',
            category: 'block', 
            description: __('Generate AI heading', 'polaris'),
            keyCombination: {
                modifier: 'primaryAlt',
                character: 'h', // H for Heading
            },
        });
        
        // Register shortcut for AI paragraph generation
        registerShortcut({
            name: 'polaris/ai-paragraph',
            category: 'block',
            description: __('Generate AI paragraph', 'polaris'),
            keyCombination: {
                modifier: 'primaryAlt',
                character: 'p', // P for Paragraph
            },
        });
    }, [registerShortcut]);
}

/**
 * Hook to use AI keyboard shortcuts
 */
export function useAIKeyboardShortcuts() {
    const { isSelected, selectedBlock } = useSelect((select) => {
        const { getSelectedBlock, isBlockSelected } = select('core/block-editor');
        const block = getSelectedBlock();
        
        return {
            isSelected: block ? isBlockSelected(block.clientId) : false,
            selectedBlock: block,
        };
    }, []);
    
    const { __experimentalUseShortcut } = wp.keyboardShortcuts || {};
    
    // Handle AI generate shortcut
    if (__experimentalUseShortcut) {
        __experimentalUseShortcut(
            'polaris/ai-generate',
            (event) => {
                event.preventDefault();
                
                if (!isSelected) return;
                
                const blockName = selectedBlock?.name;
                
                // Check if it's a supported block
                if (blockName === 'core/paragraph' || blockName === 'core/heading') {
                    // Trigger AI generation
                    // We'll need to dispatch a custom event or use a global state
                    const aiEvent = new CustomEvent('polaris-ai-trigger', {
                        detail: {
                            blockId: selectedBlock.clientId,
                            blockType: blockName,
                        }
                    });
                    document.dispatchEvent(aiEvent);
                }
            },
            {
                isDisabled: !isSelected,
            }
        );
        
        // Handle AI heading shortcut
        __experimentalUseShortcut(
            'polaris/ai-heading',
            (event) => {
                event.preventDefault();
                
                if (!isSelected || selectedBlock?.name !== 'core/heading') return;
                
                const aiEvent = new CustomEvent('polaris-ai-trigger', {
                    detail: {
                        blockId: selectedBlock.clientId,
                        blockType: 'core/heading',
                    }
                });
                document.dispatchEvent(aiEvent);
            },
            {
                isDisabled: !isSelected || selectedBlock?.name !== 'core/heading',
            }
        );
        
        // Handle AI paragraph shortcut
        __experimentalUseShortcut(
            'polaris/ai-paragraph',
            (event) => {
                event.preventDefault();
                
                if (!isSelected || selectedBlock?.name !== 'core/paragraph') return;
                
                const aiEvent = new CustomEvent('polaris-ai-trigger', {
                    detail: {
                        blockId: selectedBlock.clientId,
                        blockType: 'core/paragraph',
                    }
                });
                document.dispatchEvent(aiEvent);
            },
            {
                isDisabled: !isSelected || selectedBlock?.name !== 'core/paragraph',
            }
        );
    }
}

/**
 * Initialize AI keyboard shortcuts
 */
export function initAIKeyboardShortcuts() {
    // Register shortcuts when editor loads
    if (wp.data && wp.data.dispatch('core/keyboard-shortcuts')) {
        wp.data.dispatch('core/keyboard-shortcuts').registerShortcut({
            name: 'polaris/ai-generate',
            category: 'block',
            description: 'Open AI content generator',
            keyCombination: {
                modifier: 'primaryAlt', // Cmd/Ctrl + Alt + G
                character: 'g',
            },
        });
    }
}