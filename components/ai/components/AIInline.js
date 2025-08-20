import { useState } from '@wordpress/element';
import { 
    TextControl,
    TextareaControl,
    IconButton,
    Flex,
    Notice 
} from '@wordpress/components';
import { aiSparkle } from '../utils/icons';
import { useAI } from '../hooks/useAI';

/**
 * AIInline Component - Inline editing with AI generation
 */
export function AIInline({ 
    type, 
    value, 
    onChange, 
    context,
    multiline = false,
    placeholder = 'Click to edit or generate with AI',
    validation = {},
    aiOptions = {}
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    
    const { generate, isGenerating, error } = useAI(type, {
        initialValue: value,
        onChange: (newValue) => {
            setLocalValue(newValue);
            onChange(newValue);
        },
        context,
        validation,
        ...aiOptions
    });
    
    const handleGenerate = async () => {
        try {
            await generate(context);
            setIsEditing(false);
        } catch (err) {
            console.error('Generation failed:', err);
        }
    };
    
    const handleSave = () => {
        onChange(localValue);
        setIsEditing(false);
    };
    
    const Control = multiline ? TextareaControl : TextControl;
    
    if (isEditing) {
        return (
            <div className="ai-inline-editing">
                <Flex gap={2}>
                    <Control
                        value={localValue}
                        onChange={setLocalValue}
                        placeholder={placeholder}
                        onBlur={handleSave}
                        autoFocus
                    />
                    <IconButton
                        icon={aiSparkle}
                        label="Generate with AI"
                        onClick={handleGenerate}
                        isBusy={isGenerating}
                        disabled={isGenerating}
                    />
                </Flex>
                {error && (
                    <Notice status="error" isDismissible={false}>
                        {error}
                    </Notice>
                )}
            </div>
        );
    }
    
    return (
        <div className="ai-inline-display">
            <Flex gap={2} align="center">
                <div 
                    onClick={() => setIsEditing(true)}
                    className="ai-inline-value"
                    style={{ 
                        cursor: 'text',
                        flex: 1,
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        minHeight: '36px'
                    }}
                >
                    {value || <span style={{ opacity: 0.5 }}>{placeholder}</span>}
                </div>
                <IconButton
                    icon={aiSparkle}
                    label="Generate with AI"
                    onClick={handleGenerate}
                    isBusy={isGenerating}
                    disabled={isGenerating}
                />
            </Flex>
            {error && (
                <Notice status="error" isDismissible={false}>
                    {error}
                </Notice>
            )}
        </div>
    );
}