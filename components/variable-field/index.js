/**
 * WordPress dependencies
 */
import { BaseControl } from "@wordpress/components";
import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { DOWN, ENTER, ESCAPE, UP } from "@wordpress/keycodes";

/**
 * Internal dependencies
 */
import styled from "@emotion/styled";

// Styled components
const StyledWrapper = styled.div`
    position: relative;
`;

const StyledFieldContainer = styled.div`
    width: 100%;
    min-height: ${props => props.rows > 1 ? `${(props.rows * 28) + 16}px` : '40px'};
    padding: 6px 8px;
    border: 1px solid #757575;
    border-radius: 2px;
    background: #fff;
    font-size: 13px;
    font-family: inherit;
    margin: 0;
    line-height: 24px;
    cursor: text;
    display: inline-block;
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    position: relative;

    &:empty:before {
        content: attr(data-placeholder);
        color: #757575;
        pointer-events: none;
        position: absolute;
    }

    &:focus {
        border-color: var(--wp-admin-theme-color, #007cba);
        box-shadow: 0 0 0 1px var(--wp-admin-theme-color, #007cba);
        outline: 2px solid transparent;
        caret-color: var(--wp-admin-theme-color, #007cba);
    }

    &.is-disabled {
        background: #f0f0f0;
        cursor: not-allowed;
    }

    .variable-chip {
        display: inline-block;
        background: #e0e0e0;
        color: #1e1e1e;
        border-radius: 4px;
        padding: 2px 6px;
        margin: 0 2px;
        font-size: 12px;
        white-space: nowrap;
        user-select: none;
        position: relative;
        padding-right: 20px;
        vertical-align: middle;
        line-height: 20px;
        transition: background-color 0.15s ease;
        
        &:hover {
            background: #d0d0d0;
        }
        
        &::before,
        &::after {
            content: '\\200B';
            display: inline;
            width: 0;
        }
    }

    .chip-remove {
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        opacity: 0.6;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
    }

    .chip-remove:hover {
        opacity: 1;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 2px;
    }
`;

const StyledSuggestionsContainer = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 10000;
    margin-top: 4px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.15s ease-in-out;
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const StyledSuggestions = styled.div`
    max-height: 200px;
    overflow-y: auto;
    padding: 4px 0;
`;

const StyledSuggestion = styled.button`
    display: block;
    width: 100%;
    padding: 6px 12px;
    text-align: left;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 13px;

    &:hover,
    &.is-selected {
        background: var(--wp-admin-theme-color, #007cba);
        color: #fff;
    }
`;

// Hidden input for form submission
const StyledHiddenInput = styled.input`
    position: absolute;
    left: -9999px;
    opacity: 0;
    pointer-events: none;
`;

/**
 * VariableField Component
 */
