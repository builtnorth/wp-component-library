# CardRepeater Component

A reusable component for creating repeatable card-based forms with reordering capabilities. This component follows WordPress admin UI patterns using `Card` and `Toolbar` components.

## Features

- ✅ Add/remove items with confirmation
- ✅ Reorder items with up/down buttons
- ✅ Customizable inner content for each item
- ✅ Customizable toolbar title and icon
- ✅ Customizable add button text
- ✅ Empty state handling
- ✅ WordPress admin UI consistency
- ✅ Responsive design

## Usage

```jsx
import { CardRepeater } from "@your-package/wp-component-library";
import { useState } from "@wordpress/element";
import { link, page } from "@wordpress/icons";

function MyComponent() {
    const [items, setItems] = useState([]);

    const addItem = () => {
        const newItem = {
            id: Date.now().toString(),
            title: "",
            url: "",
        };
        setItems([...items, newItem]);
    };

    const removeItem = (itemId) => {
        setItems(items.filter((item) => item.id !== itemId));
    };

    const moveItem = (index, direction) => {
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return;

        const updatedItems = [...items];
        const temp = updatedItems[index];
        updatedItems[index] = updatedItems[newIndex];
        updatedItems[newIndex] = temp;
        setItems(updatedItems);
    };

    const updateItem = (itemId, field, value) => {
        setItems(
            items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item,
            ),
        );
    };

    const renderItem = (item, index) => (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
            }}
        >
            <TextControl
                label="Title"
                value={item.title || ""}
                onChange={(value) => updateItem(item.id, "title", value)}
            />
            <TextControl
                label="URL"
                type="url"
                value={item.url || ""}
                onChange={(value) => updateItem(item.id, "url", value)}
            />
        </div>
    );

    const getItemTitle = (item) => {
        return item.title || "Untitled Item";
    };

    const getItemIcon = (item) => {
        return item.url && item.url.includes("http") ? link : page;
    };

    return (
        <CardRepeater
            items={items}
            renderItem={renderItem}
            onAdd={addItem}
            onRemove={removeItem}
            onMove={moveItem}
            getItemTitle={getItemTitle}
            getItemIcon={getItemIcon}
            addButtonText="Add New Link"
            emptyStateText="No links added yet. Click the button above to add your first link."
        />
    );
}
```

## Props

| Prop             | Type       | Required | Default                   | Description                                                                              |
| ---------------- | ---------- | -------- | ------------------------- | ---------------------------------------------------------------------------------------- |
| `items`          | `Array`    | ✅       | `[]`                      | Array of items to render. Each item must have an `id` property.                          |
| `renderItem`     | `Function` | ✅       | -                         | Function to render the content inside each card. Receives `(item, index)` as parameters. |
| `onAdd`          | `Function` | ✅       | -                         | Callback when add button is clicked.                                                     |
| `onRemove`       | `Function` | ✅       | -                         | Callback when remove button is clicked. Receives `itemId` as parameter.                  |
| `onMove`         | `Function` | ✅       | -                         | Callback when item is moved. Receives `(index, direction)` as parameters.                |
| `getItemTitle`   | `Function` | ❌       | -                         | Function to get the title for the toolbar. Receives `(item, index)` as parameters.       |
| `getItemIcon`    | `Function` | ❌       | -                         | Function to get the icon for the toolbar. Receives `(item, index)` as parameters.        |
| `addButtonText`  | `String`   | ❌       | `"Add Item"`              | Text for the add button.                                                                 |
| `emptyStateText` | `String`   | ❌       | `"No items added yet..."` | Text to show when no items exist.                                                        |
| `className`      | `String`   | ❌       | `""`                      | Additional CSS classes for the container.                                                |
| `itemClassName`  | `String`   | ❌       | `""`                      | Additional CSS classes for each item card.                                               |
| `showEmptyState` | `Boolean`  | ❌       | `true`                    | Whether to show empty state message.                                                     |

## Migration from Custom Repeaters

If you're migrating from a custom repeater implementation like those in `utility-links.panel.js` or `social-media.panel.js`, here are the key changes:

### Before (Custom Implementation)

```jsx
// Multiple functions and complex JSX for repeater logic
const addUtilityLink = () => {
    /* ... */
};
const removeUtilityLink = (linkId) => {
    /* ... */
};
const moveUtilityLink = (index, direction) => {
    /* ... */
};

// Complex JSX with Cards, Toolbars, etc.
return <div>{/* Lots of repetitive JSX */}</div>;
```

### After (CardRepeater)

```jsx
// Clean, simple implementation
return (
    <CardRepeater
        items={items}
        renderItem={renderItem}
        onAdd={addItem}
        onRemove={removeItem}
        onMove={moveItem}
        getItemTitle={getItemTitle}
        getItemIcon={getItemIcon}
        addButtonText="Add Item"
    />
);
```

## Styling

The component includes basic styling but can be customized with:

- Custom CSS classes via `className` and `itemClassName` props
- CSS custom properties for theming
- Override styles using `.card-repeater` CSS class

## Accessibility

The component includes:

- Proper ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly markup
- Focus management
