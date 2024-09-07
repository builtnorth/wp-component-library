# WP Component Library

Library of reusable components for easier WordPress block development. It includes tools for common tasks like media uploads, color settings, and layouts.

## Installation

```bash
npm install @builtnorth/wp-component-library
```

## Components

-   [CustomColors](#customcolors)
-   [MediaUpload](#mediaupload)
-   [SectionSettings](#sectionsettings)
-   [AttachmentImage](#attachmentimage)
-   [Pagination](#pagination)

### CustomColors

A flexible color settings component that allows you to define custom color options.

**Usage:**

```jsx
import {
	CustomColors,
	withCustomColors,
} from "@builtnorth/wp-component-library";

// Basic usage
<CustomColors
	colorSettings={[
		{
			value: attributes.iconColor,
			onChange: (color) => setAttributes({ iconColor: color }),
			label: "Icon Color",
		},
		// ... more color settings
	]}
	title="My Custom Colors"
/>;
```

### MediaUpload

A set of components for handling media uploads in different contexts.

**Components:**

-   `ToolbarMediaUpload`: For use in block toolbars
-   `EditorMediaUpload`: A customizable media upload button
-   `InspectorMediaUpload`: For use in inspector controls

**Usage:**

```jsx
import { ToolbarMediaUpload, EditorMediaUpload, InspectorMediaUpload } from "@builtnorth/wp-component-library";

// Basic usage
<ToolbarMediaUpload
    buttonTitle="Upload Image"
    onSelect={handleImageSelect}
/>

<EditorMediaUpload
    buttonTitle="Upload Image"
    onSelect={handleImageSelect}
/>

<InspectorMediaUpload
    buttonTitle="Upload Image"
    onSelect={handleImageSelect}
/>
```

### SectionSettings

Components for managing section-level settings.

**Components:**

-   `SectionSettings`: General section settings
-   `SectionBackground`: Background settings for sections

**Usage:**

```jsx
import { SectionSettings, SectionBackground } from "@builtnorth/wp-component-library";

// Basic usage
<SectionSettings
    backgroundImage={backgroundImage}
    handleImageSelect={handleImageSelect}
    handleImageRemove={handleImageRemove}
/>

<SectionBackground
    backgroundImage={backgroundImage}
/>
```

### AttachmentImage

A component for displaying images with various sizes.

**Usage:**

```jsx
import { AttachmentImage } from "@builtnorth/wp-component-library";

// Basic usage
<AttachmentImage imageId={imageId} alt={altText} size={size} />;
```

### Pagination

A component for displaying pagination.

**Usage:**

```jsx
import { Pagination } from "@builtnorth/wp-component-library";

// Basic usage
<Pagination
	currentPage={currentPage}
	totalPages={totalPages}
	onPageChange={handlePageChange}
/>;
```

## Disclaimer

This component library is provided "as is" without warranty of any kind, express or implied. Use at your own risk. The authors and contributors are not responsible for any damages or liabilities arising from the use of this library. Always test components thoroughly in your specific environment before deploying to production.
