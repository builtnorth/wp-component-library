import styled from "@emotion/styled";
import { Button, Popover } from "@wordpress/components";
import { useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Icon, plusCircle } from "@wordpress/icons";

const StyledVariableInserter = styled.div`
	display: inline-flex;
	align-items: flex-start;
	margin-top: 1.5rem;
	align-self: flex-start;
`;

const StyledPopover = styled(Popover)`
	&.components-popover {
		.components-popover__content {
			min-width: 280px;
			max-width: min(440px, 92vw);
			padding: 0;
		}
	}
`;

const StyledChipPanel = styled.div`
	padding: 14px 16px;
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	max-height: 300px;
	overflow-y: auto;
	background-color: var(--wp--preset--color--base-2, #f6f7f7);
	border-radius: 2px;
`;

const StyledChip = styled.button`
	display: inline-flex;
	align-items: center;
	margin: 0;
	padding: 7px 14px;
	border: 1px solid var(--wp-admin-theme-color, #3858e9);
	border-radius: 999px;
	background: #fff;
	color: var(--wp-admin-theme-color, #3858e9);
	font-family: inherit;
	font-size: 11px;
	font-weight: 400;
	line-height: 1.35;
	cursor: pointer;
	transition:
		background-color 0.15s ease,
		color 0.15s ease,
		border-color 0.15s ease;

	&:hover,
	&:focus-visible {
		background: var(--wp-admin-theme-color, #3858e9);
		border-color: var(--wp-admin-theme-color, #3858e9);
		color: #fff;
		outline: none;
	}

	@media (prefers-color-scheme: dark) {
		background: #1e1e1e;
		color: #fff;
		border-color: var(--wp-admin-theme-color, #3858e9);

		&:hover,
		&:focus-visible {
			background: var(--wp-admin-theme-color, #3858e9);
			color: #fff;
		}
	}
`;

const StyledEmpty = styled.div`
	padding: 16px 20px;
	text-align: center;
	color: #646970;
	font-size: 13px;
	font-style: italic;
	line-height: 1.4;

	@media (prefers-color-scheme: dark) {
		color: #c3c4c7;
	}
`;

/**
 * VariableInserter — popover of merge-tag chips for text fields.
 *
 * @param {Object} props
 * @param {Array<{label: string, value: string}>} props.variables
 * @param {string} props.currentValue
 * @param {Function} props.onChange
 * @param {Object} props.buttonProps
 * @param {string} props.placeholder
 * @param {string} props.className
 * @param {string} props.size
 * @param {string} props.variant
 */
const VariableInserter = ({
	variables = [],
	currentValue = "",
	onChange,
	buttonProps = {},
	placeholder = __("Insert variable", "wp-component-library"),
	className = "",
	size = "default",
	variant = "tertiary",
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const buttonRef = useRef(null);

	const handleVariableClick = (variable) => {
		onChange(currentValue + variable.value);
		setIsOpen(false);
	};

	return (
		<StyledVariableInserter className={className} {...props}>
			<Button
				ref={buttonRef}
				icon={<Icon icon={plusCircle} />}
				label={placeholder}
				onClick={() => setIsOpen((open) => !open)}
				size={size}
				variant={variant}
				{...buttonProps}
			/>

			{isOpen && (
				<StyledPopover
					className="variable-inserter-popover"
					anchor={buttonRef.current}
					onClose={() => setIsOpen(false)}
					placement="bottom-start"
				>
					<StyledChipPanel className="variable-inserter-chips">
						{variables.length === 0 ? (
							<StyledEmpty>
								{__(
									"No variables available",
									"wp-component-library",
								)}
							</StyledEmpty>
						) : (
							variables.map((variable) => (
								<StyledChip
									key={variable.value}
									type="button"
									className="variable-inserter-chip"
									onClick={() =>
										handleVariableClick(variable)
									}
								>
									{variable.label}
								</StyledChip>
							))
						)}
					</StyledChipPanel>
				</StyledPopover>
			)}
		</StyledVariableInserter>
	);
};

export { VariableInserter };
