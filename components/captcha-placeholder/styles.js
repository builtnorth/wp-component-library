/**
 * External dependencies
 */
import styled from "@emotion/styled";

export const CaptchaContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	margin-bottom: 16px;
`;

export const CheckboxBorder = styled.div`
	width: 24px;
	height: 24px;
	border: 2px solid #c1c1c1;
	border-radius: 2px;
	margin-right: 12px;
	background: white;
	position: relative;
`;

export const InvisibleNotice = styled.div`
	padding: 12px 16px;
	background: #f0f9ff;
	border: 1px solid #bae6fd;
	border-radius: 4px;
	color: #0369a1;
	font-size: 13px;
	text-align: center;
`;

export const RECAPTCHA_LOGO_BASE64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bS0yIDE1bC01LTUgMS40MS0xLjQxTDEwIDE0LjE3bDcuNTktNy41OUwxOSA4bC05IDl6IiBmaWxsPSIjNDI4NUY0Ii8+Cjwvc3ZnPg==";