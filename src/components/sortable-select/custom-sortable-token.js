/**
 * WordPress dependencies
 */
import { Button } from "@wordpress/components";
import { closeSmall } from "@wordpress/icons";

/**
 * External dependencies
 */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * CustomSortableToken Component
 *
 * A draggable token for the custom sortable select implementation.
 */
export default function CustomSortableToken({
	id,
	value,
	onRemove,
	disabled = false,
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: id,
		disabled: disabled,
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	return (
		<span
			ref={setNodeRef}
			style={style}
			className={`sortable-select__token ${isDragging ? "is-dragging" : ""}`}
			{...attributes}
			{...listeners}
		>
			<span className="sortable-select__token-text">{value}</span>
			<Button
				className="sortable-select__token-remove"
				icon={closeSmall}
				label="Remove"
				onClick={(e) => {
					e.stopPropagation();
					onRemove();
				}}
				disabled={disabled}
				size="small"
			/>
		</span>
	);
}
