# Query Controls

This directory contains standalone, modular query controls that can be composed together to build custom query interfaces. Each control is focused on a single responsibility and is always rendered as a ToolsPanelItem.

## Individual Controls

These controls are always ToolsPanelItems that can be composed together in ToolsPanel containers:

### Core Controls

- **`PostTypeSelect`** - Select post type
- **`OrderBySelect`** - Order posts by date, title, etc.
- **`SelectionModeControl`** - Toggle between auto and manual selection

### Manual Selection Controls

- **`ManualPostSelector`** - Search and select specific posts
- **`TermSelector`** - Search and select taxonomy terms
- **`TaxonomySelect`** - Select taxonomy for term filtering

### Display Controls

- **`DisplayTypeSelect`** - Choose grid, list, slider, or pills display
- **`PostsPerPageControl`** - Control number of items to show
- **`ColumnCountControl`** - Set columns for grid or slides for slider

## Usage

### Basic Usage

```jsx
import { __experimentalToolsPanel as ToolsPanel } from "@wordpress/components";
import { PostTypeSelect, OrderBySelect } from "../query";

function MyQueryInterface({ attributes, setAttributes }) {
    const resetAll = () => {
        setAttributes({
            postType: "post",
            orderPostsBy: "date",
            orderPostsDirection: "desc",
        });
    };

    return (
        <ToolsPanel label="Query Settings" resetAll={resetAll}>
            <PostTypeSelect
                attributes={attributes}
                setAttributes={setAttributes}
            />
            <OrderBySelect
                attributes={attributes}
                setAttributes={setAttributes}
            />
        </ToolsPanel>
    );
}
```

### Custom Order Options

```jsx
import { OrderBySelect, defaultOrderOptions } from "../query";

function CustomOrderExample({ attributes, setAttributes }) {
    // Option 1: Completely replace with custom options
    const customOptions = [
        { label: "Popularity", value: "meta_value_num_desc" },
        { label: "Price (Low to High)", value: "meta_value_num_asc" },
        { label: "Rating", value: "rating_desc" },
    ];

    // Option 2: Use defaults as a base and modify
    const extendedOptions = [
        ...defaultOrderOptions,
        { label: "Custom Field", value: "meta_value_desc" },
        { label: "View Count", value: "views_desc" },
    ];

    // Option 3: Mix defaults with custom (reorder, filter, etc.)
    const mixedOptions = [
        defaultOrderOptions[1], // Date (Newest → Oldest)
        defaultOrderOptions[2], // Date (Oldest → Newest)
        { label: "Featured First", value: "featured_desc" },
        defaultOrderOptions[5], // Random
    ];

    return (
        <ToolsPanel label="Query Settings" resetAll={resetAll}>
            {/* Use completely custom options */}
            <OrderBySelect
                attributes={attributes}
                setAttributes={setAttributes}
                orderOptions={customOptions}
            />

            {/* Or use extended options */}
            <OrderBySelect
                attributes={attributes}
                setAttributes={setAttributes}
                orderOptions={extendedOptions}
            />
        </ToolsPanel>
    );
}
```

### Complete Query Interface

```jsx
import { __experimentalToolsPanel as ToolsPanel } from "@wordpress/components";
import {
    PostTypeSelect,
    OrderBySelect,
    SelectionModeControl,
    ManualPostSelector,
    DisplayTypeSelect,
} from "../query";

function CompleteQueryInterface({ attributes, setAttributes }) {
    const resetAll = () => {
        setAttributes({
            postType: "post",
            orderPostsBy: "date",
            orderPostsDirection: "desc",
            selectionMode: "auto",
            selectedPosts: [],
            displayAs: "grid",
        });
    };

    return (
        <ToolsPanel label="Query Settings" resetAll={resetAll}>
            <PostTypeSelect
                attributes={attributes}
                setAttributes={setAttributes}
            />
            <OrderBySelect
                attributes={attributes}
                setAttributes={setAttributes}
            />
            <SelectionModeControl
                attributes={attributes}
                setAttributes={setAttributes}
            />
            {attributes.selectionMode === "manual" && (
                <ManualPostSelector
                    attributes={attributes}
                    setAttributes={setAttributes}
                    postType={attributes.postType}
                />
            )}
            <DisplayTypeSelect
                attributes={attributes}
                setAttributes={setAttributes}
            />
        </ToolsPanel>
    );
}
```

