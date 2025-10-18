# Media Components

A comprehensive set of media upload and management components for WordPress blocks, providing different UI patterns for various contexts within the block editor.

## Components

### ToolbarMediaUpload
Media upload button for block toolbars with customizable icons and labels.

### EditorMediaUpload
Flexible media upload component for the main editor canvas with image preview support.

### InspectorMediaUpload
Media upload control for inspector panels with integrated preview and management.

### SettingsMediaUpload
Advanced media upload for settings panels with focal point control and additional options.

### ImageControls
Comprehensive image control panel with aspect ratio, object fit, and focal point settings.

## Usage

```jsx
import { 
    ToolbarMediaUpload,
    EditorMediaUpload,
    InspectorMediaUpload,
    SettingsMediaUpload,
    ImageControls
} from '@builtnorth/wp-component-library/components/media';

// Toolbar upload
<BlockControls>
    <ToolbarMediaUpload
        buttonTitle="Select Image"
        onSelect={handleImageSelect}
        allowedTypes={['image']}
        value={imageId}
    />
</BlockControls>

// Editor canvas upload
<EditorMediaUpload
    buttonTitle="Choose Background"
    onSelect={handleImageSelect}
    imageUrl={backgroundUrl}
    imageAlt={backgroundAlt}
/>

// Inspector panel upload
<InspectorControls>
    <InspectorMediaUpload
        buttonTitle="Upload Logo"
        onSelect={handleLogoSelect}
        onRemove={handleLogoRemove}
        imageId={logoId}
        imageUrl={logoUrl}
    />
</InspectorControls>

// Advanced settings upload
<SettingsMediaUpload
    label="Hero Image"
    onSelect={handleHeroSelect}
    onRemove={handleHeroRemove}
    value={heroImage}
    focalPoint={focalPoint}
    onFocalPointChange={setFocalPoint}
/>
```

## Common Props

### Core Props (All Components)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSelect` | `function` | Required | Media selection handler |
| `allowedTypes` | `array` | `['image']` | Allowed media types |
| `buttonTitle` | `string` | Varies | Button label text |

### ToolbarMediaUpload Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Selected media ID |
| `buttonIcon` | `element` | `image` | Toolbar button icon |
| `buttonLabel` | `string` | - | Accessibility label |
| `multiple` | `boolean` | `false` | Allow multiple selection |
| `gallery` | `boolean` | `false` | Gallery mode |

### EditorMediaUpload Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageUrl` | `string` | - | Current image URL for preview |
| `imageAlt` | `string` | - | Image alt text |
| `imageId` | `number` | - | Current image ID |
| `onRemove` | `function` | - | Image removal handler |
| `className` | `string` | - | Additional CSS classes |

### InspectorMediaUpload Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageId` | `number` | - | Current image ID |
| `imageUrl` | `string` | - | Current image URL |
| `onRemove` | `function` | - | Image removal handler |
| `label` | `string` | - | Control label |
| `help` | `string` | - | Help text |

### SettingsMediaUpload Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `"Image"` | Control label |
| `value` | `object` | - | Image data object |
| `onRemove` | `function` | - | Image removal handler |
| `focalPoint` | `object` | - | Focal point coordinates |
| `onFocalPointChange` | `function` | - | Focal point change handler |
| `help` | `string` | - | Help text |

## ImageControls Component

Advanced image settings panel with comprehensive controls:

```jsx
<ImageControls
    imageId={imageId}
    imageUrl={imageUrl}
    onRemove={handleRemove}
    aspectRatio={aspectRatio}
    onAspectRatioChange={setAspectRatio}
    objectFit={objectFit}
    onObjectFitChange={setObjectFit}
    focalPoint={focalPoint}
    onFocalPointChange={setFocalPoint}
    imagePosition={imagePosition}
    onImagePositionChange={setImagePosition}
/>
```

