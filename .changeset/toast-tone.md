---
'@scalewing/react': minor
---

`Toast` takes `tone` and `icon` (`docs/requests/teisoro-toast.md`, Teisoro DRW-14):

- `tone?: 'neutral' | 'success' | 'warning' | 'danger'` (default `neutral`, unchanged) tints the toast's border and icon; the message keeps the text color. A `danger` toast is `role="alert"`, the others `role="status"`. `ToastTone` and `toastTones` are exported.
- `icon?: ReactNode` puts a consumer glyph, hidden from assistive technology, before the message. Without it the children render unwrapped, as before.
- New generated classes `sw-toast-success`, `sw-toast-warning`, `sw-toast-danger`, `sw-toast-row`, `sw-toast-icon` and `sw-toast-body`.

Without `timeoutMs`, a `warning` or `danger` toast now stays 6000 ms instead of 800 ms, so it can be read; `neutral` and `success` keep 800 ms, and a given `timeoutMs` wins. A toned toast still dismisses itself. No breaking change and no new dependencies.
