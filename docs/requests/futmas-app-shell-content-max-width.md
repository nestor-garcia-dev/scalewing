Scalewing request from FutMas.

Status: released in `@scalewing/react` 1.61.0 and `@scalewing/tokens` 1.8.0 for FutMas F-010-S28.
Renderer: react
Missing surface: `AppShell contentMaxWidth`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: At 1570 px FutMas's content is 1266 px wide, so sparse tables stretch and rails reach 406 px. The cap must sit beside the page bar, which the shell owns, without moving it.
Existing surface this might already be: `.sw-container`, which this reuses; a `Box` prop would need each consumer to keep the bars out of it by hand.
Workaround I almost used: a `Box` with `sw-container` inside the shell.
Source: FutMas design review, `docs/features/F-010-web-administration-foundation.in_progress/S28-desktop-layout-and-polish.in_progress/ux-review-2026-11-02.md`.
Proposed API: `contentMaxWidth="container"`, default `none`.
Behavior and failure boundary: `none` renders the same DOM as today. `container` wraps the children of `main` in `sw-container` (72rem, centred) with the page bar outside it, so it stays the full width of `main` and sticky; sticky bars in the page keep sticking at the page's width. An unknown value throws a `RangeError`.

Scalewing owns the classes, tests, gallery evidence and changeset. FutMas owns adopting it, its copy and its pages.
