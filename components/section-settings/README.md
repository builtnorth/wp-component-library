# Section Settings Components

Modular components for handling background media settings in WordPress blocks. These components have been refactored to be used independently or together as needed.

## 📁 File Structure

```
/section-settings/
├── README.md
├── index.js                # Main exports
├── SectionSettings.js      # Complete settings panel
├── SectionBackground.js    # Background renderer
└── controls/               # Individual control components
    ├── index.js           # Control exports
    ├── ImageSourceControl.js
    ├── MediaSelectControl.js
    ├── FocalPointControl.js
    ├── OpacityControl.js
    └── StyleControl.js
```

## 🎯 Key Benefits

- **✅ Independent Usage**: Use `SectionBackground` in group blocks, cover blocks, etc.
- **✅ Modular Controls**: Mix and match individual setting controls
- **✅ Better Testing**: Isolated, focused components
- **✅ Smaller Bundles**: Import only what you need
- **✅ Custom Compositions**: Build your own setting panels

## 📦 Available Components

### Main Components

#### `SectionBackground`

Standalone component that renders a background image with styling options.

```jsx
import { SectionBackground } from "@builtnorth/wp-component-library";

<SectionBackground
    backgroundImage={123}
    focalPoint={{ x: 0.3, y: 0.7 }}
    opacity={80}
    imageStyle="blur"
    useFeaturedImage={false}
    className="my-custom-class"
    imageSize="wide_large"
/>;
```

#### `SectionSettings`

Complete settings panel with all background controls.

```jsx
import { SectionSettings } from "@builtnorth/wp-component-library";

<SectionSettings
    backgroundImage={backgroundImage}
    focalPoint={focalPoint}
    opacity={opacity}
    imageStyle={imageStyle}
    useFeaturedImage={useFeaturedImage}
    onImageSelect={(image) => setAttributes({ backgroundImage: image.id })}
    onImageRemove={() => setAttributes({ backgroundImage: null })}
    onFocalPointChange={(point) => setAttributes({ focalPoint: point })}
    onOpacityChange={(value) => setAttributes({ opacity: value })}
    onImageStyleChange={(style) => setAttributes({ imageStyle: style })}
    onFeaturedImageToggle={(value) =>
        setAttributes({ useFeaturedImage: value })
    }
    enableFeaturedImage={true}
    enableMediaStyle={true}
    enableMediaOpacity={true}
    panelTitle="Background Settings"
    group="styles"
/>;
```

### Individual Control Components

**Import from the main package:**

```jsx
import {
    ImageSourceControl,
    MediaSelectControl,
    FocalPointControl,
    OpacityControl,
    StyleControl,
} from "@builtnorth/wp-component-library";
```

**Or import from controls directly:**

```jsx
import {
    ImageSourceControl,
    MediaSelectControl,
    FocalPointControl,
    OpacityControl,
    StyleControl,
} from "@builtnorth/wp-component-library/section-settings/controls";
```

#### `ImageSourceControl`

Toggle between "Select Image" and "Featured Image".

```jsx
<ImageSourceControl
    useFeaturedImage={useFeaturedImage}
    onToggle={(value) => setAttributes({ useFeaturedImage: value })}
    isShownByDefault={true}
/>
```

#### `MediaSelectControl`

Upload/replace media button.

```jsx
<MediaSelectControl
    backgroundImage={backgroundImage}
    onSelect={(image) => setAttributes({ backgroundImage: image.id })}
    onRemove={() => setAttributes({ backgroundImage: null })}
    isShownByDefault={true}
/>
```

#### `FocalPointControl`

Visual focal point picker.

```jsx
<FocalPointControl
    focalPoint={focalPoint}
    onChange={(point) => setAttributes({ focalPoint: point })}
    imageUrl={imageUrl}
    isShownByDefault={false}
/>
```

#### `OpacityControl`

Opacity range slider.

```jsx
<OpacityControl
    opacity={opacity}
    onChange={(value) => setAttributes({ opacity: value })}
    isShownByDefault={false}
/>
```

#### `StyleControl`

Image style dropdown (blur, grayscale, etc.).

```jsx
<StyleControl
    imageStyle={imageStyle}
    onChange={(style) => setAttributes({ imageStyle: style })}
    isShownByDefault={false}
/>
```

## 🔄 Migration from SectionWrapper

**Before (deprecated):**

```jsx
import { SectionWrapper } from "@builtnorth/wp-component-library";

<SectionWrapper
    attributes={attributes}
    setAttributes={setAttributes}
    className={className}
    blockName="my-block"
    featuredImage={true}
    mediaStyle={true}
    mediaOpacity={true}
>
    {children}
</SectionWrapper>;
```

**After (recommended):**

```jsx
import {
    SectionSettings,
    SectionBackground,
} from "@builtnorth/wp-component-library";
import { useBlockProps } from "@wordpress/block-editor";

const blockProps = useBlockProps({
    className: `${className} ${backgroundImage || useFeaturedImage ? "has-background-image" : ""}`,
});

// In your block's edit function
<>
    <SectionSettings
        backgroundImage={backgroundImage}
        focalPoint={focalPoint}
        opacity={opacity}
        imageStyle={imageStyle}
        useFeaturedImage={useFeaturedImage}
        onImageSelect={(image) =>
            setAttributes({
                backgroundImage: image.id,
                focalPoint: focalPoint || { x: 0.5, y: 0.5 },
            })
        }
        onImageRemove={() =>
            setAttributes({
                backgroundImage: null,
                focalPoint: null,
            })
        }
        onFocalPointChange={(point) => setAttributes({ focalPoint: point })}
        onOpacityChange={(value) => setAttributes({ opacity: value })}
        onImageStyleChange={(style) => setAttributes({ imageStyle: style })}
        onFeaturedImageToggle={(value) =>
            setAttributes({ useFeaturedImage: value })
        }
        enableFeaturedImage={true}
        enableMediaStyle={true}
        enableMediaOpacity={true}
    />

    <section {...blockProps}>
        {children}
        <SectionBackground
            backgroundImage={backgroundImage}
            focalPoint={focalPoint}
            opacity={opacity}
            imageStyle={imageStyle}
            useFeaturedImage={useFeaturedImage}
        />
    </section>
</>;
```

## 🎨 Custom Panel Example

Build your own custom settings panel:

```jsx
import {
    MediaSelectControl,
    OpacityControl,
    StyleControl,
} from "@builtnorth/wp-component-library";
import { __experimentalToolsPanel as ToolsPanel } from "@wordpress/components";

<ToolsPanel label="Custom Background Panel">
    <MediaSelectControl
        backgroundImage={backgroundImage}
        onSelect={handleSelect}
        onRemove={handleRemove}
    />
    <OpacityControl opacity={opacity} onChange={handleOpacityChange} />
    <StyleControl imageStyle={imageStyle} onChange={handleStyleChange} />
</ToolsPanel>;
```

## 🔧 Props Reference

See individual component files for complete prop documentation with TypeScript-style definitions and default values.
