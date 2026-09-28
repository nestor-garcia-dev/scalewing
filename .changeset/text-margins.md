---
'@scalewing/react': patch
---

`Text` drops the browser's paragraph and heading margins (`docs/requests/teisoro-text.md`). Its `p` and `h1`–`h4` elements kept about 1em of margin above and below, which a flex `Stack` or `Inline` adds to its `gap`. A generated `:where(.sw-text-*) { margin: 0; }` rule removes it at zero specificity, so an authored margin (`sw-sr-only`, a consumer class) still wins.

Visual change: text in a `Stack` or `Inline` sits at the `gap` the page asked for, so dialog titles, section headings and card text are tighter. A page that needs more space raises its `gap`. No API change and no new dependencies.
