# Layout Components

A comprehensive set of layout control components for WordPress blocks, providing flexbox-based alignment and positioning controls for both toolbar and inspector contexts.

## Features

- Complete flexbox layout control system
- Toolbar and inspector panel variations
- Orientation switching (horizontal/vertical)
- Justification control (main axis alignment)
- Alignment control (cross axis alignment)
- Content alignment (text alignment)
- Flex wrap control
- Layout width control (full/constrained)
- Responsive and accessible UI

## Components

### Toolbar Components
For use in block toolbars:
- `AlignmentToolbar` - Cross axis alignment
- `JustificationToolbar` - Main axis alignment
- `OrientationToolbar` - Flex direction control
- `ContentAlignmentToolbar` - Text alignment

### Inspector Components
For use in inspector panels:
- `AlignmentSettings` - Cross axis alignment settings
- `JustificationSettings` - Main axis alignment settings
- `OrientationSettings` - Flex direction settings
- `ContentAlignmentSettings` - Text alignment settings
- `AllowWrapSettings` - Flex wrap toggle
- `LayoutPanel` - Complete layout panel with all controls
- `LayoutWidthControl` - Full width vs constrained toggle

## Usage

```jsx
import { 
    LayoutPanel,
    OrientationToolbar,
    JustificationToolbar,
    AlignmentToolbar 
} from '@builtnorth/wp-component-library/components/layout';

// In block toolbar
<BlockControls>
    <OrientationToolbar
        value={orientation}
        onChange={setOrientation}
    />
    <JustificationToolbar
        value={justification}
        onChange={setJustification}
        orientation={orientation}
    />
</BlockControls>

// In inspector controls
<InspectorControls>
    <LayoutPanel
        orientation={orientation}
        onOrientationChange={setOrientation}
        justification={justification}
        onJustificationChange={setJustification}
        alignment={alignment}
        onAlignmentChange={setAlignment}
        allowWrap={allowWrap}
        onAllowWrapChange={setAllowWrap}
        showOrientationControl={true}
        showJustificationControl={true}
        showAlignmentControl={true}
        showAllowWrapControl={true}
    />
</InspectorControls>
```

## Layout Panel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `string` | `"horizontal"` | Flex direction: "horizontal" or "vertical" |
| `onOrientationChange` | `function` | - | Orientation change handler |
| `justification` | `string` | `"flex-start"` | Main axis alignment |
| `onJustificationChange` | `function` | - | Justification change handler |
| `alignment` | `string` | `"flex-start"` | Cross axis alignment |
| `onAlignmentChange` | `function` | - | Alignment change handler |
| `contentAlignment` | `string` | `"left"` | Text alignment within items |
| `onContentAlignmentChange` | `function` | - | Content alignment change handler |
| `allowWrap` | `boolean` | `false` | Allow flex items to wrap |
| `onAllowWrapChange` | `function` | - | Wrap change handler |
| `showOrientationControl` | `boolean` | `true` | Show orientation control |
| `showJustificationControl` | `boolean` | `true` | Show justification control |
| `showAlignmentControl` | `boolean` | `true` | Show alignment control |
| `showContentAlignmentControl` | `boolean` | `false` | Show content alignment control |
| `showAllowWrapControl` | `boolean` | `true` | Show wrap control |
| `group` | `string` | `"styles"` | Inspector control group |
| `resetAll` | `function` | - | Reset all values handler |

## Individual Control Props

All individual controls follow a similar pattern:
```jsx
<ControlName
    value={currentValue}
    onChange={handleChange}
    orientation={orientation}  // For context-aware controls
/>
```

## Alignment Values

### Justification (Main Axis)
- `flex-start` - Start of container
- `center` - Center of container
- `flex-end` - End of container
- `space-between` - Space between items

### Alignment (Cross Axis)
- `flex-start` - Start of container
- `center` - Center of container
- `flex-end` - End of container
- `stretch` - Stretch to fill container

### Content Alignment (Text)
- `left` - Left aligned text
- `center` - Center aligned text
- `right` - Right aligned text

## CSS Generation

The components are designed to work with CSS classes or inline styles:

```jsx
// Generate CSS classes
const layoutClasses = classnames({
    [`is-orientation-${orientation}`]: orientation,
    [`is-justified-${justification}`]: justification,
    [`is-aligned-${alignment}`]: alignment,
    'is-wrap-allowed': allowWrap
});

// Or use inline styles
const layoutStyles = {
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    justifyContent: justification,
    alignItems: alignment,
    flexWrap: allowWrap ? 'wrap' : 'nowrap'
};
```

## Examples

### Basic Row Layout
```jsx
function RowBlock({ attributes, setAttributes }) {
    const { orientation = 'horizontal', justification = 'flex-start' } = attributes;
    
    return (
        <>
            <BlockControls>
                <JustificationToolbar
                    value={justification}
                    onChange={(value) => setAttributes({ justification: value })}
                    orientation={orientation}
                />
            </BlockControls>
            
            <div className={`row is-justified-${justification}`}>
                <InnerBlocks />
            </div>
        </>
    );
}
```

### Advanced Grid Layout
```jsx
function GridBlock({ attributes, setAttributes }) {
    return (
        <InspectorControls>
            <LayoutPanel
                {...attributes}
                onOrientationChange={(orientation) => setAttributes({ orientation })}
                onJustificationChange={(justification) => setAttributes({ justification })}
                onAlignmentChange={(alignment) => setAttributes({ alignment })}
                onAllowWrapChange={(allowWrap) => setAttributes({ allowWrap })}
                showContentAlignmentControl={true}
                onContentAlignmentChange={(contentAlignment) => setAttributes({ contentAlignment })}
            />
        </InspectorControls>
    );
}
```

### Responsive Column Layout
```jsx
function ColumnLayout({ attributes, setAttributes }) {
    const { orientation, alignment, allowWrap } = attributes;
    
    return (
        <>
            <InspectorControls>
                <PanelBody title="Layout">
                    <OrientationSettings
                        value={orientation}
                        onChange={(value) => setAttributes({ orientation: value })}
                    />
                    <AlignmentSettings
                        value={alignment}
                        onChange={(value) => setAttributes({ alignment: value })}
                        orientation={orientation}
                    />
                    <AllowWrapSettings
                        value={allowWrap}
                        onChange={(value) => setAttributes({ allowWrap: value })}
                    />
                </PanelBody>
            </InspectorControls>
            
            <div 
                style={{
                    display: 'flex',
                    flexDirection: orientation === 'vertical' ? 'column' : 'row',
                    alignItems: alignment,
                    flexWrap: allowWrap ? 'wrap' : 'nowrap'
                }}
            >
                <InnerBlocks />
            </div>
        </>
    );
}
```

## Layout Width Control

Control whether content uses full width or is constrained:

```jsx
<LayoutWidthControl
    layout={layout}
    onChange={(newLayout) => setAttributes({ layout: newLayout })}
/>

// Layout object structure:
{
    type: 'constrained' | 'default',
    contentSize: '840px',  // For constrained layout
    wideSize: '1200px'     // For wide alignment
}
```

## Accessibility

- All controls include proper ARIA labels
- Keyboard navigation fully supported
- Visual feedback for current selections
- Screen reader friendly descriptions

## Notes

- Orientation affects available justification/alignment options
- Icons rotate appropriately for vertical orientation
- Controls integrate with WordPress ToolsPanel for consistent UX
- Styled with Emotion for customizable theming
- All controls are fully controlled components