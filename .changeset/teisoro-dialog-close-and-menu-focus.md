---
'@scalewing/react': minor
---

`Dialog` is now fully controlled by `open`. Escape, a platform close request,
a backdrop press and a `<form method="dialog">` submit (the form's `method` or
the submitter's `formmethod`) are each prevented and ask `onClose()`; none of
them closes the native `<dialog>` itself. A dialog whose consumer keeps `open`
true (for example while a form is saving) stays shown, including on a repeated
Escape in Chromium. A consumer `onKeyDown`, `onCancel`, `onSubmit` or
`onPointerDown` that prevents the event vetoes that request (`onPointerDown`
used to be dropped). Escape in a search field that holds text clears the field
first, and a descendant's own `cancel` (a dismissed file picker) is not a close
request. A backdrop press counts only on the
dialog element itself, so a nested dialog's backdrop or an overflowing popover
does not close the outer dialog. See `docs/requests/teisoro-dialog-close.md`.

`Tooltip` now prevents the Escape it uses while it is visible, so one Escape
hides a tooltip inside a `Dialog` without also closing the dialog.

`ActionMenu` returns focus to its trigger before running a selected command,
as Escape already did, so a `Dialog` opened from a command returns focus to
the trigger when it closes (`docs/requests/teisoro-action-menu.md`).

Behavior change: `Dialog` no longer calls `onClose` when `open` turns false
(it used to echo the native `close` event). Migration: if you ran cleanup in
`onClose` after setting `open` to false yourself, run it where you set `open`
to false.

No prop or type is added or removed.
