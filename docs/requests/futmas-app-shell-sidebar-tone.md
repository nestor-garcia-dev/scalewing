Scalewing request from FutMas.

Status: implemented for FutMas F-010-S28; pending release.
Renderer: react
Missing surface: `AppShell sidebarTone`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Hairlines on white read as a wireframe; the review asks for the sidebar on `--sw-color-subtle` to give structure.
Existing surface this might already be: none.
Workaround I almost used: overriding the sidebar's background in app CSS.
Source: FutMas design review, `docs/features/F-010-web-administration-foundation.in_progress/S28-desktop-layout-and-polish.in_progress/ux-review-2026-11-02.md`.
Proposed API: `sidebarTone="subtle"`, default `surface`.
Behavior and failure boundary: The sidebar and the drawer on the subtle fill. Text, muted captions, and the text colour on the hover and current fills keep 4.5:1 in every palette and scheme (tested). An unknown value throws a `RangeError`.

Scalewing owns the classes, tests, gallery evidence and changeset. FutMas owns adopting it, its copy and its pages.
