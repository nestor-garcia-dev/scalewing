import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type FormEventHandler,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type PointerEvent,
  type PointerEventHandler,
  type ReactEventHandler,
  type SyntheticEvent,
} from 'react';

type CloseRequestOptions = {
  open: boolean;
  onClose: () => void;
  onCancel?: ReactEventHandler<HTMLDialogElement>;
  onKeyDown?: KeyboardEventHandler<HTMLDialogElement>;
  onPointerDown?: PointerEventHandler<HTMLDialogElement>;
  onSubmit?: FormEventHandler<HTMLDialogElement>;
};

/**
 * A press on the backdrop: the target is the dialog element itself (not a
 * child, a nested dialog's backdrop, or a popover that overflows the box)
 * and the point lies outside the dialog's box.
 */
function isBackdropPress(event: PointerEvent<HTMLDialogElement>): boolean {
  if (event.target !== event.currentTarget) return false;
  const rect = event.currentTarget.getBoundingClientRect();
  return (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  );
}

/** Escape typed into an input method (Safari reports it as keyCode 229). */
function isComposing(event: KeyboardEvent<HTMLDialogElement>): boolean {
  return event.nativeEvent.isComposing || event.keyCode === 229;
}

/**
 * Escape in a search field that holds text clears the field (the browser's
 * own default action) and does not close the dialog.
 */
function clearsSearchField(event: KeyboardEvent<HTMLDialogElement>): boolean {
  const target = event.target;
  return (
    target instanceof HTMLInputElement &&
    target.type === 'search' &&
    target.value !== ''
  );
}

/**
 * A submit that the browser would turn into closing this dialog: the
 * submitter's `formmethod`, or else the form's `method`, is `dialog`, and the
 * form belongs to this dialog rather than to a nested one.
 */
function isDialogSubmit(event: FormEvent<HTMLDialogElement>): boolean {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return false;
  if (form.closest('dialog') !== event.currentTarget) return false;
  const submitter = (event.nativeEvent as SubmitEvent).submitter;
  const method =
    submitter?.getAttribute('formmethod') ?? form.getAttribute('method');
  return method?.trim().toLowerCase() === 'dialog';
}

/**
 * Keeps a native modal `<dialog>` controlled by `open`.
 *
 * Every close request (Escape, a platform close request such as Android back,
 * a backdrop press, a `<form method="dialog">` submit) is prevented and
 * becomes one `onClose()` call. The caller answers by setting `open` to
 * false, or keeps it true (for example while a form is saving) and the
 * dialog stays shown without being closed and shown again.
 *
 * Escape is taken at `keydown`, before the browser turns it into a close
 * request: Chromium only lets a page cancel one close request per user
 * activation, so a second Escape would otherwise close the element even
 * though its `cancel` event was prevented. Two closes cannot be prevented: a
 * repeated platform close request whose `cancel` is not cancelable, and an
 * Escape that never reaches the dialog (focus fell to the body). Those are
 * reconciled with `open` after the caller's update, which shows the dialog
 * again only if `open` is still true.
 */
export function useDialogCloseRequests({
  open,
  onClose,
  onCancel,
  onKeyDown,
  onPointerDown,
  onSubmit,
}: CloseRequestOptions) {
  const nodeRef = useRef<HTMLDialogElement | null>(null);
  const openRef = useRef(open);
  // The last `cancel` could not be prevented, so its `close` follows and
  // `onClose` has already been asked.
  const forcedCloseRef = useRef(false);
  const [browserCloses, setBrowserCloses] = useState(0);

  useEffect(() => {
    openRef.current = open;
    const node = nodeRef.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open, browserCloses]);

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    onKeyDown?.(event);
    // A nested control (a menu, a listbox, a tooltip, an inner dialog) or the
    // consumer that used Escape prevents it.
    if (
      event.key !== 'Escape' ||
      event.defaultPrevented ||
      isComposing(event) ||
      clearsSearchField(event)
    ) {
      return;
    }
    event.preventDefault();
    onClose();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    onCancel?.(event);
    // A descendant's own `cancel` (a file picker dismissed from an
    // `<input type="file">` bubbles one) is not a close request for the dialog.
    if (event.target !== event.currentTarget) return;
    const vetoed = event.defaultPrevented;
    event.preventDefault();
    if (!event.cancelable) forcedCloseRef.current = true;
    if (!vetoed) onClose();
  }

  function handleSubmit(event: FormEvent<HTMLDialogElement>) {
    onSubmit?.(event);
    if (event.defaultPrevented || !isDialogSubmit(event)) return;
    event.preventDefault();
    onClose();
  }

  function handleClose(event: SyntheticEvent<HTMLDialogElement>) {
    // A nested dialog's `close` is not this dialog's.
    if (event.target !== event.currentTarget) return;
    const forced = forcedCloseRef.current;
    forcedCloseRef.current = false;
    // Closed by the `open` prop, or a stale event after it opened again.
    if (!openRef.current || nodeRef.current?.open) return;
    if (!forced) onClose();
    setBrowserCloses((count) => count + 1);
  }

  function handlePointerDown(event: PointerEvent<HTMLDialogElement>) {
    onPointerDown?.(event);
    if (!event.defaultPrevented && isBackdropPress(event)) onClose();
  }

  return {
    nodeRef,
    handlers: {
      onCancel: handleCancel,
      onClose: handleClose,
      onKeyDown: handleKeyDown,
      onPointerDown: handlePointerDown,
      onSubmit: handleSubmit,
    },
  };
}
