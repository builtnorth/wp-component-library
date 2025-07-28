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

const StyledInput = styled.input`
	width: 100%;
	min-height: 40px;
	padding: 2px 8px;
	border: 1px solid #757575;
	border-radius: 2px;
	background: #fff;
	font-size: 13px;
	font-family: inherit;
	margin: 0;
	line-height: 26px;

	&:focus {
		border-color: var(--wp-admin-theme-color, #007cba);
		box-shadow: 0 0 0 1px var(--wp-admin-theme-color, #007cba);
		outline: 2px solid transparent;
	}
`;

const StyledTextarea = styled.textarea`
	width: 100%;
	min-height: 40px;
	padding: 2px 8px;
	border: 1px solid #757575;
	border-radius: 2px;
	background: #fff;
	font-size: 13px;
	font-family: inherit;
	margin: 0;
	line-height: 26px;
	resize: vertical;
	min-height: 80px;
	max-height: 140px;
	line-height: 1.4;
	padding-top: 2px;

	&:focus {
		border-color: var(--wp-admin-theme-color, #007cba);
		box-shadow: 0 0 0 1px var(--wp-admin-theme-color, #007cba);
		outline: 2px solid transparent;
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

/**
 * VariableField Component - Simple input with @ autocomplete
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
			"Type @ to insert a variable...",
			"wp-component-library",
		),
		label,
		help,
		isDisabled = false,
		inputType = "text",
		className = "",
		...props
	},
	ref,
) {
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [cursorPosition, setCursorPosition] = useState(0);

	const inputRef = useRef();
	const wrapperRef = useRef();

	// Expose focus method to parent
	useImperativeHandle(
		ref,
		() => ({
			focus: () => {
				inputRef.current?.focus();
			},
		}),
		[],
	);

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

	// Get word at cursor position
	const getWordAtCursor = useCallback((text, cursorPos) => {
		let start = cursorPos - 1;
		while (start >= 0 && text[start] !== " " && text[start] !== "\n") {
			start--;
		}
		start++;

		let end = cursorPos;
		while (end < text.length && text[end] !== " " && text[end] !== "\n") {
			end++;
		}

		return {
			word: text.substring(start, end),
			start,
			end,
		};
	}, []);

	// Handle input change
	const handleChange = useCallback(
		(e) => {
			const newValue = e.target.value;
			const newCursorPos = e.target.selectionStart;

			onChange(newValue);
			setCursorPosition(newCursorPos);

			// Check if we should show suggestions
			const { word } = getWordAtCursor(newValue, newCursorPos);

			if (word.startsWith("@") && word.length > 1) {
				const searchTerm = word.substring(1).toLowerCase();
				const filtered = options.filter((option) => {
					const label = getOptionLabel(option).toLowerCase();
					return label.includes(searchTerm);
				});
				setSuggestions(filtered);
				setShowSuggestions(true);
				setSelectedIndex(0);
			} else if (word === "@") {
				setSuggestions(options);
				setShowSuggestions(true);
				setSelectedIndex(0);
			} else {
				setShowSuggestions(false);
			}
		},
		[onChange, options, getOptionLabel, getWordAtCursor],
	);

	// Handle selecting a suggestion
	const selectSuggestion = useCallback(
		(option) => {
			const { word, start, end } = getWordAtCursor(value, cursorPosition);

			const before = value.substring(0, start);
			const after = value.substring(end);
			const variable = getOptionValue(option);
			const newValue = before + variable + " " + after;

			onChange(newValue);
			setShowSuggestions(false);

			// Set cursor position after the inserted variable
			const newCursorPos = start + variable.length + 1;
			setTimeout(() => {
				inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
				inputRef.current?.focus();
			}, 0);
		},
		[value, cursorPosition, onChange, getOptionValue, getWordAtCursor],
	);

	// Handle keyboard navigation
	const handleKeyDown = useCallback(
		(e) => {
			if (!showSuggestions || suggestions.length === 0) return;

			switch (e.keyCode) {
				case UP:
					e.preventDefault();
					setSelectedIndex((prev) => Math.max(0, prev - 1));
					break;
				case DOWN:
					e.preventDefault();
					setSelectedIndex((prev) =>
						Math.min(suggestions.length - 1, prev + 1),
					);
					break;
				case ENTER:
					if (suggestions[selectedIndex]) {
						e.preventDefault();
						selectSuggestion(suggestions[selectedIndex]);
					}
					break;
				case ESCAPE:
					e.preventDefault();
					setShowSuggestions(false);
					break;
			}
		},
		[showSuggestions, suggestions, selectedIndex, selectSuggestion],
	);

	const InputComponent =
		inputType === "textarea" ? StyledTextarea : StyledInput;
	const inputProps = {
		ref: inputRef,
		value: value,
		onChange: handleChange,
		onKeyDown: handleKeyDown,
		placeholder: placeholder,
		disabled: isDisabled,
		...props,
	};

	if (inputType !== "textarea") {
		inputProps.type = "text";
	}

	return (
		<BaseControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={label}
			help={help}
			className={`variable-field ${className}`}
		>
			<StyledWrapper ref={wrapperRef}>
				<InputComponent {...inputProps} />

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
									onClick={() => selectSuggestion(option)}
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
