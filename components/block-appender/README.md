# Block Appender Components

A collection of customizable block appender components for different contexts in the WordPress block editor. These components provide consistent UI for adding new blocks while adapting to their specific use cases.

## Components

### CustomBlockAppender
Standard block appender with tooltip for general use.

### CustomInspectorAppender
Block appender styled for inspector panels with secondary button styling.

### CustomColumnAppender
Column-specific appender with wrapper div for layout containers.

### CustomInlineAppender
Context-aware appender that only displays when its parent block is selected.

## Usage

```jsx
import { 
    CustomBlockAppender, 
    CustomInspectorAppender,
    CustomColumnAppender,
    CustomInlineAppender 
} from '@builtnorth/wp-component-library/components/block-appender';

// Standard block appender
<CustomBlockAppender
    rootClientId={clientId}
    appenderTitle="Add Content Block"
    appenderLabel="Click to add a new content block"
    appenderClassModifier="content"
/>

// Inspector panel appender
<CustomInspectorAppender
    rootClientId={clientId}
    appenderTitle="Add Setting Block"
    appenderLabel="Add a configuration block"
/>

// Column layout appender
<CustomColumnAppender
    rootClientId={columnId}
    appenderTitle="Add Column Content"
/>

// Inline context-aware appender
<CustomInlineAppender
    clientId={parentBlockId}
    rootClientId={parentBlockId}
    label="Add Paragraph"
    blockName="core/paragraph"
/>
```

## Common Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rootClientId` | `string` | Required | Parent block ID for insertion context |
| `appenderTitle` | `string` | - | Display text for the appender button |
| `appenderLabel` | `string` | - | Accessibility label for screen readers |
| `appenderClassModifier` | `string` | - | CSS class modifier for custom styling |

## CustomInlineAppender Specific Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `clientId` | `string` | Required | Block ID to monitor for selection state |
| `label` | `string` | `"Add Block"` | Button label text |
| `blockName` | `string` | `"core/paragraph"` | Default block type to insert |

## Features

### Quick Insert Mode
All appenders use WordPress's quick insert mode for faster block addition.

### Context-Aware Visibility
CustomInlineAppender automatically shows/hides based on parent block selection state.

### Consistent Styling
Each appender type has appropriate styling for its context:
- Standard: Primary button with tooltip
- Inspector: Secondary button for panel integration
- Column: Wrapped for layout containers
- Inline: Minimal styling for inline contexts

### Accessibility
- Proper ARIA labels for screen readers
- Keyboard navigation support
- Tooltip hints for standard appender

## CSS Classes

Generated classes follow the pattern:
- Base: `custom-appender`
- With modifier: `custom-appender custom-appender--{modifier}`
- Inspector: `custom-inspector-appender`
- Column: `custom-column-appender`
- Inline: `wp-block-appender` (uses core styling)

## Examples

### Adding to a Custom Container Block
```jsx
function ContainerEdit({ clientId }) {
    return (
        <div className="container-content">
            <InnerBlocks />
            <CustomBlockAppender
                rootClientId={clientId}
                appenderTitle="Add Container Item"
                appenderClassModifier="container"
            />
        </div>
    );
}
```

### Inspector Panel Integration
```jsx
<InspectorControls>
    <PanelBody title="Content Blocks">
        <p>Add configuration blocks below:</p>
        <CustomInspectorAppender
            rootClientId={clientId}
            appenderTitle="Add Config"
        />
    </PanelBody>
</InspectorControls>
```

### Inline Editing Experience
```jsx
function InlineEditor({ clientId, isSelected }) {
    return (
        <div className="inline-content">
            <InnerBlocks />
            <CustomInlineAppender
                clientId={clientId}
                rootClientId={clientId}
                label="Add Text"
                blockName="core/paragraph"
            />
        </div>
    );
}
```

## Notes

- All appenders integrate with WordPress's Inserter component
- The quick inserter mode provides faster access to commonly used blocks
- CustomInlineAppender uses block editor selection state for smart visibility
- Appenders respect block insertion rules and allowed blocks