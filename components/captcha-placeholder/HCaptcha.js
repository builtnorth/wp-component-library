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
import { CaptchaContainer } from "./styles";

const HCaptchaWrapper = styled.div`
	display: inline-flex;
	align-items: center;
	background: ${props => props.theme === 'dark' ? '#333' : '#fafafa'};
	border: 1px solid ${props => props.theme === 'dark' ? '#555' : '#e0e0e0'};
	color: ${props => props.theme === 'dark' ? '#fff' : 'inherit'};
	border-radius: 4px;
	padding: ${props => props.size === 'compact' ? '8px 10px' : '12px 14px'};
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
	position: relative;
	cursor: not-allowed;
	font-size: ${props => props.size === 'compact' ? '13px' : '15px'};
`;

const HCaptchaCheckbox = styled.div`
	width: 28px;
	height: 28px;
	border: 2px solid #0074bf;
	border-radius: 4px;
	margin-right: 12px;
	background: white;
	position: relative;
`;

const HCaptchaLabel = styled.div`
	margin-right: 12px;
	font-size: 15px;
	color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
`;

const HCaptchaLogo = styled.div`
	margin-left: auto;
	display: flex;
	align-items: center;
	gap: 8px;
`;

const HCaptchaLogoSvg = styled.div`
	width: 24px;
	height: 24px;
	background: #0074bf;
	color: white;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	font-size: 16px;
`;

const HCaptchaText = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 10px;
	color: #666;
	line-height: 1.2;

	span {
		font-weight: 500;
		color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
	}

	small {
		color: #0074bf;
	}
`;

export function HCaptcha({ theme, size }) {
	return (
		<CaptchaContainer>
			<HCaptchaWrapper theme={theme} size={size}>
				<HCaptchaCheckbox />
				<HCaptchaLabel theme={theme}>{__("I am human", "polaris-forms")}</HCaptchaLabel>
				<HCaptchaLogo>
					<HCaptchaLogoSvg>h</HCaptchaLogoSvg>
					<HCaptchaText theme={theme}>
						<span>hCaptcha</span>
						<small>Privacy - Terms</small>
					</HCaptchaText>
				</HCaptchaLogo>
			</HCaptchaWrapper>
		</CaptchaContainer>
	);
}