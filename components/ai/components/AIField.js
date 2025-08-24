import React, { useRef, useEffect } from 'react';
import { 
    Button, 
    Flex, 
    FlexBlock, 
    FlexItem
} from '@wordpress/components';
import { useAI } from '../hooks/useAI';
import { aiSparkle } from '../utils/icons';

/**
 * AIField Component - Clean wrapper for AI generation
 * UI configuration comes from props, not backend config
 */
export function AIField({ 
    children, 
    type, 
    value, 
    onChange,
    context = {}, // Additional context to pass to AI generation
    getContext, // Optional function to get fresh context at generation time
    buttonText = 'AI',
    buttonSize = 'small',
    buttonVariant = 'secondary',
    generatingText = 'Generating...',
    position = 'label',
    buttonIcon = aiSparkle  // Default to our AI sparkle icon
}) {
    // Use a ref to always have the latest context
    const contextRef = useRef(context);
    
    // Update the ref whenever context changes
    useEffect(() => {
        contextRef.current = context;
    }, [context]);
    
    // Use the AI hook - backend handles all generation logic
    const { generate, isGenerating, lastProvider, error } = useAI(type, {
        initialValue: value,
        onChange,
        // Don't pass stale context here - we'll pass it at generation time
    });
    
    const handleGenerate = async () => {
        try {
            // Get the freshest possible context
            // Priority: getContext function > ref > prop
            const freshContext = getContext ? getContext() : contextRef.current;
            
            // Log the size of what we're sending to debug prompt length issues
            const contextString = JSON.stringify(freshContext);
            console.log('AIField - Context size:', contextString.length, 'characters');
            if (contextString.length > 3000) {
                console.warn('AIField - Context may be too large. Consider reducing content size.');
            }
            
            // Pass the fresh context at generation time
            await generate({ 
                _skipCache: true,
                ...freshContext // Spread fresh context as overrides
            });
        } catch (err) {
            // Error is already handled by the hook
            console.error('Generation failed:', err);
        }
    };
    
    // Button size styles
    const buttonStyles = {
        small: {
            minWidth: 'auto',
            padding: '2px 8px',
            height: '24px',
            fontSize: '11px'
        },
        compact: {
            minWidth: 'auto',
            padding: '4px 10px',
            height: '28px',
            fontSize: '12px'
        },
        medium: {
            minWidth: 'auto',
            padding: '4px 12px',
            height: '32px',
            fontSize: '13px'
        },
        large: {
            minWidth: 'auto',
            padding: '6px 16px',
            height: '40px',
            fontSize: '14px'
        }
    };
    
    // Icon sizes based on button size
    const iconSizes = {
        small: 12,
        compact: 14,
        medium: 16,
        large: 18
    };
    
    // Create the AI button - use native iconSize prop
    const aiButton = (
        <Button
            size={buttonSize}
            variant={buttonVariant}
            icon={buttonIcon}
            iconSize={iconSizes[buttonSize] || 16}
            onClick={handleGenerate}
            isBusy={isGenerating}
            disabled={isGenerating}
            className="ai-field-button"
            style={buttonStyles[buttonSize] || buttonStyles.small}
        >
            {isGenerating ? generatingText : buttonText}
        </Button>
    );
    
    // If position is 'label', inject button into child's label
    if (position === 'label' && React.isValidElement(children)) {
        const enhancedChild = React.cloneElement(children, {
            ...children.props,
            label: children.props.label ? (
                <Flex align="center" justify="space-between" gap={2}>
                    <FlexBlock>{children.props.label}</FlexBlock>
                    <FlexItem>{aiButton}</FlexItem>
                </Flex>
            ) : undefined
        });
        
        return enhancedChild;
    }
    
    // For other positions, wrap the child
    if (position === 'before') {
        return (
            <div className="ai-field-wrapper">
                {aiButton}
                {children}
            </div>
        );
    }
    
    if (position === 'after') {
        return (
            <div className="ai-field-wrapper">
                {children}
                {aiButton}
            </div>
        );
    }
    
    // Default: just return the child with button in label
    return children;
}