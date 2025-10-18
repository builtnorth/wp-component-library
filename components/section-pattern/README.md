# Section Pattern Components

Components for adding and managing decorative background patterns in WordPress blocks, with dynamic SVG loading and flexible positioning controls.

## Components

### SectionPattern
Renders SVG background patterns with configurable alignment.

### SectionPatternSettings
Inspector panel controls for pattern selection and configuration.

## Features

- Dynamic SVG pattern loading from theme
- Child theme support with parent theme fallback
- 9-point alignment grid for precise positioning
- Theme configuration integration
- Accessibility-friendly (decorative patterns marked appropriately)
- Error handling for missing patterns

## Usage

```jsx
import { 
    SectionPattern, 
    SectionPatternSettings 
} from '@builtnorth/wp-component-library/components/section-pattern';

// Render pattern
<div className="section">
    <SectionPattern
        pattern="waves"
        patternAlign="center center"
        className="section__pattern"
    />
    <div className="section__content">
        {/* Section content */}
    </div>
</div>

// Pattern settings in inspector
<InspectorControls>
    <SectionPatternSettings
        pattern={pattern}
        onPatternChange={setPattern}
        patternAlign={patternAlign}
        onPatternAlignChange={setPatternAlign}
        resetAll={() => setAttributes({ 
            pattern: 'none', 
            patternAlign: 'center center' 
        })}
    />
</InspectorControls>
```

## Props

### SectionPattern Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pattern` | `string` | - | Pattern name/ID to display |
| `patternAlign` | `string` | `"center center"` | Pattern alignment position |
| `className` | `string` | - | Additional CSS classes |

### SectionPatternSettings Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pattern` | `string` | - | Current pattern selection |
| `onPatternChange` | `function` | Required | Pattern change handler |
| `patternAlign` | `string` | - | Current alignment setting |
| `onPatternAlignChange` | `function` | Required | Alignment change handler |
| `resetAll` | `function` | - | Reset all settings handler |
| `panelTitle` | `string` | `"Section Pattern"` | Panel title text |
| `group` | `string` | `"styles"` | Inspector controls group |
| `className` | `string` | - | Panel CSS classes |

## Pattern Alignment Options

The alignment control provides a 9-point grid:

```
top left       top center       top right
center left    center center    center right
bottom left    bottom center    bottom right
```

Each position corresponds to CSS background-position values.

## Theme Configuration

Patterns are loaded from the theme configuration:
- Pattern list from `window.polaris_localize.global.section_patterns`
- SVG files loaded from theme's `assets/images/patterns/` directory
- Automatic fallback to parent theme if pattern not found in child theme

## Examples

### Hero Section with Pattern
```jsx
function HeroSection({ attributes, setAttributes }) {
    const { pattern, patternAlign, patternOpacity } = attributes;
    
    return (
        <>
            <InspectorControls>
                <SectionPatternSettings
                    pattern={pattern}
                    onPatternChange={(value) => setAttributes({ pattern: value })}
                    patternAlign={patternAlign}
                    onPatternAlignChange={(value) => setAttributes({ patternAlign: value })}
                    resetAll={() => setAttributes({ 
                        pattern: 'none',
                        patternAlign: 'center center'
                    })}
                />
                
                {pattern && pattern !== 'none' && (
                    <PanelBody title="Pattern Style">
                        <RangeControl
                            label="Opacity"
                            value={patternOpacity}
                            onChange={(value) => setAttributes({ patternOpacity: value })}
                            min={0}
                            max={100}
                        />
                    </PanelBody>
                )}
            </InspectorControls>
            
            <div className="hero-section">
                {pattern && pattern !== 'none' && (
                    <div style={{ opacity: patternOpacity / 100 }}>
                        <SectionPattern
                            pattern={pattern}
                            patternAlign={patternAlign}
                            className="hero-section__pattern"
                        />
                    </div>
                )}
                <div className="hero-section__content">
                    <InnerBlocks />
                </div>
            </div>
        </>
    );
}
```

### Card with Pattern Background
```jsx
function PatternCard({ attributes, setAttributes }) {
    const { pattern, patternAlign, backgroundColor } = attributes;
    
    return (
        <div 
            className="pattern-card"
            style={{ backgroundColor }}
        >
            <SectionPattern
                pattern={pattern}
                patternAlign={patternAlign}
                className="pattern-card__bg"
            />
            <div className="pattern-card__content">
                {/* Card content */}
            </div>
        </div>
    );
}
```

### Dynamic Pattern Loading
```jsx
function DynamicPatternSection() {
    const [availablePatterns, setAvailablePatterns] = useState([]);
    
    useEffect(() => {
        // Get available patterns from theme
        const patterns = window.polaris_localize?.global?.section_patterns || {};
        setAvailablePatterns(Object.entries(patterns).map(([value, label]) => ({
            value,
            label
        })));
    }, []);
    
    return (
        <SelectControl
            label="Choose Pattern"
            options={availablePatterns}
            onChange={handlePatternChange}
        />
    );
}
```

## CSS Styling

Recommended CSS for pattern implementation:

```css
.section {
    position: relative;
}

.section__pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
}

.section__pattern svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.section__content {
    position: relative;
    z-index: 1;
}

/* Pattern alignment variations */
.section__pattern[data-align="top left"] svg {
    object-position: top left;
}

.section__pattern[data-align="center center"] svg {
    object-position: center center;
}

/* Add more alignment styles as needed */
```

## Pattern File Structure

Expected theme directory structure:
```
theme/
├── assets/
│   └── images/
│       └── patterns/
│           ├── waves.svg
│           ├── dots.svg
│           ├── lines.svg
│           └── ...
└── ...

parent-theme/  (fallback)
├── assets/
│   └── images/
│       └── patterns/
│           └── ...
```

## SVG Pattern Best Practices

1. **Optimize SVGs** - Minimize file size with SVGO or similar
2. **Use viewBox** - Ensure patterns scale properly
3. **Seamless Tiling** - Design patterns to tile seamlessly if needed
4. **Color Flexibility** - Use currentColor for dynamic coloring
5. **Performance** - Keep patterns simple for better performance

## Error Handling

The component includes built-in error handling:
- Returns null if pattern file not found
- Tries child theme first, then parent theme
- Console warning for missing patterns (development only)
- Graceful degradation if theme config missing

## Notes

- Patterns are loaded asynchronously and cached
- SVGs are sanitized for security (using DOMPurify)
- Patterns marked with `aria-hidden="true"` for accessibility
- Component requires Polaris theme configuration
- Consider performance impact with complex patterns
- Patterns should be decorative only, not contain content