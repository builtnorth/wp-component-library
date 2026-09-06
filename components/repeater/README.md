# Repeater Component

A flexible repeater component with drag-and-drop functionality powered by @dnd-kit. This component allows users to add, remove, and reorder items in a list with a smooth dragging experience.

## Features

- **Drag and Drop**: Smooth drag-and-drop reordering using @dnd-kit
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Flexible Content**: Render any content inside repeater items via renderItem prop
- **Collapsible Rows**: Optional header summary with expand/collapse (opt-in)
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

## Collapsible items

Pass `collapsible` to show a header row with an expand/collapse control. Use `renderSummary` for whatever should stay visible when the item is closed (name, enable toggle, badge, etc.). `renderItem` is only mounted while the item is expanded.

Existing items start collapsed (`defaultExpanded={false}`). A single newly added item starts open (`expandNewItems`). Drag overlay shows the collapsed header only.

When `collapsible` is on, Repeater owns the header chrome (drag handle, chevron, remove). Put interactive header content in `renderSummary` — do not place `DragHandle` or `RemoveButton` there.

```jsx
<Repeater
    items={items}
    collapsible
    enableReorder={false}
    renderSummary={(item) => (
        <>
            <ToggleControl
                __nextHasNoMarginBottom
                label=""
                checked={item.enabled}
                onChange={(enabled) => updateItem(item.id, { enabled })}
            />
            <span className="built-repeater__summary-name">
                {item.name || "Untitled"}
            </span>
        </>
    )}
    renderItem={(item) => (
        <TextControl
            label="Name"
            value={item.name}
            onChange={(name) => updateItem(item.id, { name })}
        />
    )}
    onAdd={handleAdd}
    onRemove={handleRemove}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array` | `[]` | Array of items with unique `id` property |
| `renderItem` | `Function` | Required | Function to render each item's content. Receives `(item, index)`. When `collapsible` is true, this is the expanded body only. |
| `onAdd` | `Function` | Required | Callback when add button is clicked |
| `onRemove` | `Function` | Required | Callback when remove button is clicked |
| `onReorder` | `Function` | Required | Callback when items are reordered |
| `className` | `String` | `""` | Additional CSS classes |
| `addButtonText` | `String` | `"Add Item"` | Text for the add button |
| `emptyStateText` | `String` | `"No items added yet..."` | Text shown when list is empty |
| `maxItems` | `Number` | `null` | Maximum number of items allowed |
| `minItems` | `Number` | `0` | Minimum number of items required |
| `renderMode` | `String` | `"default"` | `"default"` uses built-in drag/remove chrome. `"integrated"` lets `renderItem` place `DragHandle` and `RemoveButton`. Ignored when `collapsible` is true. |
| `enableReorder` | `Boolean` | `true` | Whether items can be dragged to reorder. Set to `false` for lists where order doesn't matter (e.g. a set of find/replace pairs) — no drag handle renders, and `onReorder` is not required. |
| `collapsible` | `Boolean` | `false` | Collapse each item behind a header. Existing callers omit this and keep always-open rows. |
| `renderSummary` | `Function` | `null` | Header content shown while collapsed (and still shown while expanded). Receives `(item, index)`. |
| `defaultExpanded` | `Boolean` | `false` | When `collapsible`, existing items start expanded. |
| `expandNewItems` | `Boolean` | `true` | When `collapsible`, a single newly added item starts expanded. |

## Keyboard Shortcuts

- **Tab**: Navigate between items and controls
- **Space/Enter**: Activate drag handle
- **Arrow Keys**: Move item up/down when dragging
- **Escape**: Cancel drag operation

## Styling

The component provides these CSS classes for customization:

- `.wpcl-repeater--collapsible` - Root class when `collapsible` is true
- `.wpcl-repeater__item--dragging` - Applied to the placeholder while an item is being dragged
- `.wpcl-repeater__item--integrated` - Applied in integrated render mode
- `.wpcl-repeater__item--collapsible` - Collapsible item (header + optional body)
- `.wpcl-repeater__item--expanded` - Collapsible item that is currently open
- `.built-repeater__items` - Items container
- `.built-repeater__item-handle` - Drag handle
- `.built-repeater__item-header` - Collapsible header row
- `.built-repeater__item-toggle` - Expand/collapse button
- `.built-repeater__summary` - Always-visible header content
- `.built-repeater__summary-name` - Optional truncated label in the header
- `.built-repeater__item-content` - Item content area
- `.built-repeater__item-actions` - Action buttons area
- `.built-repeater__empty-state` - Empty state message
- `.built-repeater__add-button` - Add button container