### Multiple Panels for Organization

```jsx
function OrganizedInterface({ attributes, setAttributes }) {
    return (
        <>
            <ToolsPanel label="Content Selection" resetAll={resetContent}>
                <PostTypeSelect
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
                <OrderBySelect
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
            </ToolsPanel>

            <ToolsPanel label="Display Settings" resetAll={resetDisplay}>
                <DisplayTypeSelect
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
                <PostsPerPageControl
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
                <ColumnCountControl
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
            </ToolsPanel>
        </>
    );
}
```

## Required Attributes

Make sure your block attributes include these for the controls to work properly:

```jsx
// Required attributes for query controls
const attributes = {
    // Core query attributes
    postType: {
        type: "string",
        default: "post",
    },
    orderPostsBy: {
        type: "string",
        default: "date",
    },
    orderPostsDirection: {
        type: "string",
        default: "desc",
    },

    // Selection mode attributes
    selectionMode: {
        type: "string",
        default: "auto",
    },
    selectedPosts: {
        type: "array",
        default: [],
    },

    // Taxonomy attributes
    selectedTaxonomy: {
        type: "string",
        default: "",
    },
    selectedTerms: {
        type: "array",
        default: [],
    },

    // Display attributes
    displayAs: {
        type: "string",
        default: "grid",
    },
    postsPerPage: {
        type: "number",
        default: 6,
    },
    columnCount: {
        type: "number",
        default: 3,
    },
};
```

## Exports

### Components

All individual controls are exported as named exports.

### Utilities

- **`defaultOrderOptions`** - Array of default order options for OrderBySelect

```jsx
import { OrderBySelect, defaultOrderOptions } from "../query";

// defaultOrderOptions contains:
// [
//   { label: "Custom Order", value: "menu_order_asc" },
//   { label: "Date (Newest → Oldest)", value: "date_desc" },
//   { label: "Date (Oldest → Newest)", value: "date_asc" },
//   { label: "Title (A → Z)", value: "title_asc" },
//   { label: "Title (Z → A)", value: "title_desc" },
//   { label: "Random", value: "rand_asc" },
// ]
```

## Control Props

### Common Props

All controls accept these common props:

- **`attributes`** (Object) - Block attributes object
- **`setAttributes`** (Function) - Function to update block attributes

### Specific Props

#### PostTypeSelect

- No additional props

#### OrderBySelect

- **`orderOptions`** (Array) - Custom order options (replaces defaults)
- **`additionalOrderOptions`** (Array) - Additional options to add to defaults (deprecated)

#### TaxonomySelect

- **`postType`** (String) - Post type to get taxonomies for

#### TermSelector

- **`selectedTaxonomy`** (String) - Taxonomy slug to get terms from

#### ManualPostSelector

- **`postType`** (String) - Post type to search (default: 'post')

#### DisplayTypeSelect

- **`allowedDisplayOptions`** (Array) - Allowed display types (default: ['grid', 'slider', 'list', 'pills'])

#### PostsPerPageControl

- **`label`** (String) - Label for control (default: 'Amount to Display')
- **`min`** (Number) - Minimum value (default: 1)
- **`max`** (Number) - Maximum value (default: 50)

#### ColumnCountControl

- **`min`** (Number) - Minimum value (default: 1)
- **`max`** (Number) - Maximum value (default: 4)

## Design Principles

1. **Single Responsibility** - Each control does one thing well
2. **Always ToolsPanelItems** - Controls are consistent ToolsPanelItem components
3. **Composable** - Controls can be mixed and matched as needed
4. **Consistent API** - All controls follow the same prop patterns
5. **No Forced Panels** - Controls don't create their own ToolsPanel containers

## Architecture Benefits

- **Modular**: Use only the controls you need
- **Flexible**: Arrange controls in any panel structure
- **Consistent**: All controls work the same way
- **Maintainable**: Each control is focused and isolated
- **Composable**: Build complex interfaces from simple parts
