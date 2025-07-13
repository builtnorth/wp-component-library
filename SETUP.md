# WordPress Component Library - CSS Setup Guide

## Overview

This library has been optimized to prevent CSS duplication issues. Styles are now built separately from JavaScript to ensure they're only loaded once in your application.

## Installation & Usage

### 1. Install the Package

```bash
npm install @builtnorth/wp-component-library
```

### 2. Import Components (JavaScript Only)

```javascript
import { CardRepeater, SectionSettings } from '@builtnorth/wp-component-library';
```

### 3. Import Styles (Choose One Method)

#### Method A: Import in JavaScript (Recommended for Development)

```javascript
// In your main entry file (e.g., index.js or App.js)
import '@builtnorth/wp-component-library/build/style.css';
```

#### Method B: WordPress Enqueue (Recommended for Production)

```php
function enqueue_component_library_styles() {
    wp_enqueue_style(
        'wp-component-library',
        plugins_url( 'node_modules/@builtnorth/wp-component-library/build/style.css', __FILE__ ),
        array(),
        '1.0.0'
    );
}
add_action( 'wp_enqueue_scripts', 'enqueue_component_library_styles' );
add_action( 'admin_enqueue_scripts', 'enqueue_component_library_styles' );
```

## Important Notes

1. **DO NOT** import the styles multiple times. Import once at your application's entry point.
2. **DO NOT** import component-specific SCSS files directly.
3. The library uses WordPress's `@wordpress/scripts` build process with custom webpack configuration to extract CSS.

## Building the Library

```bash
# Development build with source maps
npm run build:debug

# Production build
npm run build

# Watch mode for development
npm run start
```

## CSS Architecture

- All styles are consolidated into a single `style.css` file
- Component styles are scoped to prevent conflicts
- Uses consistent naming conventions:
  - `.polaris-*` for Polaris framework components
  - `.builtnorth-*` for Built North specific components
  - Component-specific classes (e.g., `.card-repeater`, `.variable-inserter`)

## Troubleshooting

### Duplicate CSS Issues

If you're still experiencing duplicate CSS:

1. Check that you're not importing styles in multiple places
2. Ensure you're using the built CSS file, not the source SCSS
3. Clear your build cache: `rm -rf build/ && npm run build`

### Styles Not Loading

1. Verify the import path is correct
2. Check that the build process completed successfully
3. Ensure WordPress is enqueuing the styles on the correct pages

## Development Guidelines

When adding new components:

1. Add component styles to a new SCSS file in the component directory
2. Import the SCSS in `src/styles/index.scss`
3. Do NOT import SCSS in the component's JavaScript file
4. Use proper scoping to avoid style conflicts