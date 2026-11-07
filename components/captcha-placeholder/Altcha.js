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

const AltchaWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
	width: 320px;
	max-width: 100%;
	box-sizing: border-box;
	padding: 12px;
	background: #fff;
	border: 1px solid #d8d8d8;
	border-radius: 4px;
	color: #222;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
	cursor: not-allowed;
`;

const AltchaMain = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 16px;
`;

const AltchaCheckbox = styled.div`
	width: 20px;
	height: 20px;
	border: 2px solid #8a8a8a;
	border-radius: 3px;
	background: #fff;
	flex-shrink: 0;
`;

const AltchaLogo = styled.svg`
	width: 22px;
	height: 22px;
	margin-left: auto;
	color: #444;
`;

const AltchaFooter = styled.div`
	align-self: flex-end;
	font-size: 11px;
	color: #666;
`;

/**
 * ALTCHA preview. `floating` has no box in the form, so it shows a notice.
 *
 * @param {Object} props
 * @param {string} props.display "standard" or "floating".
 */
export function Altcha({ display = "standard" }) {
	if (display === "floating") {
		return (
			<CaptchaContainer>
				<InvisibleNotice>
					{__(
						"ALTCHA runs in the background and only appears by the submit button if a visitor sends the form before it finishes.",
						"wp-component-library",
					)}
				</InvisibleNotice>
			</CaptchaContainer>
		);
	}

	return (
		<CaptchaContainer>
			<AltchaWrapper>
				<AltchaMain>
					<AltchaCheckbox />
					<span>{__("I'm not a robot", "wp-component-library")}</span>
					<AltchaLogo viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
						<path d="M20 12a8 8 0 1 1-2.34-5.66" />
						<path d="M20 4v4h-4" />
						<circle cx="9.5" cy="11" r="1" fill="currentColor" stroke="none" />
						<circle cx="14.5" cy="11" r="1" fill="currentColor" stroke="none" />
					</AltchaLogo>
				</AltchaMain>
				<AltchaFooter>{__("Protected by ALTCHA", "wp-component-library")}</AltchaFooter>
			</AltchaWrapper>
		</CaptchaContainer>
	);
}
