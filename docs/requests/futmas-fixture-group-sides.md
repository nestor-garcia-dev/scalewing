Scalewing request from FutMas.

Status: released in `@scalewing/react` 1.61.0 and `@scalewing/tokens` 1.8.0 for FutMas F-010-S28.
Renderer: react
Missing surface: `FixtureGroup sides`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: The scoreline jumps between views (x about 425, 540 and 710) because the sides are `minmax(0, 1fr)`.
Existing surface this might already be: `FixtureGroup`'s shared grid, which lines rows up within one run but not across runs.
Workaround I almost used: fixed widths on the rows' names in app CSS.
Source: FutMas design review, `docs/features/F-010-web-administration-foundation.in_progress/S28-desktop-layout-and-polish.in_progress/ux-review-2026-11-02.md`.
Proposed API: `sides="fixed"`, default `fluid`.
Behavior and failure boundary: From `md`: sides `minmax(0, 16rem)`, end column `1fr`, and the centre at least 7rem (`minmax(7rem, auto)`), since an `auto` centre differs between a run of scores and a run of times and would move them apart. Below `md` the narrow rules stand. Without subgrid each row takes the same fixed columns. A run with a `select` starts one box later. An unknown value throws a `RangeError`.

Scalewing owns the classes, tests, gallery evidence and changeset. FutMas owns adopting it, its copy and its pages.
