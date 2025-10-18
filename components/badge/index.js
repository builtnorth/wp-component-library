/**
 * Badge Component
 *
 * A small status indicator that displays text with semantic colors and icons.
 * Matches WordPress Gutenberg Badge component design exactly.
 *
 * @package WPComponentLibrary
 */

import styled from "@emotion/styled";
import { Icon } from "@wordpress/components";
import { check, warning, info, caution } from "@wordpress/icons";

// Badge container with intent-based styling - matches Gutenberg exactly
const BadgeContainer = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 0 8px;
	height: 24px;
	border-radius: 2px;
	font-size: 12px;
	font-weight: 400;
	line-height: 24px;
	white-space: nowrap;

	// Intent-based color schemes matching Gutenberg Badge
	${(props) => {
		switch (props.intent) {
			case "error":
			case "critical":
				return `
					background-color: var(--color--error-light, #fcebea);
					color: var(--color--error, #cc1818);
				`;
			case "warning":
				return `
					background-color: var(--color--warning-light, #fef8e6);
					color: var(--color--warning-dark, #b26200);
				`;
			case "info":
			case "suggestion":
				return `
					background-color: var(--color--info-light, #e6f2ff);
					color: var(--color--info-dark, #005cb8);
				`;
			case "success":
			case "passed":
				return `
					background-color: var(--color--success-light, #edfaef);
					color: var(--color--success-dark, #007017);
				`;
			case "default":
			default:
				return `
					background-color: #f0f0f0;
					color: #1e1e1e;
				`;
		}
	}}

	// Icon styling to match text color
	svg {
		fill: currentColor;
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}
`;

/**
 * Badge Component
 *
 * @param {Object} props - Component props
 * @param {string} props.children - Badge text content
 * @param {string} props.intent - Visual intent: 'default', 'error', 'critical', 'warning', 'info', 'suggestion', 'success', 'passed'
 * @param {boolean} props.showIcon - Whether to show an icon (default: true)
 * @param {Object} props.icon - Custom icon to display (overrides default icon)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props...otherProps - Any other props to pass to the container
 *
 * @returns {JSX.Element} Badge component
 */
export function Badge({
	children,
	intent = "default",
	showIcon = true,
	icon = null,
	className = "",
	...otherProps
}) {
	// Determine icon based on intent - matches Gutenberg icons
	const getIntentIcon = () => {
		if (icon) return icon;
		if (!showIcon) return null;

		switch (intent) {
			case "error":
			case "critical":
				return caution;
			case "warning":
				return caution;
			case "info":
			case "suggestion":
				return info;
			case "success":
			case "passed":
				return check;
			default:
				return info;
		}
	};

	const intentIcon = getIntentIcon();

	return (
		<BadgeContainer
			intent={intent}
			className={`wp-component-library-badge ${className}`}
			{...otherProps}
		>
			{intentIcon && <Icon icon={intentIcon} size={16} />}
			{children}
		</BadgeContainer>
	);
}

// Export as default and named export for flexibility
export default Badge;
