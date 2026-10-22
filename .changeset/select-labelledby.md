---
'@scalewing/react': minor
---

`Select` `aria-labelledby`: in place of `label`, the id of words the page already draws, such as a label above a choice that is a `SegmentedControl` on a wide screen and a `Select` on a phone. The select then draws no label of its own, so a screen reader meets the words once instead of the page's words followed by the select's hidden copy; the trigger and its open list are named by them. `required` still sets `aria-required` and draws no mark. `label` and `aria-labelledby` are exclusive (a type union, and a `RangeError` for neither, a blank id, both, or `requiredMark` with `aria-labelledby`). A select with `label` renders exactly as before. No new classes, tokens or dependencies. Request: `docs/requests/teisoro-select-labelledby.md`.
