# VariableField Component

An advanced input field component with autocomplete functionality for inserting variables using the @ symbol trigger. Perfect for template fields, email composers, or any input that needs variable interpolation.

## Features

- **@ Symbol Triggered Autocomplete** - Type @ to show variable suggestions
- **Smart Filtering** - Real-time filtering as you type after @
- **Keyboard Navigation** - Full keyboard support with arrow keys, Enter, and Escape
- **Mouse Support** - Click to select, hover to highlight
- **Cursor-Aware Replacement** - Replaces text at cursor position precisely
- **Flexible Input Types** - Supports both text input and textarea
- **Customizable Options** - Define your own variable structure
- **Accessibility** - Screen reader compatible with proper ARIA attributes
- **Click Outside Detection** - Automatically closes suggestions when clicking elsewhere
- **Ref Forwarding** - Exposes focus method to parent components

## Usage

```jsx
import { VariableField } from '@builtnorth/wp-component-library/components/variable-field';

// Basic usage with simple options
<VariableField
    value={content}
    onChange={setContent}
    options={[
        { label: 'User Name', value: '{user_name}' },
        { label: 'User Email', value: '{user_email}' },
        { label: 'Current Date', value: '{date}' },
        { label: 'Site Title', value: '{site_title}' }
    ]}
    placeholder="Type @ to insert variables"
/>

// With custom option structure
<VariableField
    value={template}
    onChange={setTemplate}
    options={customVariables}
    getOptionLabel={(option) => option.displayName}
    getOptionValue={(option) => option.code}
    label="Email Template"
    help="Use @ to insert merge tags"
/>

// As textarea with advanced options
<VariableField
    value={message}
    onChange={setMessage}
    options={messageVariables}
    inputType="textarea"
    label="Message Body"
    placeholder="Compose your message. Type @ for variables."
    className="message-composer"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | Current input value |
| `onChange` | `function` | Required | Value change handler |
| `options` | `array` | `[]` | Available variables for autocomplete |
| `getOptionLabel` | `function` | `(opt) => opt.label` | Extract display label from option |
| `getOptionValue` | `function` | `(opt) => opt.value` | Extract value from option |
| `placeholder` | `string` | - | Input placeholder text |
| `label` | `string` | - | Field label |
| `help` | `string` | - | Help text displayed below input |
| `isDisabled` | `boolean` | `false` | Disable the input |
| `inputType` | `string` | `"text"` | Input type: "text" or "textarea" |
| `className` | `string` | - | Additional CSS classes |

## Option Structure

Options can be simple or complex objects:

### Simple Structure
```jsx
const simpleOptions = [
    { label: 'First Name', value: '{first_name}' },
    { label: 'Last Name', value: '{last_name}' }
];
```

### Custom Structure
```jsx
const customOptions = [
    { 
        displayName: 'Customer Name',
        code: '{{customer.name}}',
        category: 'Customer Data',
        description: 'Full name of the customer'
    }
];

// With custom getters
<VariableField
    options={customOptions}
    getOptionLabel={(opt) => opt.displayName}
    getOptionValue={(opt) => opt.code}
