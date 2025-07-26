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
import { DOWN, ENTER, ESCAPE, UP } from "@wordpress/keycodes";

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
 * Memoized input component to prevent re-renders during drag
 */
const SearchInput = memo(function SearchInput({
	inputRef,
	inputValue,
	setInputValue,
	setShowSuggestions,
	suggestions,
	handleKeyDown,
	placeholder,
	isDisabled,
	isDragging,
}) {
	return (
		<input
			ref={inputRef}
			type="text"
			className="sortable-select__input"
			value={inputValue}
			onChange={(e) => setInputValue(e.target.value)}
			onFocus={() => setShowSuggestions(suggestions.length > 0)}
			onBlur={(e) => {
				// Prevent blur if we're dragging
				if (isDragging) {
					e.preventDefault();
					e.target.focus();
					return;
				}
				// Hide suggestions after a small delay to allow clicks
				setTimeout(() => setShowSuggestions(false), 200);
			}}
			onKeyDown={handleKeyDown}
			placeholder={placeholder}
			disabled={isDisabled}
		/>
	);
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

		if (!loadOptions) {
			// Use static options
			const filtered = options.filter((option) => {
				const label = getOptionLabel(option);
				return label.toLowerCase().includes(inputValue.toLowerCase());
			});
			setSuggestions(filtered);
			setShowSuggestions(filtered.length > 0);
			return;
		}

		// Load async options
		const loadSuggestions = async () => {
			setIsLoading(true);
			try {
				const results = await loadOptions(inputValue);
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
			if (!showSuggestions || suggestions.length === 0) {
				return;
			}

			switch (event.keyCode) {
				case ENTER:
					event.preventDefault();
					if (suggestions[selectedIndex]) {
						handleAddToken(suggestions[selectedIndex]);
					}
					break;
				case UP:
					event.preventDefault();
					setSelectedIndex((prev) => Math.max(0, prev - 1));
					break;
				case DOWN:
					event.preventDefault();
					setSelectedIndex((prev) =>
						Math.min(suggestions.length - 1, prev + 1),
					);
					break;
				case ESCAPE:
					event.preventDefault();
					setShowSuggestions(false);
					break;
			}
		},
		[showSuggestions, suggestions, selectedIndex, handleAddToken],
	);

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
						placeholder={value.length === 0 ? placeholder : ""}
						isDisabled={isDisabled}
						isDragging={isDragging}
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
			/>
		</BaseControl>
	);
}
