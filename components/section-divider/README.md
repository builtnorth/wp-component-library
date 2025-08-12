# Section Divider Component

A settings component that provides section divider controls for WordPress blocks, allowing users to add decorative dividers to the top or bottom of sections.

## Features

- Top and bottom divider options
- Theme configuration integration
- WordPress ToolsPanel integration
- Conditional rendering based on theme settings
- Reset functionality

## Usage

```jsx
import { SectionDividerSettings } from '@builtnorth/wp-component-library/components/section-divider';

// Basic usage
<InspectorControls>
    <SectionDividerSettings
        divider={divider}
        onDividerChange={setDivider}
        resetAll={() => setAttributes({ divider: 'none' })}
    />
</InspectorControls>

// With custom panel title
<SectionDividerSettings
    divider={divider}
    onDividerChange={(value) => setAttributes({ divider: value })}
    resetAll={resetDividerSettings}
    panelTitle="Divider Options"
    group="styles"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `divider` | `string` | - | Current divider setting ("none", "top", "bottom") |
| `onDividerChange` | `function` | Required | Handler for divider changes |
| `resetAll` | `function` | - | Reset handler for ToolsPanel |
| `panelTitle` | `string` | `"Section Divider"` | Panel title text |
| `group` | `string` | `"styles"` | Inspector controls group |
| `className` | `string` | - | Additional CSS classes for panel |

## Divider Options

- **none** - No divider displayed
- **top** - Divider at the top of the section
- **bottom** - Divider at the bottom of the section

## Theme Configuration

The component integrates with Polaris theme configuration. It checks `window.polaris_localize.global.section_divider` to determine if dividers are enabled.

If dividers are disabled in the theme, the component returns `null` and won't render.

## Examples

### Basic Section Block
```jsx
function SectionBlock({ attributes, setAttributes }) {
    const { divider = 'none' } = attributes;
    
    return (
        <>
            <InspectorControls group="styles">
                <SectionDividerSettings
                    divider={divider}
                    onDividerChange={(value) => setAttributes({ divider: value })}
                    resetAll={() => setAttributes({ divider: 'none' })}
                />
            </InspectorControls>
            
            <div className={`section has-divider-${divider}`}>
                {divider === 'top' && <div className="section-divider section-divider--top" />}
                
                <InnerBlocks />
                
                {divider === 'bottom' && <div className="section-divider section-divider--bottom" />}
            </div>
        </>
    );
}
```

### Advanced Section with Multiple Style Options
```jsx
function AdvancedSection({ attributes, setAttributes }) {
    const { divider, dividerColor, dividerStyle } = attributes;
    
    const resetDividerSettings = () => {
        setAttributes({
            divider: 'none',
            dividerColor: undefined,
            dividerStyle: undefined
        });
    };
    
    return (
        <InspectorControls>
            <SectionDividerSettings
                divider={divider}
                onDividerChange={(value) => setAttributes({ divider: value })}
                resetAll={resetDividerSettings}
                panelTitle="Section Dividers"
            />
            
            {divider !== 'none' && (
                <PanelBody title="Divider Style">
                    <SelectControl
                        label="Style"
                        value={dividerStyle}
                        options={[
                            { label: 'Wave', value: 'wave' },
                            { label: 'Angle', value: 'angle' },
                            { label: 'Curve', value: 'curve' }
                        ]}
                        onChange={(value) => setAttributes({ dividerStyle: value })}
                    />
                    <ColorPalette
                        value={dividerColor}
                        onChange={(value) => setAttributes({ dividerColor: value })}
                    />
                </PanelBody>
            )}
        </InspectorControls>
    );
}
```

### Conditional Divider Based on Position
```jsx
function ConditionalSection({ attributes, setAttributes, isFirst, isLast }) {
    const { divider } = attributes;
    
    // Only allow top divider if not first section
    // Only allow bottom divider if not last section
    const allowedOptions = [
        { label: 'None', value: 'none' },
        ...(!isFirst ? [{ label: 'Top', value: 'top' }] : []),
        ...(!isLast ? [{ label: 'Bottom', value: 'bottom' }] : [])
    ];
    
    return (
        <InspectorControls>
            <PanelBody title="Divider">
                <SelectControl
                    label="Position"
                    value={divider}
                    options={allowedOptions}
                    onChange={(value) => setAttributes({ divider: value })}
                />
            </PanelBody>
        </InspectorControls>
    );
}
```

## CSS Implementation

Example CSS for rendering dividers:

```css
.section {
    position: relative;
}

.section-divider {
    position: absolute;
    width: 100%;
    height: 60px;
    z-index: 1;
}

.section-divider--top {
    top: 0;
    transform: translateY(-50%);
}

.section-divider--bottom {
    bottom: 0;
    transform: translateY(50%);
}

/* Example SVG divider */
.section-divider::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background-image: url('divider.svg');
    background-size: cover;
    background-position: center;
}
```

## Integration with ToolsPanel

The component uses WordPress's `__experimentalToolsPanel` for consistent UI:

```jsx
<__experimentalToolsPanel
    label={panelTitle}
    resetAll={resetAll}
    className={className}
>
    <__experimentalToolsPanelItem
        label="Divider"
        hasValue={() => divider !== 'none'}
        onDeselect={() => onDividerChange('none')}
    >
        <SelectControl
            label="Divider Position"
            value={divider}
            options={dividerOptions}
            onChange={onDividerChange}
        />
    </__experimentalToolsPanelItem>
</__experimentalToolsPanel>
```

## Notes

- Component requires Polaris theme configuration
- Returns `null` if dividers are disabled in theme
- Integrates with WordPress experimental ToolsPanel
- Designed for section/container blocks
- CSS implementation required for visual display
- Consider performance impact of complex SVG dividers