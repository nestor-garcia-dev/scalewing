Scalewing request from FutMas.

Status: implemented for FutMas F-010-S28; pending release.
Renderer: react
Missing surface: `Grid rail`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas's Build, Review, Standings and Overview pages use `columns={3}` with a span, so a side rail grows with the window (406 px at 1570).
Existing surface this might already be: `Grid columns` (equal columns) and `Split` (a draggable pane).
Workaround I almost used: a fixed `style` with `gridTemplateColumns`.
Source: FutMas design review, `docs/features/F-010-web-administration-foundation.in_progress/S28-desktop-layout-and-polish.in_progress/ux-review-2026-11-02.md`.
Proposed API: `<Grid rail="lg" gap={4}>` with the main column first and the rail second; `rail` takes `md` or `lg`, from which the two sit side by side.
Behavior and failure boundary: `minmax(0, 1fr) 20rem` from the breakpoint and one column below it. Not with `columns`, `columnsBelow` or `fit` (a `RangeError`, as `fit` already does); a child's `columnSpan` is ignored, as in a fitted grid.

Scalewing owns the classes, tests, gallery evidence and changeset. FutMas owns adopting it, its copy and its pages.
