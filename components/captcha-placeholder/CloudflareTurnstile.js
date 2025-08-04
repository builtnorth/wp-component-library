/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import styled from "@emotion/styled";

/**
 * Internal dependencies
 */
import { CaptchaContainer, InvisibleNotice } from "./styles";

const Turnstile = styled.div`
	display: inline-flex;
	align-items: center;
	background: ${props => {
		if (props.theme === 'dark') return '#1f1f1f';
		if (props.mode === 'non-interactive') return '#f9fafb';
		return 'white';
	}};
	border: 1px solid ${props => props.theme === 'dark' ? '#444' : '#ddd'};
	color: ${props => props.theme === 'dark' ? '#fff' : 'inherit'};
	border-radius: 8px;
	padding: 12px 16px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.08);
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
	position: relative;
	min-width: 300px;
	cursor: not-allowed;

	${props => props.theme === 'auto' && `
		@media (prefers-color-scheme: dark) {
			background: #1f1f1f;
			border-color: #444;
			color: #fff;
		}
	`}
`;

const TurnstileCheckbox = styled.div`
	width: 24px;
	height: 24px;
	border: 2px solid #d1d5db;
	border-radius: 4px;
	margin-right: 12px;
	background: white;
`;

const TurnstileLabel = styled.div`
	flex: 1;
	font-size: 14px;
	color: ${props => props.theme === 'dark' ? '#fff' : '#374151'};
`;

const TurnstileSpinner = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

const TurnstileSpinnerInner = styled.div`
	width: 24px;
	height: 24px;
	border: 3px solid #e5e7eb;
	border-top-color: #f97316;
	border-radius: 50%;
	animation: spin 1s linear infinite;

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
`;

const TurnstileLogo = styled.div`
	font-size: 12px;
	color: #f97316;
	font-weight: 600;
`;

export function CloudflareTurnstile({ theme, mode }) {
	if (mode === 'invisible') {
		return (
			<InvisibleNotice>
				{__("Invisible captcha - runs automatically on form submission", "polaris-forms")}
			</InvisibleNotice>
		);
	}

	return (
		<CaptchaContainer>
			<Turnstile theme={theme} mode={mode}>
				{mode === 'managed' && (
					<>
						<TurnstileCheckbox />
						<TurnstileLabel theme={theme}>{__("Verify you are human", "polaris-forms")}</TurnstileLabel>
					</>
				)}
				{mode === 'non-interactive' && (
					<TurnstileSpinner>
						<TurnstileSpinnerInner />
						<TurnstileLabel theme={theme}>{__("Verifying...", "polaris-forms")}</TurnstileLabel>
					</TurnstileSpinner>
				)}
				<TurnstileLogo>Cloudflare</TurnstileLogo>
			</Turnstile>
		</CaptchaContainer>
	);
}