### ImageControls Props
| Prop | Type | Description |
|------|------|-------------|
| `imageId` | `number` | Current image ID |
| `imageUrl` | `string` | Current image URL |
| `onRemove` | `function` | Image removal handler |
| `aspectRatio` | `string` | Aspect ratio value |
| `onAspectRatioChange` | `function` | Aspect ratio change handler |
| `objectFit` | `string` | Object fit value (cover, contain, etc.) |
| `onObjectFitChange` | `function` | Object fit change handler |
| `focalPoint` | `object` | Focal point {x, y} coordinates |
| `onFocalPointChange` | `function` | Focal point change handler |
| `imagePosition` | `string` | CSS background position |
| `onImagePositionChange` | `function` | Position change handler |

## Aspect Ratios

The library includes predefined aspect ratios via `ASPECT_RATIOS`:

```jsx
import { ASPECT_RATIOS } from '@builtnorth/wp-component-library/components/media/utils/aspect-ratios';

// Available ratios:
{
    'original': 'Original',
    '1-1': 'Square (1:1)',
    '4-3': 'Standard (4:3)',
    '16-9': 'Widescreen (16:9)',
    '21-9': 'Ultrawide (21:9)',
    '3-2': 'Classic (3:2)',
    '5-4': 'Large Format (5:4)',
    '9-16': 'Portrait (9:16)'
}
```

## Examples

### Hero Section with Background
```jsx
function HeroSection({ attributes, setAttributes }) {
    const { backgroundImage, focalPoint } = attributes;
    
    return (
        <>
            <InspectorControls>
                <PanelBody title="Background">
                    <SettingsMediaUpload
                        label="Background Image"
                        value={backgroundImage}
                        onSelect={(media) => setAttributes({ 
                            backgroundImage: {
                                id: media.id,
                                url: media.url,
                                alt: media.alt
                            }
                        })}
                        onRemove={() => setAttributes({ backgroundImage: null })}
                        focalPoint={focalPoint}
                        onFocalPointChange={(point) => setAttributes({ focalPoint: point })}
                    />
                </PanelBody>
            </InspectorControls>
            
            <div 
                className="hero"
                style={{
                    backgroundImage: `url(${backgroundImage?.url})`,
                    backgroundPosition: `${focalPoint?.x * 100}% ${focalPoint?.y * 100}%`
                }}
            >
                {/* Hero content */}
            </div>
        </>
    );
}
```

### Gallery Block
```jsx
function GalleryBlock({ attributes, setAttributes }) {
    const { images } = attributes;
    
    return (
        <BlockControls>
            <ToolbarMediaUpload
                buttonTitle="Add Images"
                buttonIcon={gallery}
                onSelect={(media) => {
                    const newImages = media.map(item => ({
                        id: item.id,
                        url: item.url,
                        alt: item.alt
                    }));
                    setAttributes({ images: [...images, ...newImages] });
                }}
                multiple={true}
                gallery={true}
                allowedTypes={['image']}
            />
        </BlockControls>
    );
}
```

### Card with Featured Image
```jsx
function Card({ attributes, setAttributes }) {
    const { featuredImage, aspectRatio, objectFit } = attributes;
    
    return (
        <InspectorControls>
            <PanelBody title="Featured Image">
                <ImageControls
                    imageId={featuredImage?.id}
                    imageUrl={featuredImage?.url}
                    onRemove={() => setAttributes({ featuredImage: null })}
                    aspectRatio={aspectRatio}
                    onAspectRatioChange={(ratio) => setAttributes({ aspectRatio: ratio })}
                    objectFit={objectFit}
                    onObjectFitChange={(fit) => setAttributes({ objectFit: fit })}
                />
            </PanelBody>
        </InspectorControls>
    );
}
```

## Media Selection Handler

Standard media selection handler pattern:
```jsx
const handleMediaSelect = (media) => {
    setAttributes({
        imageId: media.id,
        imageUrl: media.url,
        imageAlt: media.alt,
        imageWidth: media.width,
        imageHeight: media.height
    });
};
```

## Notes

- All components integrate with WordPress MediaUpload
- Components handle both selection and removal of media
- Focal point control uses WordPress FocalPointPicker
- Image preview automatically displayed when URL provided
- Components styled to match WordPress admin UI
- Supports all WordPress media types via allowedTypes prop