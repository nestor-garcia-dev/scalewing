Scalewing request from FutMas.

Status: implemented for FutMas F-010-S28; pending release.
Renderer: react
Missing surface: `PageHeader`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: About 25 FutMas files hand-roll a page's title, subtitle and actions, and the filter row sits in the header on some pages and below it on others.
Existing surface this might already be: `Hero` (a public page's opening at the hero size); `AppHeader` (a sticky frosted bar).
Workaround I almost used: a shared app component composed from Stack and Inline, with its own wrap rules in each consumer.
Source: FutMas design review, `docs/features/F-010-web-administration-foundation.in_progress/S28-desktop-layout-and-polish.in_progress/ux-review-2026-11-02.md`.
Proposed API: `title`, `subtitle`, `back: { label, href, onNavigate }`, `actions`, `below`.
Behavior and failure boundary: Title is the page's `h1` at `heading` 28/34, subtitle `bodySm` muted. The title row wraps as a whole: actions at its end, or under the words when they do not fit beside a 20rem least width. A blank title or back link throws a `RangeError`. A press with a modifier key on the back link keeps the browser's behaviour.

Scalewing owns the classes, tests, gallery evidence and changeset. FutMas owns adopting it, its copy and its pages.
