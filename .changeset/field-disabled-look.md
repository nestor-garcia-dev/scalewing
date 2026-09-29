---
'@scalewing/react': patch
---

A disabled text control looks locked (`docs/requests/teisoro-field-disabled.md`, Teisoro DRW-17). A disabled native `input`, `select` or `textarea` on the canvas, `Field`'s adorned frame and `DateField`'s entry take the subtle fill, a dashed border and `cursor: not-allowed`; the value stays in the text color at full opacity (4.5:1 or more in every palette), and forced colors keep the dashed border in `GrayText`. `DateField`'s entry no longer fades to the disabled opacity; its calendar button still does. Every typed input's placeholder is now drawn in `--sw-color-muted` (4.5:1 or more on every palette's field fill) instead of the browser's fixed gray, which fell to 2.3:1 on dark fields. No API change and no new dependencies.
