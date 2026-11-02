Scalewing request from FutMas.

Status: released in `@scalewing/react` 1.61.0 and `@scalewing/tokens` 1.8.0 for FutMas F-010-S28.
Renderer: react
Missing surface: `TabItem` `count`, `countLabel`, `countTone`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas's Schedule needs a tab like "Postponed (4)" with an amber count while games need a time.
Existing surface this might already be: `TabItem.label`, a node that could hold `NavCount`, but the tab did not lay a pill out beside its words.
Workaround I almost used: a `NavCount` in the label, its alignment left to the text line.
Source: FutMas design review, `docs/features/F-010-web-administration-foundation.in_progress/S28-desktop-layout-and-polish.in_progress/ux-review-2026-11-02.md`.
Proposed API: `{ id, label, count, countLabel, countTone }`, the names AppShell's items and ContextSwitcher's options use.
Behavior and failure boundary: The shared count pill after the words, read in the tab's name. 0 shows none. `countLabel` or `countTone` with no `count`, or a count that is no whole number, throws a `RangeError`. A count with nothing to do stays in the label's words ("Postponed (4)").

Scalewing owns the classes, tests, gallery evidence and changeset. FutMas owns adopting it, its copy and its pages.
