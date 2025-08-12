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
import { DOWN, ENTER, ESCAPE, UP, LEFT, RIGHT, BACKSPACE } from "@wordpress/keycodes";

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
	min-height: 40px;
	padding: 6px 8px;
	border: 1px solid #757575;
	border-radius: 2px;
	background: #fff;
	font-size: 13px;
	font-family: inherit;
	margin: 0;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	cursor: text;
	gap: 2px;
	line-height: 24px;

	&:focus-within {
		border-color: var(--wp-admin-theme-color, #007cba);
		box-shadow: 0 0 0 1px var(--wp-admin-theme-color, #007cba);
		outline: 2px solid transparent;
	}

	&.is-disabled {
		background: #f0f0f0;
		cursor: not-allowed;
	}
`;

const StyledChip = styled.span`
	display: inline-flex;
	align-items: center;
	background: var(--wp-admin-theme-color, #007cba);
	color: white;
	border-radius: 3px;
	padding: 0 6px;
	font-size: 12px;
	white-space: nowrap;
	user-select: none;
	max-width: 200px;
	height: 22px;
	margin: 0 2px;
	vertical-align: middle;

	.chip-label {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.chip-remove {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		border: none;
		cursor: pointer;
		color: white;
		font-size: 10px;
		line-height: 1;
		padding: 0;
		margin-left: 4px;
		transition: background 0.2s;

		&:hover {
			background: rgba(255, 255, 255, 0.5);
		}
	}
`;

const StyledTextSpan = styled.span`
	display: inline;
	white-space: pre-wrap;
	outline: none;
	min-width: 1px;
	
	&:empty:not(:focus)::before {
		content: attr(data-placeholder);
		color: #757575;
	}

	&:focus {
		outline: none;
	}
`;

const StyledSuggestionsContainer = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	z-index: 1000;
	margin-top: 4px;
	background: #fff;
	border: 1px solid #ccc;
	border-radius: 2px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
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
 * Enhanced VariableField Component - Mixed text and variable chips
 */
const EnhancedVariableField = forwardRef(function EnhancedVariableField(
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
		...props
	},
	ref,
) {
	const [segments, setSegments] = useState([]);
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [focusedSegmentIndex, setFocusedSegmentIndex] = useState(null);
	const [isUpdating, setIsUpdating] = useState(false);
	
	const containerRef = useRef();
	const wrapperRef = useRef();
	const segmentRefs = useRef({});
	const hiddenInputRef = useRef();
	const cursorPositionRef = useRef(null);

	// Parse value into segments
	const parseValue = useCallback((text) => {
		if (!text) {
			return [{
				id: `text-0`,
				type: "text",
				value: "",
			}];
		}

		const segments = [];
		let currentPos = 0;
		let idCounter = 0;
		
		// Pattern to match variables: {variable}
		const variablePattern = /{([^}]+)}/g;
		let match;

		while ((match = variablePattern.exec(text)) !== null) {
			// Add text before the variable if any
			if (match.index > currentPos) {
				segments.push({
					id: `text-${idCounter++}`,
					type: "text",
					value: text.substring(currentPos, match.index),
				});
			}

			// Add the variable as a chip
			segments.push({
				id: `var-${idCounter++}`,
				type: "variable",
				value: match[0], // Full {variable}
				display: match[1], // Just variable name
			});

			currentPos = match.index + match[0].length;
		}

		// Add remaining text
		if (currentPos < text.length) {
			segments.push({
				id: `text-${idCounter++}`,
				type: "text",
				value: text.substring(currentPos),
			});
		} else if (segments.length === 0 || segments[segments.length - 1].type === "variable") {
			// Ensure we end with a text segment for cursor placement
			segments.push({
				id: `text-${idCounter++}`,
				type: "text",
				value: "",
			});
		}

		return segments;
	}, []);

	// Initialize segments from value prop only on mount and external changes
	useEffect(() => {
		if (!isUpdating) {
			const parsed = parseValue(value);
			setSegments(parsed);
		}
	}, [value, parseValue, isUpdating]);

	// Convert segments to string
	const segmentsToString = useCallback((segs) => {
		return segs.map(seg => seg.value).join("");
	}, []);

	// Update parent value
	const updateValue = useCallback((newSegments, restoreCursor = true) => {
		setIsUpdating(true);
		const newValue = segmentsToString(newSegments);
		onChange(newValue);
		if (hiddenInputRef.current) {
			hiddenInputRef.current.value = newValue;
		}
		
		// Restore cursor position after React re-render
		if (restoreCursor && cursorPositionRef.current) {
			setTimeout(() => {
				const { segmentId, offset } = cursorPositionRef.current;
				const element = segmentRefs.current[segmentId];
				if (element && element.firstChild) {
					try {
						const range = document.createRange();
						const sel = window.getSelection();
						const textNode = element.firstChild.nodeType === Node.TEXT_NODE 
							? element.firstChild 
							: element;
						const maxOffset = textNode.textContent ? textNode.textContent.length : 0;
						range.setStart(textNode, Math.min(offset, maxOffset));
						range.collapse(true);
						sel.removeAllRanges();
						sel.addRange(range);
						element.focus();
					} catch (e) {
						// Fallback: just focus the element
						element.focus();
					}
				}
				setIsUpdating(false);
			}, 0);
		} else {
			setIsUpdating(false);
		}
	}, [onChange, segmentsToString]);

	// Save cursor position before updates
	const saveCursorPosition = useCallback(() => {
		const selection = window.getSelection();
		if (selection.rangeCount > 0 && focusedSegmentIndex !== null) {
			const segment = segments[focusedSegmentIndex];
			if (segment && segment.type === "text") {
				cursorPositionRef.current = {
					segmentId: segment.id,
					offset: selection.anchorOffset,
				};
			}
		}
	}, [focusedSegmentIndex, segments]);

	// Handle text input in a segment
	const handleTextInput = useCallback((segmentIndex, newText) => {
		saveCursorPosition();
		
		const newSegments = [...segments];
		newSegments[segmentIndex] = {
			...newSegments[segmentIndex],
			value: newText,
		};

		// Check for @ trigger
		const selection = window.getSelection();
		const cursorPos = selection.anchorOffset;
		const textBeforeCursor = newText.substring(0, cursorPos);
		const atIndex = textBeforeCursor.lastIndexOf("@");
		
		if (atIndex !== -1 && atIndex === textBeforeCursor.length - 1) {
			// Just typed @
			setSuggestions(options);
			setShowSuggestions(true);
			setSelectedIndex(0);
		} else if (atIndex !== -1 && atIndex < textBeforeCursor.length - 1) {
			// Typing after @
			const searchTerm = textBeforeCursor.substring(atIndex + 1).toLowerCase();
			const filtered = options.filter((option) => {
				const label = getOptionLabel(option).toLowerCase();
				return label.includes(searchTerm);
			});
			setSuggestions(filtered);
			setShowSuggestions(filtered.length > 0);
			setSelectedIndex(0);
		} else {
			setShowSuggestions(false);
		}

		setSegments(newSegments);
		updateValue(newSegments);
	}, [segments, options, getOptionLabel, updateValue, saveCursorPosition]);

	// Handle selecting a suggestion
	const selectSuggestion = useCallback((option) => {
		const focusedIndex = focusedSegmentIndex ?? segments.findIndex(s => s.type === "text");
		const segment = segments[focusedIndex];
		
		if (!segment || segment.type !== "text") return;

		// Get the element and its text
		const element = segmentRefs.current[segment.id];
		if (!element) return;

		const text = segment.value;
		const selection = window.getSelection();
		const cursorPos = selection.anchorOffset;
		const textBeforeCursor = text.substring(0, cursorPos);
		const atIndex = textBeforeCursor.lastIndexOf("@");
		
		if (atIndex === -1) return;

		// Split the text segment
		const beforeAt = text.substring(0, atIndex);
		const afterCursor = text.substring(cursorPos);
		
		const newSegments = [];
		let idCounter = 0;
		
		// Add segments before the focused one
		for (let i = 0; i < focusedIndex; i++) {
			newSegments.push(segments[i]);
		}
		
		// Add text before @ if any
		if (beforeAt) {
			newSegments.push({
				id: `text-new-${idCounter++}`,
				type: "text",
				value: beforeAt,
			});
		}
		
		// Add the variable chip
		const variableValue = getOptionValue(option);
		newSegments.push({
			id: `var-new-${idCounter++}`,
			type: "variable",
			value: variableValue,
			display: getOptionLabel(option),
		});
		
		// Add text after (or empty text for cursor)
		const afterSegmentId = `text-new-${idCounter++}`;
		newSegments.push({
			id: afterSegmentId,
			type: "text",
			value: afterCursor || "", // Don't add extra space
		});
		
		// Add remaining segments after the current one
		for (let i = focusedIndex + 1; i < segments.length; i++) {
			newSegments.push(segments[i]);
		}
		
		// Set cursor position to after the variable
		cursorPositionRef.current = {
			segmentId: afterSegmentId,
			offset: 0, // Start of the text segment after variable
		};
		
		setSegments(newSegments);
		setShowSuggestions(false);
		
		// Force update and restore focus
		setIsUpdating(true);
		const newValue = segmentsToString(newSegments);
		onChange(newValue);
		
		// Immediately restore focus to the text segment after variable
		setTimeout(() => {
			const element = segmentRefs.current[afterSegmentId];
			if (element) {
				element.focus();
				// Place cursor at beginning of the text segment
				const range = document.createRange();
				const sel = window.getSelection();
				if (element.firstChild) {
					range.setStart(element.firstChild, 0);
				} else {
					// Create a text node if empty
					const textNode = document.createTextNode("");
					element.appendChild(textNode);
					range.setStart(textNode, 0);
				}
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
			}
			setIsUpdating(false);
		}, 10);
	}, [focusedSegmentIndex, segments, getOptionValue, getOptionLabel, onChange, segmentsToString]);

	// Remove a variable chip
	const handleRemoveVariable = useCallback((segmentIndex) => {
		const newSegments = [...segments];
		const removed = newSegments.splice(segmentIndex, 1)[0];
		
		// Merge adjacent text segments if needed
		if (segmentIndex > 0 && 
			segmentIndex < newSegments.length && 
			newSegments[segmentIndex - 1] &&
			newSegments[segmentIndex] &&
			newSegments[segmentIndex - 1].type === "text" && 
			newSegments[segmentIndex].type === "text") {
			// Merge the two text segments
			const prevSegment = newSegments[segmentIndex - 1];
			const nextSegment = newSegments[segmentIndex];
			const prevValue = prevSegment.value || "";
			const nextValue = nextSegment.value || "";
			const mergedValue = prevValue + nextValue;
			const mergedId = prevSegment.id;
			
			newSegments[segmentIndex - 1] = {
				...prevSegment,
				value: mergedValue,
			};
			newSegments.splice(segmentIndex, 1);
			
			// Set cursor to the merge point
			cursorPositionRef.current = {
				segmentId: mergedId,
				offset: prevValue.length,
			};
		} else if (segmentIndex < newSegments.length) {
			// Just focus the segment after the removed variable
			const nextSegment = newSegments[segmentIndex];
			if (nextSegment && nextSegment.type === "text") {
				cursorPositionRef.current = {
					segmentId: nextSegment.id,
					offset: 0,
				};
			}
		} else if (segmentIndex > 0) {
			// Focus the segment before if we removed the last one
			const prevSegment = newSegments[segmentIndex - 1];
			if (prevSegment && prevSegment.type === "text") {
				cursorPositionRef.current = {
					segmentId: prevSegment.id,
					offset: prevSegment.value ? prevSegment.value.length : 0,
				};
			}
		}
		
		// Ensure at least one text segment exists
		if (newSegments.length === 0) {
			newSegments.push({
				id: `text-empty`,
				type: "text",
				value: "",
			});
			cursorPositionRef.current = {
				segmentId: `text-empty`,
				offset: 0,
			};
		}
		
		setSegments(newSegments);
		updateValue(newSegments);
	}, [segments, updateValue]);

	// Handle keyboard navigation
	const handleKeyDown = useCallback((e, segmentIndex) => {
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
		
		// Navigate between segments with arrow keys
		const selection = window.getSelection();
		const segment = segments[segmentIndex];
		
		if (e.keyCode === LEFT && selection.anchorOffset === 0) {
			// At the beginning of current text segment
			if (segmentIndex > 0) {
				e.preventDefault();
				// Move to the segment before (could be text or variable)
				const prevSegment = segments[segmentIndex - 1];
				
				if (prevSegment.type === "text") {
					// Focus previous text segment at end
					const textNode = segmentRefs.current[prevSegment.id];
					if (textNode) {
						textNode.focus();
						setTimeout(() => {
							const range = document.createRange();
							const sel = window.getSelection();
							range.selectNodeContents(textNode);
							range.collapse(false);
							sel.removeAllRanges();
							sel.addRange(range);
						}, 0);
					}
				} else if (prevSegment.type === "variable" && segmentIndex > 1) {
					// Skip over the variable to the text segment before it
					const textBeforeVariable = segments[segmentIndex - 2];
					if (textBeforeVariable && textBeforeVariable.type === "text") {
						const textNode = segmentRefs.current[textBeforeVariable.id];
						if (textNode) {
							textNode.focus();
							setTimeout(() => {
								const range = document.createRange();
								const sel = window.getSelection();
								range.selectNodeContents(textNode);
								range.collapse(false);
								sel.removeAllRanges();
								sel.addRange(range);
							}, 0);
						}
					}
				}
			}
		} else if (e.keyCode === RIGHT && 
				   selection.anchorOffset === (segment.value ? segment.value.length : 0)) {
			// At the end of current text segment
			if (segmentIndex < segments.length - 1) {
				e.preventDefault();
				// Move to the next segment (could be text or variable)
				const nextSegment = segments[segmentIndex + 1];
				
				if (nextSegment.type === "text") {
					// Focus next text segment at beginning
					const textNode = segmentRefs.current[nextSegment.id];
					if (textNode) {
						textNode.focus();
						setTimeout(() => {
							const range = document.createRange();
							const sel = window.getSelection();
							if (textNode.firstChild) {
								range.setStart(textNode.firstChild, 0);
							} else {
								range.setStart(textNode, 0);
							}
							range.collapse(true);
							sel.removeAllRanges();
							sel.addRange(range);
						}, 0);
					}
				} else if (nextSegment.type === "variable" && segmentIndex < segments.length - 2) {
					// Skip over the variable to the text segment after it
					const textAfterVariable = segments[segmentIndex + 2];
					if (textAfterVariable && textAfterVariable.type === "text") {
						const textNode = segmentRefs.current[textAfterVariable.id];
						if (textNode) {
							textNode.focus();
							setTimeout(() => {
								const range = document.createRange();
								const sel = window.getSelection();
								if (textNode.firstChild) {
									range.setStart(textNode.firstChild, 0);
								} else {
									range.setStart(textNode, 0);
								}
								range.collapse(true);
								sel.removeAllRanges();
								sel.addRange(range);
							}, 0);
						}
					}
				}
			}
		} else if (e.keyCode === BACKSPACE && 
				   selection.anchorOffset === 0 && 
				   segmentIndex > 0 &&
				   segments[segmentIndex - 1].type === "variable") {
			e.preventDefault();
			// Remove the variable before this text segment
			handleRemoveVariable(segmentIndex - 1);
		}
	}, [showSuggestions, suggestions, selectedIndex, selectSuggestion, segments, handleRemoveVariable]);

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
				// Focus the last text segment
				const lastTextSegment = segments
					.map((seg, idx) => ({ seg, idx }))
					.reverse()
					.find(({ seg }) => seg.type === "text");
				
				if (lastTextSegment && segmentRefs.current[lastTextSegment.seg.id]) {
					segmentRefs.current[lastTextSegment.seg.id].focus();
				}
			},
		}),
		[segments],
	);

	return (
		<BaseControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={label}
			help={help}
			className={`variable-field-enhanced ${className}`}
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
					className={isDisabled ? "is-disabled" : ""}
					onClick={(e) => {
						// Focus last text segment when clicking container
						if (e.target === e.currentTarget) {
							const lastTextSegment = segments
								.map((seg, idx) => ({ seg, idx }))
								.reverse()
								.find(({ seg }) => seg.type === "text");
							
							if (lastTextSegment && segmentRefs.current[lastTextSegment.seg.id]) {
								segmentRefs.current[lastTextSegment.seg.id].focus();
							}
						}
					}}
				>
					{segments.map((segment, index) => {
						if (segment.type === "variable") {
							return (
								<StyledChip key={segment.id}>
									<span className="chip-label" title={segment.value}>
										{segment.display}
									</span>
									<button
										className="chip-remove"
										onClick={(e) => {
											e.stopPropagation();
											handleRemoveVariable(index);
										}}
										aria-label={__("Remove variable", "wp-component-library")}
										tabIndex={-1}
									>
										✕
									</button>
								</StyledChip>
							);
						} else {
							return (
								<StyledTextSpan
									key={segment.id}
									ref={(el) => segmentRefs.current[segment.id] = el}
									contentEditable={!isDisabled}
									suppressContentEditableWarning
									data-placeholder={segments.length === 1 && index === 0 ? placeholder : ""}
									onInput={(e) => {
										handleTextInput(index, e.target.textContent);
									}}
									onKeyDown={(e) => handleKeyDown(e, index)}
									onFocus={() => setFocusedSegmentIndex(index)}
									onBlur={() => {
										// Delay to allow suggestion clicks
										setTimeout(() => {
											setFocusedSegmentIndex(null);
										}, 100);
									}}
									spellCheck={false}
								>
									{segment.value}
								</StyledTextSpan>
							);
						}
					})}
				</StyledFieldContainer>

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
										e.preventDefault(); // Prevent blur
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

export { EnhancedVariableField };