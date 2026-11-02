Scalewing request from FutMas.

Status: released in `@scalewing/react` 1.61.0 and `@scalewing/tokens` 1.8.0 for FutMas F-010-S28.
Renderer: react
Missing surface: `DescriptionList termWidth`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `fit-content(40%)` sets each list's values at a different x, as on FutMas's Rules page (462, 394, 981, 997).
Existing surface this might already be: `DescriptionList layout`, which has no fixed column.
Workaround I almost used: a `style` on the list's columns.
Source: FutMas design review, `docs/features/F-010-web-administration-foundation.in_progress/S28-desktop-layout-and-polish.in_progress/ux-review-2026-11-02.md`.
Proposed API: `termWidth`: `sm` 8rem, `md` 12rem, `lg` 16rem, a named scale as the repo's other widths are.
Behavior and failure boundary: From `md`: `min(<width>, 50%) minmax(0, 1fr)`, so a narrow card keeps room for its details; a longer term wraps. Below `md` a term still sits over its detail. Only with `layout="columns"`; an unknown width or `spread` throws a `RangeError`.

Scalewing owns the classes, tests, gallery evidence and changeset. FutMas owns adopting it, its copy and its pages.
