import { Button } from '@wordpress/components';
import { aiSparkle } from '../utils/icons';
import { useAI } from '../hooks/useAI';

/**
 * AIButton Component - Simple button mode for AI generation
 */
export function AIButton({ 
    type, 
    value, 
    onChange, 
    context,
    buttonProps = {},
    validation = {},
    aiOptions = {}
}) {
    const { generate, isGenerating, lastProvider } = useAI(type, {
        initialValue: value,
        onChange,
        context,
        validation,
        ...aiOptions
    });
    
    const handleClick = async () => {
        try {
            await generate(context);
        } catch (err) {
            console.error('Generation failed:', err);
        }
    };
    
    return (
        <Button
            icon={aiSparkle}
            onClick={handleClick}
            isBusy={isGenerating}
            disabled={isGenerating}
            variant="secondary"
            {...buttonProps}
        >
            {buttonProps.text || `Generate with ${lastProvider || 'AI'}`}
        </Button>
    );
}