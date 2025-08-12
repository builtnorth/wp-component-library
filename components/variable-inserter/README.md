# VariableInserter Component

A reusable component for inserting variable tags into text fields. Similar to Yoast's variable inserter but more flexible and customizable.

## Usage

```jsx
import VariableInserter from "@builtnorth/wp-component-library/components/variable-inserter";

const variables = [
    { label: "Site Name", value: "{site_name}" },
    { label: "Post Title", value: "{title}" },
    { label: "Post Excerpt", value: "{excerpt}" },
];

<VariableInserter
    variables={variables}
    currentValue={currentValue}
    onChange={setValue}
    placeholder="Insert Variable"
/>;
```

## Props

| Prop           | Type     | Default             | Description                                                   |
| -------------- | -------- | ------------------- | ------------------------------------------------------------- |
| `variables`    | Array    | `[]`                | Array of variable objects with `label` and `value` properties |
| `currentValue` | string   | `""`                | Current value of the text field                               |
| `onChange`     | Function | -                   | Function to call when a variable is inserted                  |
| `buttonProps`  | Object   | `{}`                | Props to pass to the button component                         |
| `placeholder`  | string   | `"Insert Variable"` | Placeholder text for the button                               |
| `className`    | string   | `""`                | Additional CSS classes                                        |
| `size`         | string   | `"small"`           | Button size (`small`, `medium`, `large`)                      |
| `variant`      | string   | `"tertiary"`        | Button variant (`primary`, `secondary`, `tertiary`)           |

## Example with TextControl

```jsx
import { TextControl } from "@wordpress/components";
import VariableInserter from "@builtnorth/wp-component-library/components/variable-inserter";

const [value, setValue] = useState("");

<Flex gap={2} align="flex-end">
    <TextControl label="SEO Title" value={value} onChange={setValue} />
    <VariableInserter
        variables={seoVariables}
        currentValue={value}
        onChange={setValue}
    />
</Flex>;
```

## Variable Object Structure

Each variable in the `variables` array should have:

```jsx
{
    label: "Human readable name",
    value: "{variable_tag}"
}
```

## Styling

The component includes built-in styles that work with WordPress admin theme. It supports both light and dark modes.
