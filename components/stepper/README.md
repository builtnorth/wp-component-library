# Stepper

Numbered steps joined by a line, with a check on finished ones.

```jsx
import { Stepper } from "@siratik/wp-component-library";

<Stepper
    items={[
        { key: "start", label: __("Start, done"), state: "done" },
        { key: "look", label: __("Look"), state: "current" },
        { key: "details", label: __("Business"), state: "todo" },
    ]}
/>;
```

| Prop        | Type   | Notes                                                                                   |
|-------------|--------|-----------------------------------------------------------------------------------------|
| `items`     | array  | `key`, `label` (screen readers only) and `state`: `todo`, `current` or `done`, in order. |
| `className` | string | Additional CSS classes.                                                                  |

Steps can finish in any order. A line uses the accent color only when the step
before it is done and the next is not `todo`.

`StepNumber` is also exported, for showing the same circle elsewhere:
`<StepNumber state="done" number={2} />`.
