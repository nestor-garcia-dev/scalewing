Scalewing request from Teisoro.

Status: implemented in this checkout for a `@scalewing/react` minor (changeset `teisoro-dialog-close-and-menu-focus`); not yet published.
Renderer: react
Missing surface: none. A behavior fix to `Dialog`: `open` alone decides whether the native `<dialog>` is shown.
Source: Teisoro owner review, "Scalewing follow-ups" (nestor-garcia-dev/teisoro PR 3).

Problem: `Dialog` is controlled by `open`, but Escape let the browser close the native element itself and then reported it through `onClose`. A consumer that keeps `open` true (a form that is saving, so its answer shows in the dialog) was left holding a dialog the browser had closed. Cancelling the native `cancel` event is not enough: Chromium lets a page cancel one close request per user activation, so a second Escape fires a `cancel` that cannot be prevented and closes the element. Teisoro's `GuardedDialog` (`apps/teisoro-web/src/app/drawer-support/dialog-shell.tsx`) worked around it by calling `showModal()` again after the browser closed the dialog, which announces the dialog a second time.

Behavior now:

- Every close request is prevented and asks `onClose()`; none closes the element: Escape (taken at `keydown` inside the dialog, before the browser makes it a close request), a platform close request (`cancel`, prevented), a backdrop press on the dialog element itself, and a `<form method="dialog">` submit or a submitter with `formmethod="dialog"` (`submit`, prevented).
- `open` decides. Kept true, the dialog stays shown without being closed and shown again.
- `onClose` is not called when `open` turns false. This is the one behavior change for consumers; the release is a minor with a migration note.
- A nested control that handles Escape and prevents it (a menu, a listbox, a visible `Tooltip`, an inner dialog) keeps it; the dialog does not also ask to close. Escape typed into an input method (`isComposing`, or Safari's `keyCode` 229) is left alone.
- A consumer `onKeyDown`, `onCancel`, `onSubmit` or `onPointerDown` that prevents the event vetoes that request: `onClose` is not called.
- Escape in a `type="search"` field that holds text is left to the browser, which clears the field; the next Escape asks to close.
- Only the dialog's own `cancel` and `close` count. A bubbling `cancel` from a descendant (a file picker dismissed from `<input type="file">`) or a nested dialog's events are not close requests for the outer dialog.
- A press on a nested dialog's backdrop or on a popover that overflows the box targets a descendant and is not a backdrop press for this dialog.
- Two closes cannot be prevented: a repeated platform close request whose `cancel` is not cancelable, and an Escape that never reaches the dialog because focus fell to the body. Then the dialog asks `onClose` once and, after the consumer's update, shows it again only if `open` is still true. That re-show is the one case that can announce the dialog twice.
- `onClose` stays required. A dialog that must not be dismissed passes a callback that keeps `open` true.

Teisoro can drop the `onCancel` and re-show code from `GuardedDialog` and keep only its busy check in `onClose` once it pins the release.
