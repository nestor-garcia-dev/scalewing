Scalewing request from Teisoro.

Status: requested under Teisoro F-002-S26 task 1145; not implemented. Teisoro ships the composed fallback below meanwhile.
Renderer: react
Missing surface: a full-width, warning-filled notice strip for the page top (Angular's "TEST ENVIRONMENT — Data will NOT affect production" bar: an amber band across the viewport, dark text, a warning glyph, above the app header).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Box` takes only `background="background" | "surface"`, so no Scalewing surface is filled with the warning tone; `Text color="warning"` colours the words only, and `Toast` is transient and positioned over content. A test or local build must be told apart from production at a glance on every page, so the cue should be a filled band, not coloured text on the canvas.
Existing surface this might already be: `Toast` (transient, not a page band); `Badge tone="warning"` (inline, too small for a page cue); the pinned notice requested for the Close day reminder (`teisoro-notice.md`), if it gains a warning fill.
Workaround I almost used: none is allowed; Teisoro owns no colour. Teisoro renders `Box as="aside" padding={2} border` with an `Inline` of a warning `Text` glyph, the label in warning `Text` and the notice (`apps/teisoro-web/src/app/EnvironmentBanner.tsx`).
Teisoro use: `EnvironmentBanner`, shown above every route when the runtime config names a test or local environment (`VITE_ENVIRONMENT_NAME`), never in production.
Proposed API: `Box background="warning"` (or a `Notice tone="warning"` strip) that fills with a warning surface token whose text colour keeps 4.5:1 in light and dark themes.
Behavior and failure boundary: presentation only; the consumer decides when to show it and supplies the copy.

Scalewing owns the token, the class, tests, gallery evidence and changesets. Teisoro owns the copy and when the strip shows.
