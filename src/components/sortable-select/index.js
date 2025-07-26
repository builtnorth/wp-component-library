/**
 * WordPress dependencies
 */
import { BaseControl, Spinner } from "@wordpress/components";
import {
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { BACKSPACE, DOWN, ENTER, ESCAPE, UP } from "@wordpress/keycodes";

/**
 * External dependencies
 */
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

/**
 * Internal dependencies
 */
import CustomSortableToken from "./custom-sortable-token";
import "./index.scss";

/**
 * Convert array of tokens to a properly spaced string
 * @param {Array} tokens - Array of token objects
 * @param {Function} getOptionLabel - Function to get label from token
 * @param {Function} getOptionValue - Function to get value from token
 * @returns {string} Properly spaced string
 */
function tokensToString(tokens, getOptionLabel, getOptionValue) {
	return tokens.map((token, index) => {
		const value = getOptionValue(token);
		const label = getOptionLabel(token);
		const displayValue = label || value;
		const prevToken = tokens[index - 1];
		
		// Special punctuation that shouldn't have spaces
		const isPunctuation = /^[\-–—.,;:!?]$/.test(displayValue.trim());
		
		let result = displayValue;
		
		// Add space before this token if:
		// - There's a previous token
		// - This token doesn't start with space or punctuation
		// - This token isn't punctuation itself
		if (prevToken && !isPunctuation && !/^[\s\-–—.,;:!?]/.test(displayValue)) {
			// Also check if previous token ends with punctuation
			const prevValue = getOptionLabel(prevToken) || getOptionValue(prevToken);
			if (!/[\s\-–—.,;:!?]$/.test(prevValue)) {
				result = ' ' + result;
			}
		}
		
		return result;
	}).join('');
}

/**
 * Memoized input component to prevent re-renders during drag
 */
const SearchInput = memo(function SearchInput({
	inputRef,
	inputValue,
	setInputValue,
	setShowSuggestions,
	suggestions,
	handleKeyDown,
	handleBlur,
	placeholder,
	isDisabled,
	isDragging,
	inputType = 'text',
}) {
	const InputComponent = inputType === 'textarea' ? 'textarea' : 'input';
	const inputProps = {
		ref: inputRef,
		className: "sortable-select__input",
		value: inputValue,
		onChange: (e) => setInputValue(e.target.value),
		onFocus: () => setShowSuggestions(suggestions.length > 0),
		onBlur: (e) => {
			// Prevent blur if we're dragging
			if (isDragging) {
				e.preventDefault();
				e.target.focus();
				return;
			}
			// Call the blur handler
			handleBlur();
			// Hide suggestions after a small delay to allow clicks
			setTimeout(() => setShowSuggestions(false), 200);
		},
		onKeyDown: handleKeyDown,
		placeholder: placeholder,
		disabled: isDisabled,
	};
	
	if (inputType !== 'textarea') {
		inputProps.type = 'text';
	}
	
	return <InputComponent {...inputProps} />;
});

/**
 * Inner component that handles the actual select functionality
 * Separated to prevent BaseControl from re-rendering
 */
const SortableSelectInner = memo(forwardRef(function SortableSelectInner({
	value,
	onChange,
	options,
	loadOptions,
	getOptionLabel,
	getOptionValue,
	placeholder,
	isDisabled,
	maxItems,
	requirePrefix,
	inputType,
}, ref) {
	const [suggestions, setSuggestions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [loadedOptions, setLoadedOptions] = useState([]);
	const [isDragging, setIsDragging] = useState(false);

	const inputRef = useRef();
	const wrapperRef = useRef();

	// Expose focus method to parent
	useImperativeHandle(ref, () => ({
		focus: () => {
			inputRef.current?.focus();
		}
	}), []);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// Create a map for quick lookups
	const optionsByLabel = useMemo(() => {
		const map = new Map();

		// Add all available options
		[...options, ...loadedOptions, ...value].forEach((option) => {
			map.set(getOptionLabel(option), option);
		});

		return map;
	}, [options, loadedOptions, value, getOptionLabel]);

	// Load suggestions when input changes
	useEffect(() => {
		if (!inputValue) {
			setSuggestions([]);
			setShowSuggestions(false);
			return;
		}

		// If requirePrefix is set, only search when input starts with @
		const shouldSearch = requirePrefix ? inputValue.startsWith('@') : true;
		const searchQuery = requirePrefix && inputValue.startsWith('@') 
			? inputValue.slice(1).trim() 
			: inputValue;

		// Special case: if requirePrefix and user just typed "@", show all options
		if (requirePrefix && inputValue === '@' && !loadOptions) {
			setSuggestions(options);
			setShowSuggestions(options.length > 0);
			return;
		}

		if (!shouldSearch || (!searchQuery && !requirePrefix)) {
			setSuggestions([]);
			setShowSuggestions(false);
			return;
		}

		if (!loadOptions) {
			// Use static options
			const filtered = searchQuery 
				? options.filter((option) => {
					const label = getOptionLabel(option);
					return label.toLowerCase().includes(searchQuery.toLowerCase());
				})
				: options; // Show all options if searchQuery is empty (just @ typed)
			
			// Filter out already selected options
			const availableOptions = filtered.filter((option) => {
				const optionValue = getOptionValue(option);
				return !value.some(v => getOptionValue(v) === optionValue);
			});
			
			setSuggestions(availableOptions);
			setShowSuggestions(availableOptions.length > 0);
			return;
		}

		// Load async options
		const loadSuggestions = async () => {
			setIsLoading(true);
			try {
				const results = await loadOptions(searchQuery);
				// Filter out already selected
				const filtered = results.filter((option) => {
					const optionValue = getOptionValue(option);
					return !value.some(
						(v) => getOptionValue(v) === optionValue,
					);
				});

				setLoadedOptions((prev) => {
					// Avoid duplicates
					const newOptions = [...prev];
					results.forEach((option) => {
						if (
							!newOptions.some(
								(o) =>
									getOptionValue(o) ===
									getOptionValue(option),
							)
						) {
							newOptions.push(option);
						}
					});
					return newOptions;
				});
				setSuggestions(filtered);
				setShowSuggestions(filtered.length > 0);
			} catch (error) {
				console.error("Error loading options:", error);
				setSuggestions([]);
				setShowSuggestions(false);
			} finally {
				setIsLoading(false);
			}
		};

		const timeoutId = setTimeout(loadSuggestions, 300);
		return () => clearTimeout(timeoutId);
	}, [inputValue, loadOptions]); // Removed dependencies causing infinite loop

	// Handle adding a token
	const handleAddToken = useCallback(
		(option) => {
			if (maxItems && value.length >= maxItems) {
				return;
			}

			onChange([...value, option]);
			setInputValue("");
			setShowSuggestions(false);
			inputRef.current?.focus();
		},
		[onChange, value, maxItems],
	);

	// Handle removing a token
	const handleRemoveToken = useCallback(
		(index) => {
			const newValue = value.filter((_, i) => i !== index);
			onChange(newValue);
		},
		[onChange, value],
	);

	// Handle keyboard navigation
	const handleKeyDown = useCallback(
		(event) => {
			switch (event.keyCode) {
				case BACKSPACE:
					// Remove last token if input is empty
					if (inputValue === '' && value.length > 0) {
						event.preventDefault();
						const newValue = value.slice(0, -1);
						onChange(newValue);
					}
					break;
				case ENTER:
					event.preventDefault();
					
					// If requirePrefix is set and input doesn't start with @, add as plain text
					if (requirePrefix && inputValue && !inputValue.startsWith('@')) {
						const plainTextOption = {
							[getOptionLabel.name === 'getOptionLabel' ? 'label' : 'name']: inputValue,
							[getOptionValue.name === 'getOptionValue' ? 'value' : 'id']: inputValue,
							isPlainText: true
						};
						handleAddToken(plainTextOption);
						return;
					}
					
					// Otherwise, add selected suggestion if available
					if (showSuggestions && suggestions.length > 0 && suggestions[selectedIndex]) {
						handleAddToken(suggestions[selectedIndex]);
					}
					break;
				case UP:
					if (showSuggestions && suggestions.length > 0) {
						event.preventDefault();
						setSelectedIndex((prev) => Math.max(0, prev - 1));
					}
					break;
				case DOWN:
					if (showSuggestions && suggestions.length > 0) {
						event.preventDefault();
						setSelectedIndex((prev) =>
							Math.min(suggestions.length - 1, prev + 1),
						);
					}
					break;
				case ESCAPE:
					event.preventDefault();
					setShowSuggestions(false);
					break;
			}
		},
		[showSuggestions, suggestions, selectedIndex, handleAddToken, requirePrefix, inputValue, getOptionLabel, getOptionValue, value, onChange],
	);

	// Handle blur - save plain text if requirePrefix and has value
	const handleBlur = useCallback(() => {
		if (requirePrefix && inputValue && !inputValue.startsWith('@')) {
			const plainTextOption = {
				[getOptionLabel.name === 'getOptionLabel' ? 'label' : 'name']: inputValue,
				[getOptionValue.name === 'getOptionValue' ? 'value' : 'id']: inputValue,
				isPlainText: true
			};
			handleAddToken(plainTextOption);
		}
	}, [requirePrefix, inputValue, getOptionLabel, getOptionValue, handleAddToken]);

	// Handle drag start
	const handleDragStart = useCallback(() => {
		setIsDragging(true);
		// Keep focus on input
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	// Handle drag end
	const handleDragEnd = useCallback(
		(event) => {
			setIsDragging(false);

			const { active, over } = event;

			if (!over || active.id === over.id) {
				return;
			}

			const oldIndex = value.findIndex(
				(item) => String(getOptionValue(item)) === active.id,
			);
			const newIndex = value.findIndex(
				(item) => String(getOptionValue(item)) === over.id,
			);

			if (oldIndex !== -1 && newIndex !== -1) {
				const newValue = arrayMove(value, oldIndex, newIndex);
				onChange(newValue);
			}
		},
		[value, onChange, getOptionValue],
	);

	// Keep focus on input after drag
	useEffect(() => {
		if (
			!isDragging &&
			inputRef.current &&
			document.activeElement !== inputRef.current
		) {
			const hadFocus = document.activeElement?.closest(
				".sortable-select__input-wrapper",
			);
			if (hadFocus) {
				inputRef.current.focus();
			}
		}
	}, [isDragging]);

	const ids = useMemo(
		() => value.map((item) => String(getOptionValue(item))),
		[value, getOptionValue],
	);

	return (
		<div 
			ref={wrapperRef} 
			className="sortable-select__wrapper"
			onClick={(e) => {
				// Focus input when clicking on wrapper (but not if clicking on input itself)
				if (e.target !== inputRef.current) {
					inputRef.current?.focus();
				}
			}}
		>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				modifiers={[restrictToParentElement]}
			>
				<div className="sortable-select__input-wrapper">
					<SortableContext items={ids} strategy={rectSortingStrategy}>
						{value.map((item, index) => (
							<CustomSortableToken
								key={getOptionValue(item)}
								id={String(getOptionValue(item))}
								value={getOptionLabel(item)}
								onRemove={() => handleRemoveToken(index)}
								disabled={isDisabled}
								isPlainText={item.isPlainText}
							/>
						))}
					</SortableContext>
					<SearchInput
						inputRef={inputRef}
						inputValue={inputValue}
						setInputValue={setInputValue}
						setShowSuggestions={setShowSuggestions}
						suggestions={suggestions}
						handleKeyDown={handleKeyDown}
						handleBlur={handleBlur}
						placeholder={value.length === 0 ? placeholder : ""}
						isDisabled={isDisabled}
						isDragging={isDragging}
						inputType={inputType}
					/>
				</div>
			</DndContext>

			{showSuggestions && (
				<div className="sortable-select__suggestions-container">
					<div className="sortable-select__suggestions">
						{isLoading ? (
							<div className="sortable-select__loading">
								<Spinner />
								<span>
									{__("Loading...", "wp-component-library")}
								</span>
							</div>
						) : (
							suggestions
								.filter((option) => {
									// Don't show already selected items
									const optionValue = getOptionValue(option);
									return !value.some(
										(v) =>
											getOptionValue(v) === optionValue,
									);
								})
								.map((option, index) => (
									<button
										key={getOptionValue(option)}
										className={`sortable-select__suggestion ${
											index === selectedIndex
												? "is-selected"
												: ""
										}`}
										onClick={() => handleAddToken(option)}
										onMouseEnter={() =>
											setSelectedIndex(index)
										}
									>
										{getOptionLabel(option)}
									</button>
								))
						)}
					</div>
				</div>
			)}
		</div>
	);
}));

/**
 * Custom SortableSelect Component
 *
 * A custom implementation that mimics FormTokenField but supports drag-and-drop.
 * No react-select, no @emotion!
 */
export default function SortableSelect({
	value = [],
	onChange,
	options = [],
	loadOptions,
	getOptionLabel = (option) => option.label || option.name || option.title,
	getOptionValue = (option) => option.value || option.id,
	placeholder = __("Search and select...", "wp-component-library"),
	label,
	help,
	isMulti = true,
	isDisabled = false,
	className = "",
	maxItems,
	requirePrefix = false,
	inputType = 'text',
	...props
}) {
	const innerRef = useRef();
	
	return (
		<BaseControl
			__nextHasNoMarginBottom
			__next40pxDefaultMarginBottom
			label={label}
			help={help}
			className={`sortable-select ${className}`}
			onClick={(e) => {
				// Focus input when clicking anywhere on the BaseControl
				innerRef.current?.focus();
			}}
		>
			<SortableSelectInner
				ref={innerRef}
				value={value}
				onChange={onChange}
				options={options}
				loadOptions={loadOptions}
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				placeholder={placeholder}
				isDisabled={isDisabled}
				maxItems={maxItems}
				requirePrefix={requirePrefix}
				inputType={inputType}
			/>
		</BaseControl>
	);
}

// Export the utility function for external use
export { tokensToString };
