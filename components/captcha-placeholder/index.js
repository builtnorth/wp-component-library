/**
 * Internal dependencies
 */
import { GoogleRecaptchaV2, GoogleRecaptchaV3 } from './GoogleRecaptcha';
import { HCaptcha } from './HCaptcha';
import { CloudflareTurnstile } from './CloudflareTurnstile';

/**
 * Captcha placeholder component
 *
 * @param {Object} props Component props
 * @param {string} props.provider - The captcha provider (google-recaptcha, hcaptcha, cloudflare-turnstile)
 * @param {string} props.theme - Theme for the captcha (light, dark, auto)
 * @param {string} props.size - Size for the captcha (normal, compact)
 * @param {string} props.version - Version for Google reCAPTCHA (v2, v3)
 * @param {string} props.mode - Mode for Cloudflare Turnstile (managed, non-interactive, invisible)
 * @returns {WPElement} Captcha placeholder element
 */
export function CaptchaPlaceholder({ provider, theme = 'light', size = 'normal', version = 'v2', mode = 'managed' }) {
	if (provider === 'google-recaptcha' && version === 'v2') {
		return <GoogleRecaptchaV2 theme={theme} size={size} />;
	}

	if (provider === 'google-recaptcha' && version === 'v3') {
		return <GoogleRecaptchaV3 />;
	}

	if (provider === 'hcaptcha') {
		return <HCaptcha theme={theme} size={size} />;
	}

	if (provider === 'cloudflare-turnstile') {
		return <CloudflareTurnstile theme={theme} mode={mode} />;
	}

	return null;
}

export default CaptchaPlaceholder;