---
'@scalewing/react': patch
---

Field errors are announced politely from a live region instead of as alerts (`docs/requests/teisoro-field-validation.md`, 2026-09-28 follow-up, Teisoro CHK-3 and DRW-6). `Field`'s error was `role="alert"`, so a refused submit with several invalid fields fired one alert per field at once, while a `Checkbox` error beside them was not announced at all.

- `Field`, `Checkbox`, `RadioGroup` and `DateField` keep their error in an `aria-live="polite"` region that is always rendered, empty while there is no error, and swap the error's text into it: a new error is announced once, politely, whether it appears while typing or after a submit. The control lists the region in `aria-describedby` with `aria-invalid` while it has text. An empty region takes no room (`:empty { position: absolute; }`).
- `Field` still shows the error in place of the hint, but the two now have their own ids. `RadioGroup`'s invalid marks key off the fieldset's `aria-invalid`.

Consumer note: a refused submit is now announced politely rather than as several alerts; the form should also move focus to the first invalid control (or to one form-level summary). Tests that found the error by the hint's id should find it by its text. No API change and no new dependencies.
