---
'@scalewing/react': minor
---

`FilterChips` `required`, `error` and `aria-describedby`, and `value: ''` for nothing chosen yet (`docs/requests/teisoro-filter-chips-validation.md`, Teisoro F-011 release R4):

- `required`: each radio `required` and the required mark after the label.
- `error`: a polite message under the chips linked by `aria-describedby`, the group `aria-invalid`, and every chip's edge in danger (`Mark` in forced colors).
- `aria-describedby`: consumer description ids, before the error.
- `value` may be `''` (nothing chosen); a value that is neither `''` nor an option still throws a `RangeError`.
- New class `sw-filter-chips-error`. No new tokens or dependencies.
