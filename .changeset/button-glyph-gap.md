---
'@scalewing/react': patch
---

`Button` sets a glyph one token gap from its label (`docs/requests/teisoro-button.md`, 2026-09-30 follow-up, Teisoro F-007-S05 task 1375). `.sw-button` gains `gap: var(--sw-space-2)`, so a glyph and a label passed as the button's own children sit 8 px apart at every size instead of touching. An icon-only button, a visually hidden name (`CalendarButton`) and a label already wrapped in one element with its own gap (`<Inline as="span" gap={2}>`) are unchanged: each is a single flex item, so there is never a second gap, and the wrapper can be dropped. A phrase split across elements (`Save <strong>draft</strong> now`) already drew its parts touching, because each is a flex item whose edge spaces collapse; they are now 8 px apart. Put such a phrase in one element, where its word spaces are kept. No API change and no new dependencies.
