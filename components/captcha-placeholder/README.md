# CaptchaPlaceholder Component

A unified captcha component that provides a consistent interface for rendering different captcha providers. Supports Google reCAPTCHA (v2 & v3), hCaptcha, and Cloudflare Turnstile with customizable themes and sizes.

## Features

- Multiple captcha provider support
- Unified API across all providers
- Theme customization (light, dark, auto)
- Size variants (normal, compact)
- Provider-specific configuration options
- Clean abstraction with modular architecture

## Supported Providers

- **Google reCAPTCHA v2** - Traditional checkbox captcha
- **Google reCAPTCHA v3** - Invisible behavioral analysis
- **hCaptcha** - Privacy-focused reCAPTCHA alternative
- **Cloudflare Turnstile** - Modern captcha solution from Cloudflare

## Usage

```jsx
import { CaptchaPlaceholder } from '@builtnorth/wp-component-library/components/captcha-placeholder';

// Google reCAPTCHA v2
<CaptchaPlaceholder
    provider="google-recaptcha"
    version="v2"
    theme="light"
    size="normal"
/>

// Google reCAPTCHA v3 (invisible)
<CaptchaPlaceholder
    provider="google-recaptcha"
    version="v3"
/>

// hCaptcha
<CaptchaPlaceholder
    provider="hcaptcha"
    theme="dark"
    size="compact"
/>

// Cloudflare Turnstile
<CaptchaPlaceholder
    provider="cloudflare-turnstile"
    theme="auto"
    mode="managed"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | `string` | Required | Captcha provider: "google-recaptcha", "hcaptcha", or "cloudflare-turnstile" |
| `theme` | `string` | `"light"` | Visual theme: "light", "dark", or "auto" |
| `size` | `string` | `"normal"` | Captcha size: "normal" or "compact" |
| `version` | `string` | `"v2"` | Google reCAPTCHA version: "v2" or "v3" (Google only) |
| `mode` | `string` | `"managed"` | Cloudflare Turnstile mode: "managed", "non-interactive", or "invisible" |

## Provider-Specific Configuration

### Google reCAPTCHA

#### Version 2 (Checkbox)
```jsx
<CaptchaPlaceholder
    provider="google-recaptcha"
    version="v2"
    theme="light"  // or "dark"
    size="normal"   // or "compact"
/>
```

#### Version 3 (Invisible)
```jsx
<CaptchaPlaceholder
    provider="google-recaptcha"
    version="v3"
    // v3 is invisible, theme and size are ignored
/>
```

### hCaptcha
```jsx
<CaptchaPlaceholder
    provider="hcaptcha"
    theme="dark"    // "light", "dark", or "auto"
    size="compact"  // "normal" or "compact"
/>
```

### Cloudflare Turnstile
```jsx
<CaptchaPlaceholder
    provider="cloudflare-turnstile"
    theme="auto"    // "light", "dark", or "auto"
    mode="managed"  // "managed", "non-interactive", or "invisible"
/>
```

## Theme Options

- **light** - Light background, dark text
- **dark** - Dark background, light text  
- **auto** - Automatically matches user's system preference (Turnstile & hCaptcha only)

## Size Options

- **normal** - Standard size captcha
- **compact** - Smaller footprint for space-constrained layouts

## Cloudflare Turnstile Modes

- **managed** - Cloudflare decides when to show challenges
- **non-interactive** - Never shows interactive challenges
- **invisible** - Completely hidden from view

## Examples

### Form with reCAPTCHA v2
```jsx
function ContactForm() {
    return (
        <form>
            <input type="email" placeholder="Email" />
            <textarea placeholder="Message" />
            
            <CaptchaPlaceholder
                provider="google-recaptcha"
                version="v2"
                theme="light"
            />
            
            <button type="submit">Send</button>
        </form>
    );
}
```

### Dark Mode Support
```jsx
function DarkModeForm({ isDarkMode }) {
    return (
        <form>
            <CaptchaPlaceholder
                provider="hcaptcha"
                theme={isDarkMode ? "dark" : "light"}
                size="normal"
            />
        </form>
    );
}
```

### Invisible Protection
```jsx
function SecureAction() {
    return (
        <div>
            <button onClick={handleAction}>
                Perform Secure Action
            </button>
            
            <CaptchaPlaceholder
                provider="cloudflare-turnstile"
                mode="invisible"
            />
        </div>
    );
}
```

### Compact Layout
```jsx
function SidebarForm() {
    return (
        <aside className="sidebar">
            <form>
                <input type="text" />
                
                <CaptchaPlaceholder
                    provider="hcaptcha"
                    size="compact"
                    theme="auto"
                />
                
                <button>Submit</button>
            </form>
        </aside>
    );
}
```

## Integration Notes

### Site Keys Required
Each provider requires site keys to be configured:
- Google reCAPTCHA: Obtain from [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
- hCaptcha: Get from [hCaptcha Dashboard](https://dashboard.hcaptcha.com)
- Cloudflare Turnstile: Available in [Cloudflare Dashboard](https://dash.cloudflare.com)

### Server-Side Validation
Remember to validate captcha responses on your server:
1. Capture the captcha response token
2. Send to your server with form data
3. Verify with the provider's API
4. Process form only if verification succeeds

### Styling
The component renders provider-specific markup. Additional styling can be applied via wrapper elements:
```jsx
<div className="captcha-wrapper">
    <CaptchaPlaceholder {...props} />
</div>
```

## Notes

- Returns `null` for unsupported providers
- Each provider component is loaded separately for optimal bundle size
- Theme and size support varies by provider
- Ensure you comply with each provider's terms of service
- Consider privacy implications when choosing a provider