/**
 * ConfirmDestructiveModal
 *
 * The confirm step before anything that can't be undone, or puts something back
 * the way it was (delete, remove, clear, sign everyone out): a question as the
 * title, what will happen, a bordered Cancel and a red button that names the action.
 * While the action runs it stays open and busy; if it fails, the error shows inside
 * it so the user can try again or cancel.
 *
 * The props follow WordPress's `ConfirmDialog` (still `__experimentalConfirmDialog`,
 * with no destructive button and no place for an error), so moving to it once it
 * has both is mostly a rename. Until then this is built on the plain `Modal`.
 *
 * @package WPComponentLibrary
 */

import {
	Button,
	__experimentalHStack as HStack,
	Icon,
	Modal,
	Notice,
	__experimentalVStack as VStack,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import styled from "@emotion/styled";

/* Keeps the icon at full size when the message wraps. */
const MessageIcon = styled(Icon)`
	flex: none;
`;

/**
 * @param {Object}          props
 * @param {boolean}         [props.isOpen=true]       Whether it shows.
 * @param {string}          props.title               The question, such as "Delete this form?".
 * @param {*}               props.children            What will happen.
 * @param {string}          props.confirmButtonText   Names the action, such as "Delete form".
 * @param {string}          [props.cancelButtonText]  Defaults to "Cancel".
 * @param {Function}        props.onConfirm           Runs the action. Close the modal when it succeeds.
 * @param {Function}        props.onCancel            Closes it (Cancel, Escape, the close button, a click outside).
 * @param {boolean}         [props.isBusy=false]      The action is running: buttons wait, and it can't be closed.
 * @param {string|*}        [props.error]             Why the action failed, shown inside.
 * @param {Object}          [props.icon]              An icon before the message, such as `caution`.
 * @param {string}          [props.size="small"]      Modal size.
 * @return {?Element} The modal, or null when closed.
 */
export function ConfirmDestructiveModal({
	isOpen = true,
	title,
	children,
	confirmButtonText,
	cancelButtonText,
	onConfirm,
	onCancel,
	isBusy = false,
	error = null,
	icon = null,
	size = "small",
}) {
	if (!isOpen) {
		return null;
	}

	const close = () => {
		if (!isBusy) {
			onCancel();
		}
	};

	const message = icon ? (
		<HStack alignment="top" spacing={2} justify="flex-start">
			<MessageIcon icon={icon} />
			<VStack spacing={2}>{children}</VStack>
		</HStack>
	) : (
		<VStack spacing={2}>{children}</VStack>
	);

	return (
		<Modal title={title} size={size} onRequestClose={close}>
			<VStack spacing={4}>
				{message}
				{error ? (
					<Notice status="error" isDismissible={false}>
						{error}
					</Notice>
				) : null}
				<HStack justify="flex-end" spacing={2}>
					<Button __next40pxDefaultSize variant="secondary" onClick={close} disabled={isBusy}>
						{cancelButtonText ?? __("Cancel", "wp-component-library")}
					</Button>
					<Button
						__next40pxDefaultSize
						variant="primary"
						isDestructive
						isBusy={isBusy}
						disabled={isBusy}
						accessibleWhenDisabled
						onClick={onConfirm}
					>
						{confirmButtonText}
					</Button>
				</HStack>
			</VStack>
		</Modal>
	);
}

export default ConfirmDestructiveModal;
