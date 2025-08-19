# AI Content Generation Framework

A lightweight, extensible framework for AI-powered content generation in WordPress plugins.

## Philosophy

This is a **framework, not a library**. It provides the infrastructure for AI content generation while plugins register and own their specific content types and behaviors.

## Quick Start

### 1. Register Your Content Type

```javascript
import { AIContentFramework } from '@builtnorth/wp-component-library';

// Register a content type for your plugin
AIContentFramework.registerType('my-plugin/summary', {
    label: __('Summary', 'my-plugin'),
    description: __('Generate a concise summary', 'my-plugin'),
    
    // Required: Build the AI prompt
    buildPrompt: (extractedContent, options) => {
        return `Summarize this content in 2-3 sentences: ${extractedContent.text}`;
    },
    
    // Optional: Extract relevant content from context
    extractContent: (context) => ({
        text: context.postContent?.substring(0, 1000)
    }),
    
    // Optional: Validate the AI output
    validateOutput: (text) => {
        if (text.split('.').length > 4) {
            return { valid: false, error: 'Summary too long' };
        }
        return { valid: true };
    },
    
    // Optional: Post-process the output
    postProcess: (text) => {
        return text.trim().replace(/\s+/g, ' ');
    },
    
    // UI Configuration
    supportedModes: ['button', 'prompt'],
    defaultMode: 'button',
    buttonLabel: __('Generate Summary', 'my-plugin'),
    
    // Generation settings
    temperature: 0.5,
    maxTokens: 100
});
```

### 2. Use the Generator Component

```javascript
import { AIGenerator } from '@builtnorth/wp-component-library';

function MyComponent({ summary, setSummary }) {
    return (
        <AIGenerator
            type="my-plugin/summary"
            value={summary}
            onChange={setSummary}
            context={{
                postContent: getPostContent(),
                postTitle: getPostTitle()
            }}
        />
    );
}
```

## API Reference

### AIContentFramework

#### `registerType(type, config)`

Register a new AI content type.

- `type` (string): Unique identifier (convention: `plugin-name/type-name`)
- `config` (object):
  - `buildPrompt` (function, required): Function that builds the AI prompt
  - `extractContent` (function): Extract content from context
  - `validateOutput` (function): Validate AI output
  - `postProcess` (function): Clean up AI output
  - `supportedModes` (array): UI modes (`['button', 'prompt', 'modal', 'inline']`)
  - `defaultMode` (string): Default UI mode
  - `temperature` (number): AI temperature (0-1)
  - `maxTokens` (number): Maximum tokens to generate

#### `getType(type)`

Get a registered type configuration.

#### `getAllTypes()`

Get all registered types.

#### `unregisterType(type)`

Remove a registered type.

### AIGenerator Component

#### Props

- `type` (string, required): The content type ID
- `value` (any): Current value
- `onChange` (function, required): Value change handler
- `mode` (string): UI mode (`'auto'`, `'button'`, `'prompt'`, or custom)
- `context` (object): Context data for content extraction
- `onError` (function): Error handler
- `className` (string): Additional CSS classes

#### Button Customization Props

- `buttonText` (string): Override button text
- `icon` (string|Object): Button icon (WordPress icon name or icon component)
- `size` (string): Button size (`'small'`, `'compact'`, `'default'`)
- `variant` (string): Button variant (`'primary'`, `'secondary'`, `'tertiary'`, `'link'`)
- `isDestructive` (boolean): Makes button destructive variant
- `buttonProps` (object): Additional props passed to Button component

Priority order for button properties:
1. Props passed directly to AIGenerator
2. Props from buttonProps object
3. Type configuration defaults
4. Framework defaults

## Hooks

### Filters

#### `ai_generator_mode`
Customize the UI mode for specific types or contexts.

```javascript
wp.hooks.addFilter('ai_generator_mode', 'my-plugin', (mode, { type, context }) => {
    if (type === 'my-plugin/product' && context.isQuickEdit) {
        return 'inline';
    }
    return mode;
});
```

#### `ai_generator_prompt`
Modify prompts before sending to AI.

```javascript
wp.hooks.addFilter('ai_generator_prompt', 'my-plugin', (prompt, { type, context }) => {
    if (context.brandVoice) {
        prompt += `\nBrand voice: ${context.brandVoice}`;
    }
    return prompt;
});
```

#### `ai_generator_output`
Process AI output before it's used.

```javascript
wp.hooks.addFilter('ai_generator_output', 'my-plugin', (output, { type, context }) => {
    // Ensure brand name is included
    return output.replace(/our product/gi, 'BrandName');
});
```

#### `ai_generator_render`
Provide custom UI for specific modes or types.

```javascript
wp.hooks.addFilter('ai_generator_render', 'my-plugin', (render, props) => {
    if (props.mode === 'modal' && props.type.startsWith('my-plugin/')) {
        return <MyCustomModal {...props} />;
    }
    return render;
});
```

### Actions

#### `ai_generator_success`
Fired after successful generation.

```javascript
wp.hooks.addAction('ai_generator_success', 'analytics', ({ type, value }) => {
    trackEvent('ai_generation', { type, length: value.length });
});
```

#### `ai_generator_error`
Fired when generation fails.

```javascript
wp.hooks.addAction('ai_generator_error', 'error-handler', ({ type, error }) => {
    console.error(`AI generation failed for ${type}:`, error);
});
```

## Utilities

The framework includes helper functions for content extraction:

```javascript
import { 
    extractHeadings,
    extractListItems,
    extractFirstParagraph,
    extractStructuredContent,
    cleanAIOutput,
    truncateToSentence
} from '@builtnorth/wp-component-library/ai-framework/utilities';
```

## Best Practices

1. **Use namespaced type IDs**: `plugin-name/type-name`
2. **Keep prompts focused**: Specific prompts yield better results
3. **Validate output**: Always validate length and format
4. **Handle errors gracefully**: Provide fallbacks for AI failures
5. **Test variations**: Different prompts for variety
6. **Monitor usage**: Track success rates and user satisfaction

## Examples

### SEO Meta Description

```javascript
AIContentFramework.registerType('seo/meta-description', {
    label: __('Meta Description'),
    
    extractContent: (context) => ({
        headings: extractHeadings(context.postContent),
        title: context.postTitle
    }),
    
    buildPrompt: (content) => {
        return `Write a meta description under 160 characters for: "${content.title}"
                Key topics: ${content.headings.join(', ')}
                STRICT: Maximum 160 characters.`;
    },
    
    validateOutput: (text) => {
        if (text.length > 160) {
            return { valid: false, error: 'Too long' };
        }
        return { valid: true };
    },
    
    temperature: 0.5,
    maxTokens: 60
});
```

### Product Description

```javascript
AIContentFramework.registerType('shop/product-description', {
    label: __('Product Description'),
    
    buildPrompt: (content) => {
        return `Write a compelling product description for: ${content.productName}
                Features: ${content.features.join(', ')}
                Target audience: ${content.audience}`;
    },
    
    supportedModes: ['button', 'modal'],
    defaultMode: 'modal',
    temperature: 0.8,
    maxTokens: 200
});
```

## Requirements

- WordPress 6.0+
- `@wordpress/hooks`
- `@wordpress/api-fetch`
- `@wordpress/components`
- `@wordpress/element`
- `@wordpress/i18n`

## License

Part of the Polaris WordPress Framework.