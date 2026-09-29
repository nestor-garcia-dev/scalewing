---
'@scalewing/react': patch
---

A pressed toggle `Button` keeps its label readable in forced colors (`docs/requests/teisoro-button.md`, 2026-09-28 follow-up; a regression from 1.12.0). The `Highlight` fill with `HighlightText` is gone: Chromium paints the forced backplate behind a button's text in `Canvas`, which erased the label (1.00:1 painted). The pressed button now keeps the forced button colors, so its label, glyphs and badges stay readable, and it is marked by the same 2 px ring as outside forced colors, drawn as a `Highlight` border on an out-of-flow `::after`, with a `Highlight` border on the button itself. No `forced-color-adjust`, no API change and no new dependencies.
