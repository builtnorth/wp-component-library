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
import styled from '@emotion/styled';

// Styled components
const StyledToken = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 2px;
	padding: 0 2px 0 6px;
	height: 24px;
	background: #ddd;
	border-radius: 2px;
	font-size: 13px;
	cursor: grab;
	position: relative;

	&.is-dragging {
		opacity: 0.5;
		cursor: grabbing;
		z-index: 1000;
	}

	&.is-plain-text {
		background: transparent;
		border-radius: 0;
		padding: 0;
		cursor: move;

		.sortable-select__token-text {
			font-weight: normal;
		}
	}

	&.is-variable {
		background: #e0e0e0;
		border: 1px solid #ccc;
		font-family: monospace;
		font-size: 12px;
	}
`;

const StyledTokenText = styled.span`
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const StyledTokenRemove = styled(Button)`
	padding: 0;
	height: 18px;
	width: 18px;
	min-width: 18px;
	background: transparent;
	border: none;
	cursor: pointer;

	// Override WordPress button styles
	&.components-button.has-icon {
		padding: 0;
		width: 24px;
		min-width: 24px;
	}
`;

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
	isPlainText = false,
	isVariable = false,
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
		<StyledToken
			ref={setNodeRef}
			style={style}
			className={`${isDragging ? "is-dragging" : ""} ${isPlainText ? "is-plain-text" : ""} ${isVariable ? "is-variable" : ""}`}
			{...attributes}
			{...listeners}
		>
			<StyledTokenText>{value}</StyledTokenText>
			<StyledTokenRemove
				icon={closeSmall}
				label="Remove"
				onClick={(e) => {
					e.stopPropagation();
					onRemove();
				}}
				disabled={disabled}
				size="small"
			/>
		</StyledToken>
	);
}
