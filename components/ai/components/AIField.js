import { useRef, useEffect, cloneElement, isValidElement } from '@wordpress/element';
import { 
    Button, 
    Flex, 
    FlexBlock, 
    FlexItem
} from '@wordpress/components';
import { useAI } from '../hooks/useAI';
import { aiSparkle } from '../utils/icons';
import { isAiEnabled } from '../../../utils/ai-gate';

/**
 * AIField Component - Clean wrapper for AI generation.
 *
 * Wraps any form field with an AI generate button.
 *
 * @param {boolean}  [enabled]         Whether AI is available. Defaults to
 *                                     isAiEnabled(). Pass an explicit boolean
 *                                     to override the gate check.
 * @param {*}        children          The field component to wrap.
 * @param {string}   type              AI ability identifier passed to useAI.
 * @param {string}   value             Current field value.
 * @param {Function} onChange          Called with the generated value.
 * @param {Object}   [context]         Static context forwarded to the API.
 * @param {Function} [getContext]      Called at generation time for fresh context.
 * @param {Object}   [aiOptions]       Extra useAI options (customEndpoint, buildRequest, …).
 * @param {string}   [buttonText]      Button label. Default: 'AI'.
 * @param {string}   [buttonSize]      'small' | 'compact' | 'medium' | 'large'.
 * @param {string}   [buttonVariant]   WordPress Button variant.
 * @param {string}   [generatingText]  Label while generating.
 * @param {string}   [position]        'label' | 'before' | 'after'.
 * @param {*}        [buttonIcon]      Icon element for the button.
 */
export function AIField({ 
    enabled,
    children, 
    type, 
    value, 
    onChange,
    context = {},
    getContext,
    aiOptions = {},
    buttonText = 'AI',
    buttonSize = 'small',
    buttonVariant = 'secondary',
    generatingText = 'Generating...',
    position = 'label',
    buttonIcon = aiSparkle,
}) {
    // Hooks must run unconditionally — gate check happens after them.
    const contextRef = useRef(context);

    useEffect(() => {
        contextRef.current = context;
    }, [context]);

    const { generate, isGenerating } = useAI(type, {
        initialValue: value,
        onChange,
        ...aiOptions,
    });

    const handleGenerate = async () => {
        try {
            const freshContext = getContext ? getContext() : contextRef.current;
            await generate({ _skipCache: true, ...freshContext });
        } catch (err) {
            // Error is already held in useAI state.
        }
    };

    // Resolve gate: caller can pass explicit boolean or rely on the localize gate.
    const isEnabled = enabled !== undefined ? enabled : isAiEnabled();

    // When AI is not enabled, render children without the AI button.
    if (!isEnabled) {
        return <>{ children }</>;
    }

    const buttonStyles = {
        small:   { minWidth: 'auto', padding: '2px 8px',   height: '24px', fontSize: '11px' },
        compact: { minWidth: 'auto', padding: '4px 10px',  height: '28px', fontSize: '12px' },
        medium:  { minWidth: 'auto', padding: '4px 12px',  height: '32px', fontSize: '13px' },
        large:   { minWidth: 'auto', padding: '6px 16px',  height: '40px', fontSize: '14px' },
    };

    const iconSizes = { small: 12, compact: 14, medium: 16, large: 18 };

    const aiButton = (
        <Button
            size={ buttonSize }
            variant={ buttonVariant }
            icon={ buttonIcon }
            iconSize={ iconSizes[ buttonSize ] || 16 }
            onClick={ handleGenerate }
            isBusy={ isGenerating }
            disabled={ isGenerating }
            className="ai-field-button"
            style={ buttonStyles[ buttonSize ] || buttonStyles.small }
        >
            { isGenerating ? generatingText : buttonText }
        </Button>
    );

    if (position === 'label' && isValidElement(children)) {
        return cloneElement(children, {
            ...children.props,
            label: children.props.label ? (
                <Flex align="center" justify="space-between" gap={ 2 }>
                    <FlexBlock>{ children.props.label }</FlexBlock>
                    <FlexItem>{ aiButton }</FlexItem>
                </Flex>
            ) : undefined,
        });
    }

    if (position === 'before') {
        return (
            <div className="ai-field-wrapper">
                { aiButton }
                { children }
            </div>
        );
    }

    if (position === 'after') {
        return (
            <div className="ai-field-wrapper">
                { children }
                { aiButton }
            </div>
        );
    }

    return children;
}
