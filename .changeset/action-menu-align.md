---
'@scalewing/react': minor
---

`ActionMenu` takes `align?: 'start' | 'end'` (default `'start'`, unchanged; type `ActionMenuAlign`) (`docs/requests/teisoro-action-menu.md`, 2026-09-28 align follow-up, Teisoro ENT-13). With `'end'` the open menu lines up with the trigger's inline end even where the start would fit, so a menu opened from the end of a card stays over that card instead of hanging past it toward the next one. It still takes the trigger's other edge when the preferred one would leave the screen, mirrored in right-to-left.

No breaking change and no new dependencies.
