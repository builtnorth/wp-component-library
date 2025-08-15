/**
 * AI Field Wrapper Component
 * 
 * Wraps form fields to add inline AI generation capability
 */

import { AIGenerator } from './generator';
import { Flex, FlexItem, FlexBlock } from '@wordpress/components';
import { cloneElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { sparkles } from '@wordpress/icons';

/**
 * AI Field Wrapper - Adds AI generation button to field labels
 * 
 * @param {Object} props
 * @param {React.Element} props.children - The field component to wrap
 * @param {string} props.type - AI content type ID
 * @param {*} props.value - Current field value
 * @param {Function} props.onChange - Field value change handler
 * @param {Object} props.context - Context for AI generation
 * @param {string} props.label - Field label (if not part of child component)
 * @param {string} props.buttonPosition - Position of button: 'label', 'below', 'above'
 * @param {boolean} props.showButton - Whether to show the AI button
 * @param {Object} props.aiProps - Additional props for AIGenerator
 */
export function AIFieldWrapper({
    children,
    type,
    value,
    onChange,
    context = {},
    label,
    buttonPosition = 'label',
    showButton = true,
    aiProps = {},
    ...props
}) {
    // If no AI type or button hidden, just render children
    if (!type || !showButton) {
        return children;
    }
    
    // Create the AI button with minimal styling for inline use
    const aiButton = (
        <AIGenerator
            type={type}
            value={value}
            onChange={onChange}
            context={context}
            size="small"
            variant="tertiary"
            icon={sparkles}
            buttonText=""
            buttonProps={{
                label: __('Generate with AI', 'wp-component-library'),
                showTooltip: true,
                ...aiProps.buttonProps
            }}
            {...aiProps}
        />
    );
    
    // Position button in label (most common case)
    if (buttonPosition === 'label' && label) {
        return (
            <div className="ai-field-wrapper">
                <Flex align="center" gap={2} className="ai-field-label">
                    <FlexBlock>
                        <span className="components-base-control__label">{label}</span>
                    </FlexBlock>
                    <FlexItem>{aiButton}</FlexItem>
                </Flex>
                {children}
            </div>
        );
    }
    
    // Position button above field
    if (buttonPosition === 'above') {
        return (
            <div className="ai-field-wrapper">
                <div className="ai-field-button-above">
                    {aiButton}
                </div>
                {children}
            </div>
        );
    }
    
    // Position button below field (default/fallback)
    return (
        <div className="ai-field-wrapper">
            {children}
            <div className="ai-field-button-below" style={{ marginTop: '8px' }}>
                {aiButton}
            </div>
        </div>
    );
}

/**
 * Enhanced wrapper that modifies the child component's label
 * Works with components that accept a 'label' prop
 */
export function AIFieldWithLabel({
    children,
    type,
    value,
    onChange,
    context = {},
    showButton = true,
    aiProps = {},
    ...props
}) {
    if (!type || !showButton) {
        return children;
    }
    
    // Clone the child element and modify its label prop
    const enhancedChild = cloneElement(children, {
        ...children.props,
        label: children.props.label ? (
            <Flex align="center" gap={2}>
                <FlexBlock>{children.props.label}</FlexBlock>
                <FlexItem>
                    <AIGenerator
                        type={type}
                        value={value}
                        onChange={onChange}
                        context={context}
                        size="small"
                        variant="tertiary"
                        icon={sparkles}
                        buttonText=""
                        buttonProps={{
                            label: __('Generate with AI', 'wp-component-library'),
                            showTooltip: true,
                            ...aiProps?.buttonProps
                        }}
                        {...aiProps}
                    />
                </FlexItem>
            </Flex>
        ) : children.props.label
    });
    
    return enhancedChild;
}