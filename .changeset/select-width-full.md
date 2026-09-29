---
'@scalewing/react': minor
---

`Select` takes `width?: 'content' | 'full'` (`docs/requests/teisoro-select.md`, 2026-09-29 follow-up). `'content'`, the default, is today's field, as wide as its longest option; nothing changes for existing Selects. `'full'` adds the generated `sw-select-full` class: the field and its trigger fill the container's inline size in a `Stack`, a `Grid` cell or a narrow column, and in an `Inline` row they take the space the siblings leave (`.sw-inline > .sw-select-full { flex: 1 1 0; min-width: 0 }`), so a `Button` beside it keeps its label on one line. The value still ellipsizes, the chevron stays at the inline end (left to right and right to left), and the open list is exactly the trigger's width, so a long option wraps inside it, even a single long word (`overflow-wrap: anywhere`), instead of running past a phone's edge or scrolling sideways. New exported type `SelectWidth`. No new dependencies.
