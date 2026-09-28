---
'@scalewing/react': patch
---

A zero-count `FilterChips` chip is quiet without fading (`docs/requests/teisoro-filter-chips.md`, 2026-09-28 follow-up, Teisoro NSF-1, WCAG 1.4.3). Its face had `opacity: var(--sw-quiet-opacity)` (0.55), about 3.8:1 for its label; it now drops the glass fill and sets its label in `--sw-color-muted` (4.5:1 or more in every palette). In forced colors it is drawn like the other chips instead of in `GrayText`.

No API change and no new dependencies.
