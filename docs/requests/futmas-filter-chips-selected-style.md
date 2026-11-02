Scalewing request from FutMas.

Status: implemented for FutMas F-010-S28; pending release.
Renderer: react
Missing surface: `FilterChips selectedStyle`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: The selected chip is the heaviest blue in FutMas's product, heavier than the primary button beside it.
Existing surface this might already be: `FilterChips` itself; `SegmentedControl`, a different job.
Workaround I almost used: overriding the chosen chip's fill in app CSS.
Source: FutMas design review, `docs/features/F-010-web-administration-foundation.in_progress/S28-desktop-layout-and-polish.in_progress/ux-review-2026-11-02.md`.
Proposed API: `selectedStyle="subtle"`, default `solid`.
Behavior and failure boundary: `accentSubtle` fill, an accent edge, and the accent's ink: the accent mixed 30% toward the text colour, as a Notice's words are, because the bare accent is 4.24:1 on the tint in harvest dark and the ink keeps 4.5:1 in every palette. Forced colours keep Highlight and an error keeps its danger edge. An unknown value throws a `RangeError`.

Scalewing owns the classes, tests, gallery evidence and changeset. FutMas owns adopting it, its copy and its pages.