/>
```

## Autocomplete Behavior

1. **Trigger** - Type @ anywhere in the input
2. **Filter** - Continue typing to filter suggestions
3. **Navigate** - Use ↑↓ arrow keys or mouse
4. **Select** - Press Enter or click to insert
5. **Cancel** - Press Escape or click outside

The selected variable replaces the @word at the cursor position.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `@` | Open autocomplete suggestions |
| `↑` `↓` | Navigate through suggestions |
| `Enter` | Select highlighted suggestion |
| `Escape` | Close suggestions |
| `Tab` | Close suggestions and move focus |

## Examples

### Email Template Builder
```jsx
function EmailTemplateBuilder() {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    
    const emailVariables = [
        { label: 'Recipient Name', value: '{{recipient.name}}' },
        { label: 'Recipient Email', value: '{{recipient.email}}' },
        { label: 'Sender Name', value: '{{sender.name}}' },
        { label: 'Company Name', value: '{{company.name}}' },
        { label: 'Unsubscribe Link', value: '{{unsubscribe_url}}' },
        { label: 'Current Year', value: '{{current_year}}' }
    ];
    
    return (
        <div>
            <VariableField
                label="Subject Line"
                value={subject}
                onChange={setSubject}
                options={emailVariables}
                placeholder="Email subject..."
            />
            
            <VariableField
                label="Email Body"
                value={body}
                onChange={setBody}
                options={emailVariables}
                inputType="textarea"
                placeholder="Compose your email. Type @ to add variables."
                help="Variables will be replaced with actual values when sending"
            />
        </div>
    );
}
```

### Dynamic Form Field
```jsx
function DynamicFormField() {
    const [formula, setFormula] = useState('');
    
    const fieldVariables = [
        { label: 'Field A', value: '[field_a]' },
        { label: 'Field B', value: '[field_b]' },
        { label: 'Total', value: '[total]' },
        { label: 'Tax Rate', value: '[tax_rate]' },
        { label: 'Subtotal', value: '[subtotal]' }
    ];
    
    return (
        <VariableField
            label="Calculation Formula"
            value={formula}
            onChange={setFormula}
            options={fieldVariables}
            placeholder="e.g., [field_a] + [field_b] * [tax_rate]"
            help="Create formulas using @ to reference other fields"
        />
    );
}
```

### Chat Message Composer
```jsx
function ChatComposer() {
    const messageRef = useRef();
    const [message, setMessage] = useState('');
    
    const quickResponses = [
        { label: 'Greeting', value: 'Hello! How can I help you today?' },
        { label: 'Thank You', value: 'Thank you for contacting us!' },
        { label: 'Agent Name', value: '{agent_name}' },
        { label: 'Ticket Number', value: '{ticket_id}' },
        { label: 'Customer Name', value: '{customer_name}' }
    ];
    
    const handleSend = () => {
        // Send message
        setMessage('');
        messageRef.current?.focus();
    };
    
    return (
        <div className="chat-composer">
            <VariableField
                ref={messageRef}
                value={message}
                onChange={setMessage}
                options={quickResponses}
                placeholder="Type your message... @ for quick responses"
                inputType="textarea"
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}
```

### Custom Variable Categories
```jsx
function CategorizedVariables() {
    const [content, setContent] = useState('');
    
    const variables = [
        { label: 'User: Name', value: '{user.name}', category: 'user' },
        { label: 'User: Email', value: '{user.email}', category: 'user' },
        { label: 'Order: ID', value: '{order.id}', category: 'order' },
        { label: 'Order: Total', value: '{order.total}', category: 'order' },
        { label: 'Date: Today', value: '{date.today}', category: 'date' },
        { label: 'Date: Time', value: '{date.time}', category: 'date' }
    ];
    
    return (
        <VariableField
            value={content}
            onChange={setContent}
            options={variables}
            label="Content with Variables"
            help="Variables are organized by category for easier selection"
        />
    );
}
```

## Styling

The component uses these CSS classes:

```css
.variable-field-wrapper          /* Main wrapper */
.variable-field-input            /* Input element */
.variable-field-textarea         /* Textarea element */
.variable-field-suggestions      /* Suggestions dropdown */
.variable-field-suggestion       /* Individual suggestion */
.variable-field-suggestion--highlighted /* Highlighted suggestion */
```

Example custom styling:
```css
.variable-field-suggestions {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.variable-field-suggestion--highlighted {
    background-color: #f0f0f0;
}
```

## Accessibility

- Proper ARIA attributes for autocomplete
- Keyboard navigation fully supported
- Screen reader announcements for suggestions
- Focus management for better UX
- Descriptive labels and help text support

## Notes

- Variables can contain any string format (brackets, braces, etc.)
- Suggestions appear below the input by default
- The component handles text selection and cursor position
- Works with controlled and uncontrolled components
- Performance optimized with debounced filtering
- Ref forwarding allows parent components to control focus