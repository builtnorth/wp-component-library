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
import { dragHandle, plusCircle, trash } from "@wordpress/icons";
import PropTypes from "prop-types";
import React, { createContext, useContext, useState } from "react";

// Styled components
const StyledRepeater = styled.div`
	.built-repeater__items {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.built-repeater__empty-state {
		padding: 1rem;
		background: #f0f0f0;
		border-radius: 4px;
		margin-bottom: 1rem;
		opacity: 0.75;
	}

	.built-repeater__drag-overlay {
		opacity: 0.9;
	}
`;

const StyledSortableItem = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 1rem;

	&.polaris-repeater__item--dragging {
		opacity: 0.5;
	}

	&.polaris-repeater__item--integrated {
		/* In integrated mode, ensure proper flex layout */
		> * {
			flex-grow: 1;
		}

		/* Drag handle and remove button should not grow */
		.built-repeater__drag-handle,
		.built-repeater__remove-item {
			flex-grow: 0;
			flex-shrink: 0;
			margin-top: 26px;
		}
	}

	.built-repeater__item-handle {
		cursor: grab;
		flex-shrink: 0;

		&:active {
			cursor: grabbing;
		}
	}

	.built-repeater__item-content {
		flex-grow: 1;
		width: 100%;
	}

	.built-repeater__item-actions {
		flex-shrink: 0;
	}
`;

const StyledDragHandle = styled.div`
	margin-top: 26px;
	flex-shrink: 0;
`;

/**
 * Context for repeater item data
 */
const RepeaterItemContext = createContext();

/**
 * Drag handle component that can be used within renderItem
 */
export const DragHandle = ({
	label = __("Drag to reorder", "polaris"),
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
				iconSize={20}
				label={label}
				variant="secondary"
				tabIndex={-1}
				{...props}
			/>
		</StyledDragHandle>
	);
};

/**
 * Remove button component that can be used within renderItem
 */
export const RemoveButton = ({ label = __("Remove", "polaris"), ...props }) => {
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
			iconSize={20}
			variant="secondary"
			isDestructive={true}
			onClick={() => onRemove(id)}
			{...props}
		/>
	);
};

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
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const contextValue = {
		attributes,
		listeners,
		onRemove,
		id,
		canRemove,
	};

	if (renderMode === "integrated") {
		return (
			<RepeaterItemContext.Provider value={contextValue}>
				<StyledSortableItem
					ref={setNodeRef}
					style={style}
					className={`polaris-repeater__item--integrated ${isDragging ? "polaris-repeater__item--dragging" : ""}`}
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
			className={isDragging ? "polaris-repeater__item--dragging" : ""}
		>
			<div
				className="built-repeater__item-handle"
				{...attributes}
				{...listeners}
			>
				<Button
					icon={dragHandle}
					iconSize={20}
					label={__("Drag to reorder", "polaris")}
					variant="tertiary"
					size="compact"
					tabIndex={-1}
				/>
			</div>
			<div className="built-repeater__item-content">{children}</div>
			{!isDragOverlay && canRemove && (
				<div className="built-repeater__item-actions">
					<Button
						size="compact"
						label={__("Remove", "polaris")}
						icon={trash}
						iconSize={20}
						variant="tertiary"
						isDestructive={true}
						onClick={() => onRemove(id)}
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
 */
const Repeater = ({
	items = [],
	renderItem,
	onAdd,
	onRemove,
	onReorder,
	className = "",
	addButtonText = __("Add Item", "polaris"),
	emptyStateText = __(
		"No items added yet. Click the button below to add one.",
		"polaris",
	),
	maxItems = null,
	minItems = 0,
	renderMode = "default",
}) => {
	const [activeId, setActiveId] = useState(null);

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
		setActiveId(event.active.id);
	};

	const handleDragEnd = (event) => {
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

	return (
		<StyledRepeater className={className}>
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
							{items.map((item) => (
								<SortableItem
									key={item.id}
									id={item.id}
									onRemove={handleRemove}
									canRemove={canRemoveItem}
									renderMode={renderMode}
								>
									{renderItem(item)}
								</SortableItem>
							))}
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
							>
								{renderItem(activeItem)}
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
	onReorder: PropTypes.func.isRequired,
	className: PropTypes.string,
	addButtonText: PropTypes.string,
	emptyStateText: PropTypes.string,
	maxItems: PropTypes.number,
	minItems: PropTypes.number,
	renderMode: PropTypes.oneOf(["default", "integrated"]),
};

export { Repeater };
