import { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { useShortcut } from '@wordpress/keyboard-shortcuts';
import { __ } from '@wordpress/i18n';
import { AIPopover } from '../components/AIPopover';

/**
 * Register AI keyboard shortcuts
 */
export function registerAIShortcuts() {
    const { registerShortcut } = wp.data.dispatch(keyboardShortcutsStore);
    
    registerShortcut({
        name: 'polaris/ai-generate',
        category: 'block',
        description: __('Open AI content generator', 'polaris'),
        keyCombination: {
            modifier: 'primaryAlt', // Cmd/Ctrl + Alt
            character: 'g', // G for Generate
        },
    });
}

/**
 * AI Shortcut Handler Component
 * Listens for keyboard shortcuts and opens AI popover
 */
export function AIShortcutHandler() {
    const [showPopover, setShowPopover] = useState(false);
    const [anchorElement, setAnchorElement] = useState(null);
    
    // Get selected block info
    const { selectedBlock, selectedBlockElement } = useSelect((select) => {
        const { getSelectedBlock } = select('core/block-editor');
        const block = getSelectedBlock();
        
        let blockElement = null;
        if (block) {
            // Find the block's DOM element
            blockElement = document.querySelector(`[data-block="${block.clientId}"]`);
        }
        
        return {
            selectedBlock: block,
            selectedBlockElement: blockElement,
        };
    }, []);
    
    // Use the shortcut hook
    useShortcut(
        'polaris/ai-generate',
        (event) => {
            if (event) {
                event.preventDefault();
            }
            
            // Check if we have a selected block and it's a supported type
            if (selectedBlock && 
                (selectedBlock.name === 'core/paragraph' || selectedBlock.name === 'core/heading')) {
                
                // Find the block element if we don't have it yet
                let blockElement = selectedBlockElement;
                if (!blockElement && selectedBlock) {
                    blockElement = document.querySelector(`[data-block="${selectedBlock.clientId}"]`);
                }
                
                // Create an anchor ref for the popover
                if (blockElement) {
                    setAnchorElement({
                        getBoundingClientRect: () => blockElement.getBoundingClientRect(),
                        ownerDocument: document
                    });
                    setShowPopover(true);
                }
            }
        },
        {
            isDisabled: !selectedBlock || 
                (selectedBlock?.name !== 'core/paragraph' && selectedBlock?.name !== 'core/heading')
        }
    );
    
    if (!showPopover || !selectedBlock || !anchorElement) {
        return null;
    }
    
    // Determine AI type based on block
    const aiType = selectedBlock.name === 'core/paragraph' 
        ? 'polaris-blocks/paragraph' 
        : 'polaris-blocks/heading';
    
    return (
        <AIPopover
            type={aiType}
            value={selectedBlock.attributes?.content || ''}
            onChange={(newContent) => {
                // Handle multiple paragraphs if needed
                const hasParagraphBreaks = newContent.includes('\n\n') || 
                    newContent.includes('\r\n\r\n') || 
                    newContent.includes('<br><br>') ||
                    newContent.includes('<br/><br/>') ||
                    newContent.includes('<p>');
                
                if (selectedBlock.name === "core/paragraph" && hasParagraphBreaks) {
                    // Split into paragraphs
                    let paragraphs = [];
                    
                    if (newContent.includes('\n\n')) {
                        paragraphs = newContent.split('\n\n');
                    } else if (newContent.includes('\r\n\r\n')) {
                        paragraphs = newContent.split('\r\n\r\n');
                    } else if (newContent.includes('<p>')) {
                        const matches = newContent.match(/<p>(.*?)<\/p>/g);
                        if (matches) {
                            paragraphs = matches.map(p => p.replace(/<\/?p>/g, ''));
                        }
                    }
                    
                    paragraphs = paragraphs.filter(p => p.trim().length > 0);
                    
                    if (paragraphs.length > 1) {
                        const { insertBlocks, removeBlock } = wp.data.dispatch('core/block-editor');
                        const { getBlockIndex, getBlockRootClientId } = wp.data.select('core/block-editor');
                        
                        const newBlocks = paragraphs.map(content => 
                            wp.blocks.createBlock('core/paragraph', { 
                                content: content.trim() 
                            })
                        );
                        
                        const currentIndex = getBlockIndex(selectedBlock.clientId);
                        const rootClientId = getBlockRootClientId(selectedBlock.clientId);
                        
                        insertBlocks(newBlocks, currentIndex + 1, rootClientId);
                        removeBlock(selectedBlock.clientId);
                    } else if (paragraphs.length === 1) {
                        wp.data.dispatch('core/block-editor').updateBlockAttributes(
                            selectedBlock.clientId,
                            { content: paragraphs[0].trim() }
                        );
                    } else {
                        wp.data.dispatch('core/block-editor').updateBlockAttributes(
                            selectedBlock.clientId,
                            { content: newContent }
                        );
                    }
                } else {
                    // For headings or single paragraphs, just update the content
                    wp.data.dispatch('core/block-editor').updateBlockAttributes(
                        selectedBlock.clientId,
                        { content: newContent }
                    );
                }
                
                // Close the popover after updating
                setShowPopover(false);
            }}
            context={{
                post_id: wp.data.select('core/editor')?.getCurrentPostId(),
                block_type: selectedBlock.name,
                heading_level: selectedBlock.name === 'core/heading' ? selectedBlock.attributes?.level : undefined,
            }}
            isOpen={showPopover}
            onClose={() => setShowPopover(false)}
            anchorRef={anchorElement}
            promptLabel={selectedBlock.name === 'core/paragraph' 
                ? __('What should this paragraph be about?', 'polaris')
                : __('What should this heading say?', 'polaris')
            }
            promptPlaceholder={selectedBlock.name === 'core/paragraph'
                ? __('e.g., Explain the benefits of solar energy...', 'polaris')
                : __('e.g., A heading about pricing options...', 'polaris')
            }
        />
    );
}

// Auto-initialize when loaded
if (typeof window !== 'undefined' && window.wp) {
    // Wait for editor to be ready
    wp.domReady(() => {
        registerAIShortcuts();
    });
}