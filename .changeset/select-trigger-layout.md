---
'@scalewing/react': patch
---

`Select`'s closed trigger centres its text, ends in the `Accordion` chevron, and keeps its width when the value changes (`docs/requests/teisoro-select.md`, 2026-09-28 trigger follow-up, Teisoro DRW-12). It was sized to the current label, so it jumped when a longer value was chosen; it is now as wide as its longest option, as a native select is, and ellipsizes past the available width. The gradient-triangle caret is replaced by the stroked chevron (shared with `Accordion` through an internal `css/chevron.ts`).

- New generated classes `sw-select-value`, `sw-select-value-text` and `sw-select-value-sizer`. The trigger's text content and accessible value are still only the current label.

A visible change to every `Select`. No API change and no new dependencies.
