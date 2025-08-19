/**
 * AI Field Wrapper Component
 *
 * Wraps form fields to add inline AI generation capability
 */

import styled from "@emotion/styled";
import { Flex, FlexBlock, FlexItem } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { AIGenerator } from "./generator";

// Styled components
const StyledFieldWrapper = styled.div`
	position: relative;
`;

const StyledFieldLabel = styled(Flex)`
	.components-base-control__label {
	}

	/* Responsive: Stack on small screens */
	@media (max-width: 600px) {
		flex-direction: column;
		align-items: flex-start;

		.components-button {
			margin-top: 4px;
		}
	}
`;

const StyledButtonAbove = styled.div`
	margin-bottom: 8px;
`;

const StyledButtonBelow = styled.div`
	margin-top: 8px;
`;

/**
 * AI Field Wrapper - Adds AI generation button to field labels
 * SIMPLIFIED VERSION - Direct prop passing, no complex layering
 */
export function AIFieldWrapper({
	children,
	type,
	value,
	onChange,
	context = {},
	label,
	buttonPosition = "label",
	showButton = true,
	// Direct button customization props
	buttonSize = "small",
	buttonVariant = "tertiary",
	buttonText = "",
	buttonTooltip = __("Generate with AI", "wp-component-library"),
}) {
	// If no AI type or button hidden, just render children
	if (!type || !showButton) {
		return children;
	}

	// Create the AI button - SIMPLE, DIRECT
	const aiButton = (
		<AIGenerator
			type={type}
			value={value}
			onChange={onChange}
			context={context}
			mode="button"
			size={buttonSize}
			variant={buttonVariant}
			buttonText={buttonText}
			className="ai-generator-button"
			buttonProps={{
				label: buttonTooltip,
				showTooltip: true,
			}}
		/>
	);

	// Position button in label (most common case)
	if (buttonPosition === "label" && label) {
		return (
			<StyledFieldWrapper>
				<StyledFieldLabel align="center" gap={2}>
					<FlexBlock>
						<span className="components-base-control__label">
							{label}
						</span>
					</FlexBlock>
					<FlexItem>{aiButton}</FlexItem>
				</StyledFieldLabel>
				{children}
			</StyledFieldWrapper>
		);
	}

	// Position button above field
	if (buttonPosition === "above") {
		return (
			<StyledFieldWrapper>
				<StyledButtonAbove>{aiButton}</StyledButtonAbove>
				{children}
			</StyledFieldWrapper>
		);
	}

	// Position button below field (default/fallback)
	return (
		<StyledFieldWrapper>
			{children}
			<StyledButtonBelow>{aiButton}</StyledButtonBelow>
		</StyledFieldWrapper>
	);
}
