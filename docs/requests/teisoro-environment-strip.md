Scalewing request from Teisoro.

Status: requested under Teisoro F-002-S26 task 1145; released as `Notice variant="band"` in `@scalewing/react` 1.28.0 (PR #120; Teisoro F-011-S03, release R2 "feedback", item 6; the redesign inventory's row 1). Teisoro replaces `EnvironmentBanner`'s composed fallback with it.
Renderer: react
Missing surface: a full-width, warning-filled notice strip for the page top (Angular's "TEST ENVIRONMENT — Data will NOT affect production" bar: an amber band across the viewport, dark text, a warning glyph, above the app header).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Box` takes only `background="background" | "surface"`, so no Scalewing surface is filled with the warning tone; `Text color="warning"` colours the words only, and `Toast` is transient and positioned over content. A test or local build must be told apart from production at a glance on every page, so the cue should be a filled band, not coloured text on the canvas.
Existing surface this might already be: `Toast` (transient, not a page band); `Badge tone="warning"` (inline, too small for a page cue); the pinned notice requested for the Close day reminder (`teisoro-notice.md`), if it gains a warning fill.
Workaround I almost used: none is allowed; Teisoro owns no colour. Teisoro renders `Box as="aside" padding={2} border` with an `Inline` of a warning `Text` glyph, the label in warning `Text` and the notice (`apps/teisoro-web/src/app/EnvironmentBanner.tsx`).
Teisoro use: `EnvironmentBanner`, shown above every route when the runtime config names a test or local environment (`VITE_ENVIRONMENT_NAME`), never in production.
Proposed API: `Box background="warning"` (or a `Notice tone="warning"` strip) that fills with a warning surface token whose text colour keeps 4.5:1 in light and dark themes.
Behavior and failure boundary: presentation only; the consumer decides when to show it and supplies the copy.

Scalewing owns the token, the class, tests, gallery evidence and changesets. Teisoro owns the copy and when the strip shows.

## Accepted API (2026-10-11, Teisoro F-011-S03)

Every F-011 app board (about 85) opens with an amber band across the page above the area bar: 28 high, "**Local development** Nothing here reaches the live store." centered in 12/16 type, the warning ink on the warning tint. It is a variant of `Notice` (`teisoro-notice.md`) rather than a new `EnvironmentStrip` component: the same tones, fill, ink, title and message, only the shape differs, and a second surface would duplicate them.

- `Notice` `variant?: NoticeVariant` (`'default' | 'band'`, `noticeVariants` exported). `band` is square, the full width of its container, at least the `xs` control height (28), `space-1` × `space-4` padding, caption type (13/18), its title and message centered on one line that wraps on a phone. The fill and ink are the tone's, as for every notice, so the 4.5:1 claim is the same.
- A band is page chrome: its role defaults to `none` (no live region, so it is not announced on every page), unless the consumer passes `role`. Forced colors draw a rule under it.
- The consumer places it first on the page, decides when it shows (never in production) and supplies the copy; `tone="warning"` for an environment strip.
- Failure boundary: an unknown `variant` throws a `RangeError`, besides the `Notice` checks.
- Sizes on Scalewing's scale (Teisoro D-2): height 28 (board 28), caption 13/18 (board 12/16), the warning tint mixed at 10% (the board's band, `#FDEBD3`, is a little stronger than its notes, `#FDF3E6`; Scalewing uses one tint for both). No glyph on the board; `icon` stays available. Generated class `sw-notice-band`.

Evidence: `notice.test.tsx` ("draws a band as page chrome": classes, no role by default, a given role, an unknown variant; the generated band rules); gallery "Notice" (the "Field station" band first); `apps/gallery/e2e/notice.spec.ts` on desktop-en, mobile-es and forced-colors (no role, square corners, caption size, full column width, at least 28 high, words centered, 4.5:1).
