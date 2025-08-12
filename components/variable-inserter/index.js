import styled from "@emotion/styled";
import { Button, Popover } from "@wordpress/components";
import { useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Icon, plusCircle } from "@wordpress/icons";

// Styled components
const StyledVariableInserter = styled.div`
	display: inline-flex;
	align-items: flex-start;
	margin-top: 1.5rem;
	align-self: flex-start;
`;

const StyledPopover = styled(Popover)`
	max-width: 400px;
	max-height: 260px;
	overflow-y: auto;
`;

const StyledVariables = styled.div`
	padding: 8px;
	display: flex;
	flex-direction: column;
	gap: 4px;
	background-color: var(--color--base, #efefef);
`;

const StyledVariable = styled(Button)`
	display: flex;
	align-items: center;
	text-align: left;
	padding: 8px 12px;
	border-radius: 4px;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: var(--wp-admin-theme-color);
		color: white;
	}
`;

const StyledVariableLabel = styled.span`
	font-weight: 500;
	font-size: 13px;
	line-height: 1.4;
`;

const StyledEmpty = styled.div`
	padding: 16px;
	text-align: center;
	color: #666;
	font-style: italic;

	@media (prefers-color-scheme: dark) {
		color: #ccc;
	}
`;

/**
 * VariableInserter Component
 *
 * A reusable component for inserting variable tags into text fields.
 * Similar to Yoast's variable inserter but more flexible and customizable.
 *
 * @param {Object} props Component props
 * @param {Array} props.variables Array of variable objects with label and value properties
 * @param {string} props.currentValue Current value of the text field
 * @param {Function} props.onChange Function to call when a variable is inserted
 * @param {Object} props.buttonProps Props to pass to the button component
 * @param {string} props.placeholder Placeholder text for the button
 * @param {string} props.className Additional CSS classes
 * @param {string} props.size Button size ('small', 'medium', 'large')
 * @param {string} props.variant Button variant ('primary', 'secondary', 'tertiary')
 */
const VariableInserter = ({
	variables = [],
	currentValue = "",
	onChange,
	buttonProps = {},
	placeholder = __("Insert Variable", "wp-component-library"),
	className = "",
	size = "default",
	variant = "tertiary",
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const buttonRef = useRef(null);

	const handleVariableClick = (variable) => {
		const newValue = currentValue + variable.value;
		onChange(newValue);
		setIsOpen(false);
	};

	const handleButtonClick = () => {
		setIsOpen(!isOpen);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<StyledVariableInserter className={className} {...props}>
			<Button
				ref={buttonRef}
				icon={<Icon icon={plusCircle} />}
				label={placeholder}
				onClick={handleButtonClick}
				size={size}
				variant={variant}
				{...buttonProps}
			/>

			{isOpen && (
				<StyledPopover
					anchor={buttonRef.current}
					onClose={handleClose}
					placement="bottom-start"
				>
					<StyledVariables>
						{variables.length === 0 ? (
							<StyledEmpty>
								{__(
									"No variables available",
									"wp-component-library",
								)}
							</StyledEmpty>
						) : (
							variables.map((variable) => (
								<StyledVariable
									key={variable.value}
									onClick={() =>
										handleVariableClick(variable)
									}
									variant="tertiary"
									size="small"
								>
									<StyledVariableLabel>
										{variable.label}
									</StyledVariableLabel>
								</StyledVariable>
							))
						)}
					</StyledVariables>
				</StyledPopover>
			)}
		</StyledVariableInserter>
	);
};

export { VariableInserter };
