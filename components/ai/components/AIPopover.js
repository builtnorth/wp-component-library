import { useState } from '@wordpress/element';
import { 
    Popover,
    TextareaControl,
    Button,
    Flex,
    FlexItem,
    Notice
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useAI } from '../hooks/useAI';

/**
 * AIPopover Component - Popover interface for AI generation with prompt
 * Designed for toolbar integration
 */
export function AIPopover({ 
    type, 
    value, 
    onChange, 
    context = {},
    isOpen,
    onClose,
    anchorRef,
    promptLabel = 'What would you like to generate?',
    promptPlaceholder = 'Enter your prompt...',
    generateText = 'Generate',
    regenerateText = 'Regenerate',
    closeText = 'Close',
    position = 'bottom-start'
}) {
    const [prompt, setPrompt] = useState('');
    const [hasGenerated, setHasGenerated] = useState(false);
    
    const { generate, isGenerating, error } = useAI(type, {
        initialValue: value,
        onChange: (newValue) => {
            onChange(newValue);
            setHasGenerated(true);
        },
        context
    });
    
    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        
        try {
            await generate({
                ...context,
                current_value: prompt,
                force_variety: true, // Always force variety for manual generations
                _skipCache: true // Always skip cache for manual generations
            });
        } catch (err) {
            console.error('Generation failed:', err);
        }
    };
    
    const handleClose = () => {
        setPrompt('');
        setHasGenerated(false);
        onClose();
    };
    
    if (!isOpen) return null;
    
    return (
        <Popover
            onClose={handleClose}
            placement={position}
            anchorRef={anchorRef}
            noArrow={false}
        >
            <div style={{ padding: '16px', width: '320px' }}>
                <TextareaControl
                    label={promptLabel}
                    value={prompt}
                    onChange={setPrompt}
                    placeholder={promptPlaceholder}
                    rows={3}
                    help={hasGenerated && !error ? 
                        __('Content generated! Click regenerate for a different version.') 
                        : null
                    }
                />
                
                {error && (
                    <Notice 
                        status="error" 
                        isDismissible={false}
                        style={{ marginBottom: '12px' }}
                    >
                        {error}
                    </Notice>
                )}
                
                <Flex justify="space-between" gap={2}>
                    <FlexItem>
                        <Button
                            variant="tertiary"
                            onClick={handleClose}
                            disabled={isGenerating}
                        >
                            {closeText}
                        </Button>
                    </FlexItem>
                    <FlexItem>
                        <Button
                            variant="primary"
                            onClick={handleGenerate}
                            isBusy={isGenerating}
                            disabled={!prompt.trim() || isGenerating}
                        >
                            {hasGenerated && !error ? regenerateText : generateText}
                        </Button>
                    </FlexItem>
                </Flex>
            </div>
        </Popover>
    );
}