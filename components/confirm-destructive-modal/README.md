# ConfirmDestructiveModal

The confirm step before an action that can't be undone, or that puts something back the way it was: delete, remove, clear, sign everyone out.

- **Title:** the question, such as "Delete this form?"
- **Message:** what will happen.
- **Buttons:** a bordered Cancel, and a red button that names the action.
- **While the action runs:** the modal stays open and can't be closed.
- **If it fails:** the error shows inside the modal.

The props follow WordPress's `ConfirmDialog`. That component is still `__experimentalConfirmDialog`, with no destructive button and no place for an error. Once WordPress adds both, moving to it is mostly a rename.

## Usage

```jsx
import { ConfirmDestructiveModal } from '@siratik/wp-component-library';

const [ open, setOpen ] = useState( false );
const [ busy, setBusy ] = useState( false );
const [ error, setError ] = useState( '' );

const remove = () => {
	setBusy( true );
	setError( '' );
	apiFetch( { path, method: 'DELETE' } )
		.then( () => setOpen( false ) )
		.catch( ( failure ) => setError( failure.message ) )
		.finally( () => setBusy( false ) );
};

<ConfirmDestructiveModal
	isOpen={ open }
	title={ __( 'Delete this form?', 'my-plugin' ) }
	confirmButtonText={ __( 'Delete form', 'my-plugin' ) }
	onConfirm={ remove }
	onCancel={ () => setOpen( false ) }
	isBusy={ busy }
	error={ error }
>
	{ __( 'Its entries are deleted too. This can’t be undone.', 'my-plugin' ) }
</ConfirmDestructiveModal>
```

The button that opens the modal is usually `<Button variant="secondary" isDestructive>`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isOpen` | `boolean` | `true` | Whether it shows. |
| `title` | `string` | — | The question. |
| `children` | `node` | — | What will happen. |
| `confirmButtonText` | `string` | — | Names the action ("Delete form", not "OK"). |
| `cancelButtonText` | `string` | `'Cancel'` | |
| `onConfirm` | `function` | — | Runs the action. Close the modal when it succeeds. |
| `onCancel` | `function` | — | Cancel, Escape, the close button or a click outside. |
| `isBusy` | `boolean` | `false` | The action is running: buttons wait, and it can't be closed. |
| `error` | `string\|node` | `null` | Why the action failed, shown inside. |
| `icon` | `object` | `null` | An icon before the message, such as `caution`. |
| `size` | `string` | `'small'` | Modal size. |