const VariableField = forwardRef(function VariableField(
    {
        value = "",
        onChange,
        options = [],
        getOptionLabel = (option) =>
            option.label || option.name || option.title,
        getOptionValue = (option) => option.value || option.id,
        placeholder = __(
            "Type @ to view variable suggestions",
            "wp-component-library",
        ),
        label,
        help,
        isDisabled = false,
        className = "",
        rows = 1,
        ...props
    },
    ref,
) {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const containerRef = useRef();
    const wrapperRef = useRef();
    const hiddenInputRef = useRef();

    // Convert value to HTML with chips
    const valueToHTML = useCallback((val) => {
        if (!val) return "";
        // Add zero-width spaces between elements for better cursor positioning
        let html = val.replace(/{([^}]+)}/g, (match, varName) => {
            return `<span class="variable-chip" contenteditable="false" data-variable="${varName}">${varName}<span class="chip-remove">×</span></span>`;
        });
        // Ensure there's always an editable space at the end
        if (!html.endsWith('\u200B')) {
            html += '\u200B';
        }
        return html;
    }, []);

    // Get plain text from container
    const getPlainText = useCallback(() => {
        if (!containerRef.current) return "";
        
        let text = "";
        const nodes = containerRef.current.childNodes;
        
        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                // Remove zero-width spaces from the text
                text += node.textContent.replace(/\u200B/g, '');
            } else if (node.classList && node.classList.contains("variable-chip")) {
                const varName = node.getAttribute('data-variable') || node.firstChild.textContent;
                text += `{${varName}}`;
            }
        });
        
        return text.trim();
    }, []);

    // Initialize content
    useEffect(() => {
        if (containerRef.current && document.activeElement !== containerRef.current) {
            const currentHTML = containerRef.current.innerHTML;
            const newHTML = valueToHTML(value);
            // Only update if content actually changed
            if (currentHTML !== newHTML) {
                containerRef.current.innerHTML = newHTML;
            }
        }
    }, [value, valueToHTML]);

    // Handle input changes
    const handleInput = useCallback((e) => {
        // Preserve cursor position
        const selection = window.getSelection();
        const savedRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        
        const plainValue = getPlainText();
        
        // Check for @ symbol - reuse existing selection
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const container = range.startContainer;
            
            // Only check for @ in text nodes, not in chips
            if (container.nodeType === Node.TEXT_NODE) {
                const textContent = container.textContent;
                const offset = range.startOffset;
                const textBeforeCursor = textContent.substring(0, offset);
                const lastAt = textBeforeCursor.lastIndexOf("@");
                
                if (lastAt !== -1) {
                    const searchTerm = textBeforeCursor.substring(lastAt + 1).toLowerCase();
                    
                    if (searchTerm === "") {
                        // Just typed @
                        setSuggestions(options);
                        setShowSuggestions(true);
                        setSelectedIndex(0);
                    } else {
                        // Typing after @
                        const filtered = options.filter((option) => {
                            const label = getOptionLabel(option).toLowerCase();
                            return label.includes(searchTerm);
                        });
                        setSuggestions(filtered);
                        setShowSuggestions(filtered.length > 0);
                        setSelectedIndex(0);
                    }
                } else {
                    setShowSuggestions(false);
                }
            } else {
                setShowSuggestions(false);
            }
        }

        onChange(plainValue);
        if (hiddenInputRef.current) {
            hiddenInputRef.current.value = plainValue;
        }
    }, [getPlainText, onChange, options, getOptionLabel]);

    // Handle selecting a suggestion
    const selectSuggestion = useCallback((option) => {
        const selection = window.getSelection();
        
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const container = range.startContainer;
            
            if (container.nodeType === Node.TEXT_NODE) {
                const textContent = container.textContent;
                const offset = range.startOffset;
                const textBeforeCursor = textContent.substring(0, offset);
                const lastAt = textBeforeCursor.lastIndexOf("@");
                
                if (lastAt !== -1) {
                    // Replace @text with variable in the current text node
                    const beforeAt = textContent.substring(0, lastAt);
                    const afterCursor = textContent.substring(offset);
                    
                    // Build new value with variable
                    const optionValue = getOptionValue(option);
                    // Remove curly braces if they're already in the value
                    const cleanValue = optionValue.replace(/^\{|\}$/g, '');
                    const varValue = `{${cleanValue}}`;
                    
                    // Replace text node content
                    container.textContent = beforeAt + varValue + " " + afterCursor;
                    
                    // Trigger change
                    const newValue = getPlainText();
                    onChange(newValue);
                    
                    // Re-render with chips and restore focus
                    containerRef.current.innerHTML = valueToHTML(newValue);
                    
                    // Place cursor after the inserted variable
                    const allNodes = Array.from(containerRef.current.childNodes);
                    let targetNode = null;
                    let targetOffset = 0;
                    
                    // Find the last text node or create one if needed
                    for (let i = allNodes.length - 1; i >= 0; i--) {
                        if (allNodes[i].nodeType === Node.TEXT_NODE) {
                            targetNode = allNodes[i];
                            targetOffset = targetNode.textContent.length;
                            break;
                        }
                    }
                    
                    if (targetNode) {
                        const sel = window.getSelection();
                        const newRange = document.createRange();
                        newRange.setStart(targetNode, targetOffset);
                        newRange.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(newRange);
                    }
                    
                    // Keep focus on the field
                    containerRef.current.focus();
                }
            }
        }

        setShowSuggestions(false);
    }, [getOptionValue, onChange, valueToHTML, getPlainText]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e) => {
        if (showSuggestions && suggestions.length > 0) {
            switch (e.keyCode) {
                case UP:
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.max(0, prev - 1));
                    return;
                case DOWN:
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        Math.min(suggestions.length - 1, prev + 1),
                    );
                    return;
                case ENTER:
                    e.preventDefault();
                    if (suggestions[selectedIndex]) {
                        selectSuggestion(suggestions[selectedIndex]);
                    }
                    return;
                case ESCAPE:
                    e.preventDefault();
                    setShowSuggestions(false);
                    return;
            }
        }
        
        // Handle backspace on chip boundaries
        if (e.key === 'Backspace') {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (range.collapsed && range.startOffset === 0) {
                    const node = range.startContainer;
                    if (node.previousSibling && node.previousSibling.classList?.contains('variable-chip')) {
                        e.preventDefault();
                        node.previousSibling.remove();
                        const newValue = getPlainText();
                        onChange(newValue);
                    }
                }
            }
        }
    }, [showSuggestions, suggestions, selectedIndex, selectSuggestion, getPlainText, onChange]);

    // Handle chip removal
    useEffect(() => {
        const handleClick = (e) => {
            if (e.target.classList.contains('chip-remove')) {
                e.preventDefault();
                e.stopPropagation();
                const chip = e.target.parentElement;
                
                // Save cursor position before removal
                const selection = window.getSelection();
                const focusNode = selection.focusNode;
                const focusOffset = selection.focusOffset;
                
                chip.remove();
                const newValue = getPlainText();
                onChange(newValue);
                if (hiddenInputRef.current) {
                    hiddenInputRef.current.value = newValue;
                }
                
                // Restore focus to the field
                containerRef.current.focus();
                
                // Try to restore cursor position
                if (focusNode && containerRef.current.contains(focusNode.parentNode)) {
                    const newRange = document.createRange();
                    newRange.setStart(focusNode, Math.min(focusOffset, focusNode.textContent.length));
                    newRange.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                }
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('click', handleClick);
            return () => container.removeEventListener('click', handleClick);
        }
    }, [getPlainText, onChange]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Expose focus method to parent
    useImperativeHandle(
        ref,
        () => ({
            focus: () => {
                containerRef.current?.focus();
            },
        }),
        [],
    );

    return (
        <BaseControl
            __nextHasNoMarginBottom
            __next40pxDefaultSize
            label={label}
            help={help}
            className={`variable-field ${className}`}
        >
            <StyledWrapper ref={wrapperRef}>
                <StyledHiddenInput
                    ref={hiddenInputRef}
                    type="hidden"
                    value={value}
                    name={props.name}
                />

                <StyledFieldContainer
                    ref={containerRef}
                    contentEditable={!isDisabled}
                    suppressContentEditableWarning
                    className={isDisabled ? "is-disabled" : ""}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    data-placeholder={!value ? placeholder : ""}
                    rows={rows}
                />

                {showSuggestions && suggestions.length > 0 && (
                    <StyledSuggestionsContainer>
                        <StyledSuggestions>
                            {suggestions.map((option, index) => (
                                <StyledSuggestion
                                    key={getOptionValue(option)}
                                    className={
                                        index === selectedIndex
                                            ? "is-selected"
                                            : ""
                                    }
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        selectSuggestion(option);
                                    }}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    {getOptionLabel(option)}
                                </StyledSuggestion>
                            ))}
                        </StyledSuggestions>
                    </StyledSuggestionsContainer>
                )}
            </StyledWrapper>
        </BaseControl>
    );
});

export { VariableField };