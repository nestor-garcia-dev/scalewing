---
'@scalewing/react': minor
---

`Toast` `title`, `action`, `showRemaining` and `placement` (with `ToastAction`, `ToastPlacement` and `toastPlacements`): a corner card that confirms a save (`docs/requests/teisoro-toast-action.md`, Teisoro F-011 release R2).

- `title`: a bold first line; the children become a muted detail.
- `action: { label, onPress }`: a ghost small Button at the end; it runs `onPress`, then closes the toast.
- `showRemaining`: a thin `aria-hidden` line that runs down over the toast's duration.
- `placement: 'bottom' | 'top-end'` (default `bottom`, unchanged).
- A toast with an action or the line takes the pointer, and its time is held while the pointer or focus is on it. A plain toast is unchanged and stays click-through.
- A travelling toast (`anchor` and `target`) ignores `placement` and `showRemaining`. When the toast closes with focus inside, focus returns to where it came from.
- `title` is now the toast's bold first line and is no longer forwarded to the element as the HTML `title` attribute.
- A blank `title` or `action.label`, a missing `onPress`, or an unknown `placement` throws a `RangeError`.
- New generated classes `sw-toast-title`, `sw-toast-detail`, `sw-toast-action`, `sw-toast-interactive`, `sw-toast-top-end`, `sw-toast-remaining` and `sw-toast-paused`. No new tokens or dependencies.
