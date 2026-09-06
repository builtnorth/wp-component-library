import {
	closestCenter,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	restrictToParentElement,
	restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "@emotion/styled";
import { Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
	chevronDown,
	chevronUp,
	dragHandle,
	plusCircle,
	trash,
} from "@wordpress/icons";
import PropTypes from "prop-types";
import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

// Styled components
const StyledRepeater = styled.div`
	.built-repeater__items {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	&.wpcl-repeater--collapsible .built-repeater__items {
		gap: 0.75rem;
	}

	.built-repeater__empty-state {
		padding: 1rem;
		background: #f0f0f0;
		border-radius: 4px;
		margin-bottom: 1rem;
		opacity: 0.75;
	}

	.built-repeater__drag-overlay {
		opacity: 0.95;
		box-shadow:
			0 15px 30px rgba(0, 0, 0, 0.15),
			0 5px 15px rgba(0, 0, 0, 0.08);
		border-radius: 8px;
		background: var(--color--white);
		cursor: grabbing;
		transition: transform 0.2s ease;

		> div {
			background: var(--color--white);
			border-radius: 8px;
		}
	}
`;

const StyledSortableItem = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 1rem;
	background-color: var(--color--white, #fff);
	border: 1px solid var(--color--border, #e0e0e0);
	border-radius: 4px;
	padding: 1rem;
	transition: all 0.2s ease;
	position: relative;

	&.wpcl-repeater__item--dragging {
		opacity: 0.3;
	}

	&.wpcl-repeater__item--integrated {
		/* In integrated mode, ensure proper flex layout */
		> * {
			flex-grow: 1;
		}

		/* Drag handle, row actions, and remove button should not grow */
		.built-repeater__drag-handle,
		.built-repeater__remove-item,
		.built-repeater__item-action {
			flex-grow: 0;
			flex-shrink: 0;
			margin-top: 26px;
		}

		.built-repeater__item-action.components-button {
			width: auto;
			min-width: 36px;
		}

		/* Inline toggles beside labeled TextControl / SelectControl rows. */
		.built-repeater__inline-toggle {
			flex-grow: 0;
			flex-shrink: 0;
			align-self: flex-end;

			.components-toggle-control {
				margin-bottom: 0;
			}

			&.built-repeater__inline-toggle--category-selected
				.components-base-control__help {
				visibility: hidden;
			}
		}

		/* Read-only summary rows — meta left, actions right. */
		&:has(.built-repeater__summary) {
			align-items: center;
			justify-content: space-between;
			gap: 1rem;

			> * {
				flex-grow: 0;
			}

			.built-repeater__summary {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				gap: 0.75rem;
				flex: 1 1 auto;
				min-width: 0;
			}

			.built-repeater__summary-actions {
				display: flex;
				align-items: center;
				gap: 0.75rem;
				flex-shrink: 0;
			}

			.built-repeater__summary-name {
				flex-shrink: 1;
				min-width: 0;
				font-weight: 500;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.built-repeater__drag-handle,
			.built-repeater__remove-item,
			.built-repeater__item-action {
				margin-top: 0;
			}
		}
	}

	.built-repeater__item-handle {
		cursor: grab;
		flex-shrink: 0;
		transition:
			transform 0.15s ease,
			opacity 0.15s ease;

		&:active {
			cursor: grabbing;
			opacity: 0.7;
		}

		button {
			transition:
				background-color 0.15s ease,
				color 0.15s ease;

			&:hover {
				background-color: var(--wp-admin-theme-color, #007cba);
				color: var(--color--white);
			}
		}
	}

	.built-repeater__item-content {
		flex-grow: 1;
		width: 100%;
	}

	.built-repeater__item-actions {
		flex-shrink: 0;
	}

	&.wpcl-repeater__item--collapsible {
		flex-direction: column;
		align-items: stretch;
		gap: 0;
		padding: 0;

		.built-repeater__item-header {
			display: flex;
			align-items: center;
			gap: 0.75rem;
			padding: 0.75rem 1rem;
		}

		.built-repeater__summary {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: 0.75rem;
			flex: 1 1 auto;
			min-width: 0;
		}

		.built-repeater__summary-name {
			flex-shrink: 1;
			min-width: 0;
			font-weight: 500;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.built-repeater__item-header .components-toggle-control {
			margin-bottom: 0;
		}

		.built-repeater__item-toggle,
		.built-repeater__item-handle,
		.built-repeater__item-actions,
		.built-repeater__drag-handle,
		.built-repeater__remove-item {
			flex-shrink: 0;
			margin-top: 0;
		}

		.built-repeater__item-content {
			padding: 0 1rem 1rem;
		}
	}
`;

const StyledDragHandle = styled.div`
	margin-top: 26px;
	flex-shrink: 0;
`;

const itemChromeButtonProps = {
	variant: "secondary",
	iconSize: 20,
};

/**
 * Context for repeater item data
 */
const RepeaterItemContext = createContext();

/**
 * Drag handle component that can be used within renderItem
 */
export const DragHandle = ({
	label = __("Drag to reorder", "wp-component-library"),
	...props
}) => {
	const context = useContext(RepeaterItemContext);

	if (!context) {
		console.warn("DragHandle must be used within a Repeater item");
		return null;
	}

	const { attributes, listeners } = context;

	return (
		<StyledDragHandle
			className="built-repeater__drag-handle"
			{...attributes}
			{...listeners}
		>
			<Button
				icon={dragHandle}
				label={label}
				tabIndex={-1}
				{...itemChromeButtonProps}
				{...props}
			/>
		</StyledDragHandle>
	);
};

/**
 * Remove button component that can be used within renderItem
 */
export const RemoveButton = ({ label = __("Remove", "wp-component-library"), ...props }) => {
	const context = useContext(RepeaterItemContext);

	if (!context) {
		console.warn("RemoveButton must be used within a Repeater item");
		return null;
	}

	const { onRemove, id, canRemove } = context;

	if (!canRemove) {
		return null;
	}

	return (
		<Button
			className="built-repeater__remove-item"
			label={label}
			icon={trash}
			isDestructive={true}
			onClick={() => onRemove(id)}
			{...itemChromeButtonProps}
			{...props}
		/>
	);
};

const ExpandButton = ({ isExpanded, onToggle }) => (
	<Button
		className="built-repeater__item-toggle"
		icon={isExpanded ? chevronUp : chevronDown}
		label={
			isExpanded
				? __("Collapse", "wp-component-library")
				: __("Expand", "wp-component-library")
		}
		onClick={(event) => {
			event.preventDefault();
			event.stopPropagation();
			onToggle?.();
		}}
		aria-expanded={isExpanded}
		{...itemChromeButtonProps}
	/>
);

/**
 * Sortable item component for the repeater
 */
const SortableItem = ({
	id,
	children,
	onRemove,
	canRemove,
	isDragOverlay = false,
	renderMode = "default",
	enableReorder = true,
	collapsible = false,
	isExpanded = false,
	onToggle,
	summary = null,
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id, disabled: !enableReorder });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const dragProps = enableReorder ? { ...attributes, ...listeners } : {};

	const contextValue = {
		attributes: enableReorder ? attributes : {},
		listeners: enableReorder ? listeners : {},
		onRemove,
		id,
		canRemove,
	};

	const itemClassName = [
		renderMode === "integrated" && !collapsible
			? "wpcl-repeater__item--integrated"
			: "",
		collapsible ? "wpcl-repeater__item--collapsible" : "",
		collapsible && isExpanded ? "wpcl-repeater__item--expanded" : "",
		isDragging ? "wpcl-repeater__item--dragging" : "",
	]
		.filter(Boolean)
		.join(" ");

	if (collapsible) {
		return (
			<RepeaterItemContext.Provider value={contextValue}>
				<StyledSortableItem
					ref={setNodeRef}
					style={style}
					className={itemClassName}
				>
					<div className="built-repeater__item-header">
						{enableReorder && <DragHandle />}
						{summary ? (
							<div className="built-repeater__summary">
								{summary}
							</div>
						) : (
							<div className="built-repeater__summary" />
						)}
						{!isDragOverlay && (
							<ExpandButton
								isExpanded={isExpanded}
								onToggle={onToggle}
							/>
						)}
						{!isDragOverlay && <RemoveButton />}
					</div>
					{isExpanded && children ? (
						<div className="built-repeater__item-content">
							{children}
						</div>
					) : null}
				</StyledSortableItem>
			</RepeaterItemContext.Provider>
		);
	}

	if (renderMode === "integrated") {
		return (
			<RepeaterItemContext.Provider value={contextValue}>
			<StyledSortableItem
				ref={setNodeRef}
				style={style}
				className={`wpcl-repeater__item--integrated ${isDragging ? "wpcl-repeater__item--dragging" : ""}`}
			>
					{children}
				</StyledSortableItem>
			</RepeaterItemContext.Provider>
		);
	}

	// Default mode with built-in controls
	return (
		<StyledSortableItem
			ref={setNodeRef}
			style={style}
			className={isDragging ? "wpcl-repeater__item--dragging" : ""}
		>
			{enableReorder && (
				<div className="built-repeater__item-handle" {...dragProps}>
					<Button
						icon={dragHandle}
						label={__("Drag to reorder", "wp-component-library")}
						tabIndex={-1}
						{...itemChromeButtonProps}
					/>
				</div>
			)}
			<div className="built-repeater__item-content">{children}</div>
			{!isDragOverlay && canRemove && (
				<div className="built-repeater__item-actions">
					<Button
						label={__("Remove", "wp-component-library")}
						icon={trash}
						isDestructive={true}
						onClick={() => onRemove(id)}
						{...itemChromeButtonProps}
					/>
				</div>
			)}
		</StyledSortableItem>
	);
};

/**
 * A flexible repeater component with drag-and-drop functionality
 *
 * @param {Object} props
 * @param {Array} props.items - Array of items to be rendered
 * @param {Function} props.renderItem - Function to render each item's content
 * @param {Function} props.onAdd - Callback when add button is clicked
 * @param {Function} props.onRemove - Callback when remove button is clicked
 * @param {Function} props.onReorder - Callback when items are reordered
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.addButtonText - Text for the add button
 * @param {string} props.emptyStateText - Text to show when list is empty
 * @param {number} props.maxItems - Maximum number of items allowed
 * @param {number} props.minItems - Minimum number of items required
 * @param {string} props.renderMode - Control layout mode: "default" or "integrated"
 * @param {boolean} props.enableReorder - Whether items can be dragged to reorder (default true).
 *                                        When false, no drag handle renders and items keep
 *                                        whatever order `items` is in — for lists where order
 *                                        doesn't matter (e.g. a set of find/replace pairs).
 * @param {boolean} props.collapsible - When true, each item shows a header (optional
 *                                      `renderSummary` + chevron) and `renderItem` only while expanded.
 * @param {Function} props.renderSummary - Header content always visible when `collapsible` is true.
 * @param {boolean} props.defaultExpanded - When `collapsible`, existing items start open (default false).
 * @param {boolean} props.expandNewItems - When `collapsible`, a newly added item starts open (default true).
 */
const Repeater = ({
	items = [],
	renderItem,
	onAdd,
	onRemove,
	onReorder,
	className = "",
	addButtonText = __("Add Item", "wp-component-library"),
	emptyStateText = __(
		"No items added yet. Click the button below to add one.",
		"wp-component-library",
	),
	maxItems = null,
	minItems = 0,
	renderMode = "default",
	enableReorder = true,
	collapsible = false,
	renderSummary = null,
	defaultExpanded = false,
	expandNewItems = true,
}) => {
	const [activeId, setActiveId] = useState(null);
	const [expandedIds, setExpandedIds] = useState(() => {
		if (!collapsible || !defaultExpanded) {
			return new Set();
		}
		return new Set(items.map((item) => item.id));
	});
	const prevIdsRef = useRef(null);
	const itemIdsKey = items.map((item) => item.id).join("\0");

	useEffect(() => {
		const currentIds = itemIdsKey ? itemIdsKey.split("\0") : [];

		if (!collapsible) {
			prevIdsRef.current = currentIds;
			return;
		}

		if (prevIdsRef.current === null) {
			prevIdsRef.current = currentIds;
			return;
		}

		const prev = new Set(prevIdsRef.current);
		const added = currentIds.filter((id) => !prev.has(id));
		const currentIdSet = new Set(currentIds);

		setExpandedIds((current) => {
			const next = new Set();
			current.forEach((id) => {
				if (currentIdSet.has(id)) {
					next.add(id);
				}
			});
			if (expandNewItems && added.length === 1) {
				next.add(added[0]);
			}
			if (
				next.size === current.size &&
				[...next].every((id) => current.has(id))
			) {
				return current;
			}
			return next;
		});

		prevIdsRef.current = currentIds;
	}, [collapsible, expandNewItems, itemIdsKey]);

	const toggleExpanded = (id) => {
		setExpandedIds((current) => {
			const next = new Set(current);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

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

	const handleDragStart = (event) => {
		if (!enableReorder) {
			return;
		}
		setActiveId(event.active.id);
	};

	const handleDragEnd = (event) => {
		if (!enableReorder) {
			return;
		}
		const { active, over } = event;

		if (active.id !== over.id) {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over.id);

			const newItems = arrayMove(items, oldIndex, newIndex);
			onReorder(newItems);
		}

		setActiveId(null);
	};

	const handleRemove = (id) => {
		if (items.length > minItems) {
			onRemove(id);
		}
	};

	const canAddItem = maxItems === null || items.length < maxItems;
	const canRemoveItem = items.length > minItems;

	const activeItem = activeId
		? items.find((item) => item.id === activeId)
		: null;
	const activeIndex = activeItem
		? items.findIndex((item) => item.id === activeId)
		: -1;

	const repeaterClassName = [
		className,
		collapsible ? "wpcl-repeater--collapsible" : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<StyledRepeater className={repeaterClassName}>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				modifiers={[restrictToVerticalAxis, restrictToParentElement]}
			>
				{items.length === 0 ? (
					<div className="built-repeater__empty-state">
						{emptyStateText}
					</div>
				) : (
					<SortableContext
						items={items.map((item) => item.id)}
						strategy={verticalListSortingStrategy}
					>
						<div className="built-repeater__items">
							{items.map((item, index) => {
								const isExpanded =
									!collapsible || expandedIds.has(item.id);

								return (
									<SortableItem
										key={item.id}
										id={item.id}
										onRemove={handleRemove}
										canRemove={canRemoveItem}
										renderMode={renderMode}
										enableReorder={enableReorder}
										collapsible={collapsible}
										isExpanded={isExpanded}
										onToggle={() => toggleExpanded(item.id)}
										summary={
											collapsible && renderSummary
												? renderSummary(item, index)
												: null
										}
									>
										{isExpanded
											? renderItem(item, index)
											: null}
									</SortableItem>
								);
							})}
						</div>
					</SortableContext>
				)}
				<DragOverlay>
					{activeId && activeItem ? (
						<div className="built-repeater__drag-overlay">
							<SortableItem
								id={activeId}
								isDragOverlay={true}
								renderMode={renderMode}
								canRemove={canRemoveItem}
								onRemove={handleRemove}
								enableReorder={enableReorder}
								collapsible={collapsible}
								isExpanded={false}
								summary={
									collapsible && renderSummary
										? renderSummary(activeItem, activeIndex)
										: null
								}
							>
								{collapsible
									? null
									: renderItem(activeItem, activeIndex)}
							</SortableItem>
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
			{canAddItem && (
				<div className="built-repeater__add-button">
					<Button
						variant="secondary"
						icon={plusCircle}
						iconPosition="left"
						onClick={onAdd}
					>
						{addButtonText}
					</Button>
				</div>
			)}
		</StyledRepeater>
	);
};

Repeater.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	).isRequired,
	renderItem: PropTypes.func.isRequired,
	onAdd: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	onReorder: (props, propName, componentName) => {
		if (props.enableReorder === false) {
			return null;
		}
		if (typeof props[propName] !== "function") {
			return new Error(
				`\`${propName}\` is required in \`${componentName}\` unless \`enableReorder\` is false.`,
			);
		}
		return null;
	},
	className: PropTypes.string,
	addButtonText: PropTypes.string,
	emptyStateText: PropTypes.string,
	maxItems: PropTypes.number,
	minItems: PropTypes.number,
	renderMode: PropTypes.oneOf(["default", "integrated"]),
	enableReorder: PropTypes.bool,
	collapsible: PropTypes.bool,
	renderSummary: PropTypes.func,
	defaultExpanded: PropTypes.bool,
	expandNewItems: PropTypes.bool,
};

export { Repeater };
