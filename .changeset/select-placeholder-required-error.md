---
'@scalewing/react': minor
---

`Select` takes `placeholder`, `required` and `error` (`docs/requests/teisoro-select.md`, 2026-09-28 placeholder follow-up, Teisoro DRW-12), consistent with `Field`:

- `placeholder?: string` shows in the closed trigger, muted, while `value` matches no option (such as `''`). It is not an option, never becomes the value, and counts toward the trigger's width. A blank placeholder throws a `RangeError`.
- `required?: boolean` marks the label with `Field`'s `aria-hidden` asterisk and sets `aria-required` on the trigger.
- `error?: string` renders a `sw-field-error` message under the control, linked by `aria-describedby`, with `aria-invalid` and a danger border. Like `Field`'s, it is announced from a polite live region that is always rendered, never as an alert; an empty string is no error.
- New generated classes `sw-select-placeholder` and `sw-select-invalid`.

Without the new props nothing changes. No new dependencies.
