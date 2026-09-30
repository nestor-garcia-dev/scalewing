---
'@scalewing/react': minor
---

`Field` takes `invalid` (`docs/requests/teisoro-field-validation.md`, 2026-09-30 follow-up, Teisoro F-007-S05 task 1375, DRW-18). `invalid?: boolean` marks the native control invalid, `aria-invalid="true"` and the same danger border as `error` (on a `prefix`/`suffix` frame too, `Mark` in forced colors), without a message of its own, for fields whose one error is shown elsewhere, such as under a group of count fields; the consumer points the control's `aria-describedby` at that message, and it is kept. The field's polite region stays empty and its `description` stays. `error` implies it; like `error` it needs one native control child. Without it nothing changes. No new dependencies.
