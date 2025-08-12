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
import { CaptchaContainer, CheckboxBorder, RECAPTCHA_LOGO_BASE64 } from "./styles";

const RecaptchaV2 = styled.div`
	display: inline-flex;
	align-items: center;
	background: ${props => props.theme === 'dark' ? '#222' : '#f9f9f9'};
	border: 1px solid ${props => props.theme === 'dark' ? '#555' : '#d3d3d3'};
	color: ${props => props.theme === 'dark' ? '#e8eaed' : 'inherit'};
	border-radius: 3px;
	padding: ${props => props.size === 'compact' ? '6px 8px' : '10px 12px'};
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	font-family: Roboto, Arial, sans-serif;
	position: relative;
	cursor: not-allowed;
	font-size: ${props => props.size === 'compact' ? '12px' : '14px'};
`;

const RecaptchaLabel = styled.div`
	margin-right: 12px;
	font-size: 14px;
	color: #555;
`;

const RecaptchaLogo = styled.div`
	margin-left: auto;
	display: flex;
	align-items: center;
	gap: 8px;

	img {
		width: 32px;
		height: 32px;
	}
`;

const RecaptchaText = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 10px;
	color: #555;
	line-height: 1.2;

	span {
		font-weight: 500;
	}

	small {
		color: #1a73e8;
	}
`;

const RecaptchaV3Badge = styled.div`
	display: inline-flex;
	align-items: center;
	background: white;
	border: 1px solid #ddd;
	border-radius: 3px;
	padding: 8px 12px;
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	font-size: 9px;
	color: #555;
`;

const RecaptchaV3Logo = styled.div`
	margin-right: 8px;
	
	img {
		width: 24px;
		height: 24px;
	}
`;

const RecaptchaV3Text = styled.div`
	line-height: 1.2;

	strong {
		font-size: 10px;
	}
`;

const RecaptchaV3Links = styled.div`
	color: #1a73e8;
	margin-top: 2px;
`;

export function GoogleRecaptchaV2({ theme, size }) {
	return (
		<CaptchaContainer>
			<RecaptchaV2 theme={theme} size={size}>
				<CheckboxBorder />
				<RecaptchaLabel>{__("I'm not a robot", "polaris-forms")}</RecaptchaLabel>
				<RecaptchaLogo>
					<img src={RECAPTCHA_LOGO_BASE64} alt="reCAPTCHA" />
					<RecaptchaText>
						<span>reCAPTCHA</span>
						<small>Privacy - Terms</small>
					</RecaptchaText>
				</RecaptchaLogo>
			</RecaptchaV2>
		</CaptchaContainer>
	);
}

export function GoogleRecaptchaV3() {
	return (
		<CaptchaContainer>
			<RecaptchaV3Badge>
				<RecaptchaV3Logo>
					<img src={RECAPTCHA_LOGO_BASE64} alt="reCAPTCHA" />
				</RecaptchaV3Logo>
				<RecaptchaV3Text>
					protected by<br/>
					<strong>reCAPTCHA</strong>
					<RecaptchaV3Links>Privacy - Terms</RecaptchaV3Links>
				</RecaptchaV3Text>
			</RecaptchaV3Badge>
		</CaptchaContainer>
	);
}