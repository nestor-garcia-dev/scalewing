Scalewing request from FutMas.

Status: implemented for FutMas F-010-S28; pending release.
Renderer: react
Missing surface: `Text maxLines`, for a long name in a `ContextSwitcher` trigger.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: A league name of three lines in FutMas's sidebar shifts the nav 20 px, and `truncate` keeps one line only. The trigger is the consumer's own node, so `ContextSwitcher` cannot know which words to clamp.
Existing surface this might already be: `Text truncate`, one line.
Workaround I almost used: a clamp in app CSS.
Source: FutMas design review, `docs/features/F-010-web-administration-foundation.in_progress/S28-desktop-layout-and-polish.in_progress/ux-review-2026-11-02.md`.
Proposed API: `<Text maxLines={2}>`, 2 or 3.
Behavior and failure boundary: A generated line clamp: only the drawing is cut, so the words stay in the trigger's accessible name, and the popup shows the name in full. Anything else, or with `truncate`, throws a `RangeError`.

Scalewing owns the classes, tests, gallery evidence and changeset. FutMas owns adopting it, its copy and its pages.
