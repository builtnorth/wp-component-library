# Repeater Component

A flexible repeater component with drag-and-drop functionality powered by @dnd-kit. This component allows users to add, remove, and reorder items in a list with a smooth dragging experience.

## Features

- **Drag and Drop**: Smooth drag-and-drop reordering using @dnd-kit
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Flexible Content**: Render any content inside repeater items via renderItem prop
- **Min/Max Limits**: Configure minimum and maximum number of items
- **Customizable**: Custom labels, empty states, and styling
- **Accessible**: ARIA labels and keyboard navigation support

## Usage

```jsx
import { Repeater } from '@builtnorth/wp-component-library/components/repeater';
import { useState } from '@wordpress/element';

function MyComponent() {
    const [items, setItems] = useState([
        { id: '1', title: 'First Item', content: 'Some content' },
        { id: '2', title: 'Second Item', content: 'More content' }
    ]);

    const handleAdd = () => {
        const newItem = {
            id: Date.now().toString(),
            title: '',
            content: ''
        };
        setItems([...items, newItem]);
    };

    const handleRemove = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleReorder = (newItems) => {
        setItems(newItems);
    };

    const renderItem = (item) => (
        <div>
            <TextControl
                label="Title"
                value={item.title}
                onChange={(title) => updateItem(item.id, { title })}
            />
            <TextareaControl
                label="Content"
                value={item.content}
                onChange={(content) => updateItem(item.id, { content })}
            />
        </div>
    );

    return (
        <Repeater
            items={items}
            renderItem={renderItem}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onReorder={handleReorder}
            addButtonText="Add New Item"
            emptyStateText="No items yet. Click below to add one."
            maxItems={10}
            minItems={1}
        />
    );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array` | `[]` | Array of items with unique `id` property |
| `renderItem` | `Function` | Required | Function to render each item's content |
| `onAdd` | `Function` | Required | Callback when add button is clicked |
| `onRemove` | `Function` | Required | Callback when remove button is clicked |
| `onReorder` | `Function` | Required | Callback when items are reordered |
| `className` | `String` | `""` | Additional CSS classes |
| `addButtonText` | `String` | `"Add Item"` | Text for the add button |
| `emptyStateText` | `String` | `"No items added yet..."` | Text shown when list is empty |
| `maxItems` | `Number` | `null` | Maximum number of items allowed |
| `minItems` | `Number` | `0` | Minimum number of items required |

## Keyboard Shortcuts

- **Tab**: Navigate between items and controls
- **Space/Enter**: Activate drag handle
- **Arrow Keys**: Move item up/down when dragging
- **Escape**: Cancel drag operation

## Styling

The component provides these CSS classes for customization:

- `.polaris-repeater` - Main container
- `.polaris-repeater__items` - Items container
- `.polaris-repeater__item` - Individual item
- `.polaris-repeater__item-handle` - Drag handle
- `.polaris-repeater__item-content` - Item content area
- `.polaris-repeater__item-actions` - Action buttons area
- `.polaris-repeater__empty-state` - Empty state message
- `.polaris-repeater__add-button` - Add button container