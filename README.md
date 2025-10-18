# WP Component Library

A comprehensive library of reusable components for WordPress block development, providing UI controls, media management, layout tools, and advanced input components.

## Installation

```bash
npm install @builtnorth/wp-component-library
```

## Components

### Media & Images

- [**AttachmentImage**](./components/attachment-image/README.md) - WordPress media attachment display with responsive features
- [**Media**](./components/media/README.md) - Complete media upload suite for toolbar, editor, and inspector contexts

### Layout & Structure

- [**Layout**](./components/layout/README.md) - Flexbox layout controls with alignment, justification, and orientation
- [**SectionSettings**](./components/section-settings/README.md) - Section-level background and styling controls
- [**SectionDivider**](./components/section-divider/README.md) - Decorative dividers for section blocks
- [**SectionPattern**](./components/section-pattern/README.md) - SVG background patterns with positioning controls

### Form & Input

- [**AttributesPanel**](./components/attributes-panel/README.md) - Dynamic attribute management for Site Editor blocks
- [**Button**](./components/button/README.md) - Frontend button component with style variants
- [**CaptchaPlaceholder**](./components/captcha-placeholder/README.md) - Unified captcha interface for multiple providers
- [**VariableField**](./components/variable-field/README.md) - Input with @ triggered variable autocomplete
- [**VariableInserter**](./components/variable-inserter/README.md) - Variable insertion tool for template fields

### Data & Content

- [**Query**](./components/query/README.md) - Query builder controls for post selection
- [**Meta**](./components/meta/README.md) - Meta field management and selection tools
- [**Repeater**](./components/repeater/README.md) - Drag-and-drop repeater field with flexible content
- [**SortableSelect**](./components/sortable-select/README.md) - Multi-select with drag-to-reorder functionality

### Editor Tools

- [**BlockAppender**](./components/block-appender/README.md) - Customizable block appenders for different contexts

## Quick Start

### Media Upload Example

```jsx
import { InspectorMediaUpload } from "@builtnorth/wp-component-library/components/media";

<InspectorMediaUpload
	buttonTitle="Upload Logo"
	onSelect={handleImageSelect}
	onRemove={handleImageRemove}
	imageId={logoId}
	imageUrl={logoUrl}
/>;
```

### Layout Controls Example

```jsx
import { LayoutPanel } from "@builtnorth/wp-component-library/components/layout";

<LayoutPanel
	orientation={orientation}
	onOrientationChange={setOrientation}
	justification={justification}
	onJustificationChange={setJustification}
	alignment={alignment}
	onAlignmentChange={setAlignment}
/>;
```

### Variable Field Example

```jsx
import { VariableField } from "@builtnorth/wp-component-library/components/variable-field";

<VariableField
	value={content}
	onChange={setContent}
	options={[
		{ label: "User Name", value: "{user_name}" },
		{ label: "Site Title", value: "{site_title}" },
	]}
	placeholder="Type @ to insert variables"
/>;
```

### Repeater Example

```jsx
import { Repeater } from "@builtnorth/wp-component-library/components/repeater";

<Repeater
	items={items}
	renderItem={renderItem}
	onAdd={handleAdd}
	onRemove={handleRemove}
	onReorder={handleReorder}
	addButtonText="Add Item"
/>;
```

## Component Categories

### 🖼️ Media Components

Handle image uploads, display, and media management across different editor contexts.

### 📐 Layout Components

Control flexbox layouts, alignment, spacing, and responsive design settings.

### 📝 Input Components

Advanced form fields with features like autocomplete, variable insertion, and validation.

### 📊 Data Components

Query builders, meta field selectors, and content management tools.

### 🎨 Style Components

Section styling, backgrounds, patterns, and visual dividers.

### 🔧 Utility Components

Helper components for common WordPress block editor tasks.

## Features

- **WordPress Integration** - Deep integration with WordPress block editor APIs
- **Customizable** - Flexible props and styling options
- **TypeScript Ready** - Full TypeScript definitions available
- **Tree-Shakeable** - Import only what you need

## Requirements

- WordPress 6.0+
- @wordpress/scripts
- React 18+

## Documentation

Each component has detailed documentation in its respective README file. Click on any component name above to view its full documentation including:

- Detailed usage examples
- Complete prop definitions
- Integration patterns
- Best practices
- Code snippets

## Disclaimer

This component library is provided "as is" without warranty of any kind, express or implied. Use at your own risk. The authors and contributors are not responsible for any damages or liabilities arising from the use of this library. Always test components thoroughly in your specific environment before deploying to production.
