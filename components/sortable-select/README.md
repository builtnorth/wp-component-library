# SortableSelect Component

A flexible component that combines react-select with drag-and-drop sorting capabilities using dnd-kit. The selected tokens/pills within the react-select component itself are sortable via drag and drop. Perfect for creating searchable, sortable lists of posts, terms, users, or any custom data.

## Installation

This component's dependencies are included with the component library. No additional installation is required.

### Dependencies Included:
- react-select (for the select functionality)
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, @dnd-kit/modifiers (for drag and drop)

**Note about @emotion warnings:** You may see console warnings about multiple instances of @emotion/react. These warnings are harmless and occur because react-select bundles @emotion. The component will function correctly despite these warnings.

## Basic Usage

```jsx
import { SortableSelect } from '@builtnorth/wp-component-library';
import { useState } from '@wordpress/element';

function MyComponent() {
    const [selected, setSelected] = useState([]);
    
    return (
        <SortableSelect
            value={selected}
            onChange={setSelected}
            options={[
                { value: '1', label: 'Option 1' },
                { value: '2', label: 'Option 2' },
                { value: '3', label: 'Option 3' },
            ]}
            placeholder="Select options..."
        />
    );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Array` | `[]` | Currently selected items |
| `onChange` | `Function` | required | Callback when selection or order changes |
| `options` | `Array` | - | Static options for sync mode |
| `loadOptions` | `Function` | - | Async function to load options |
| `getOptionLabel` | `Function` | `(option) => option.label \|\| option.name \|\| option.title` | Extract display label |
| `getOptionValue` | `Function` | `(option) => option.value \|\| option.id` | Extract unique value |
| `renderOption` | `Function` | - | Custom option renderer |
| `placeholder` | `string` | `"Search and select..."` | Placeholder text |
| `isMulti` | `boolean` | `true` | Enable multi-select |
| `isClearable` | `boolean` | `true` | Show clear button |
| `isSearchable` | `boolean` | `true` | Enable search |
| `isDisabled` | `boolean` | `false` | Disable component |
| `className` | `string` | `""` | Additional CSS classes |
| `maxItems` | `number` | - | Maximum selectable items |
| `filterOption` | `Function` | - | Custom filter function |

## Advanced Examples

### Async Post Search

```jsx
import { SortableSelect } from '@builtnorth/wp-component-library';
import apiFetch from '@wordpress/api-fetch';

function PostSelector() {
    const [selectedPosts, setSelectedPosts] = useState([]);
    
    const searchPosts = async (inputValue) => {
        const response = await apiFetch({
            path: `/wp/v2/posts?search=${inputValue}&per_page=20`,
        });
        return response;
    };
    
    return (
        <SortableSelect
            value={selectedPosts}
            onChange={setSelectedPosts}
            loadOptions={searchPosts}
            getOptionLabel={(post) => post.title.rendered}
            getOptionValue={(post) => post.id}
            placeholder="Search posts..."
        />
    );
}
```

### Custom Rendering

```jsx
<SortableSelect
    value={selectedUsers}
    onChange={setSelectedUsers}
    loadOptions={searchUsers}
    renderOption={(user) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
                src={user.avatar_urls['48']} 
                alt={user.name}
                style={{ width: '24px', height: '24px', borderRadius: '50%' }}
            />
            <div>
                <div>{user.name}</div>
                <small style={{ color: '#666' }}>{user.email}</small>
            </div>
        </div>
    )}
/>
```

### Variable Tags with Categories

```jsx
const variableTags = [
    { value: '{{site_name}}', label: 'Site Name', category: 'Site' },
    { value: '{{post_title}}', label: 'Post Title', category: 'Post' },
    { value: '{{author_name}}', label: 'Author Name', category: 'Author' },
];

<SortableSelect
    value={selectedTags}
    onChange={setSelectedTags}
    options={variableTags}
    renderOption={(option) => (
        <div>
            <strong>{option.label}</strong>
            <code style={{ marginLeft: '8px' }}>{option.value}</code>
        </div>
    )}
/>
```

## Styling

The component includes default styles and supports dark mode. You can customize the appearance using the provided CSS classes:

- `.sortable-select` - Main container
- `.sortable-select__control` - React-select control
- `.sortable-select__multi-value` - Individual token/pill
- `.sortable-select__drag-handle` - Drag handle icon within tokens
- `.sortable-select__multi-value__label` - Token label text
- `.sortable-select__multi-value__remove` - Token remove button

## Accessibility

The component includes proper ARIA labels and keyboard support:
- Arrow keys to navigate options
- Enter to select
- Tab to move between elements
- Drag tokens to reorder them within the select component
- The drag handle appears on hover for better UX