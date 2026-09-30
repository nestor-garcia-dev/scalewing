Scalewing request from Teisoro.

Status: merged in #73 (2026-09-28) and released in `@scalewing/react` 1.12.0; Teisoro pins it in F-007-S05 task 1340.
Renderer: react
Surface: `Toast` `tone` and `icon` (new optional props on an existing component; the component itself came from `fantasy-football-toast.md`).
Source: Teisoro UX review `services-drawer-cash-and-audits.md`, finding DRW-14 (polish, the Scalewing part; Teisoro drops its inner `role`).

## Finding

`Toast` is one neutral glass pill with `role="status"`, so "Cash added to the drawer." and "The day is no longer open." look the same, and Teisoro wrapped its message in a second `role="status"` or `role="alert"` to tell them apart, which nests one live region in another and can announce the message twice.

Teisoro use: `apps/teisoro-web/src/app/ServicesDrawerSupport.tsx` (the drawer add, remove and audit results).

## Behavior

- `tone?: 'neutral' | 'success' | 'warning' | 'danger'` (default `neutral`, unchanged; `ToastTone` and `toastTones` exported). A tinted tone sets `--sw-toast-tone` from the matching semantic color and draws the border in it (`sw-toast-success`, `sw-toast-warning`, `sw-toast-danger`). The message keeps `--sw-color-text`.
- `icon?: ReactNode`: a consumer glyph (ADR 0008: Lucide in the consumer) in `.sw-toast-icon`, `aria-hidden`, colored by the tone, before the message in `.sw-toast-body`. Without `icon` the children render as before, unwrapped.
- A `danger` toast is `role="alert"`; the others stay `role="status"`. The consumer drops its own inner role.
- Without `timeoutMs`, a `warning` or `danger` toast stays 6000 ms instead of the 800 ms default, so it can be read (review of PR #73: at 800 ms an error was gone before it could be read). A given `timeoutMs` wins for every tone.
- Forced colors draw the border and icon in `CanvasText`.

## Rejected alternatives

- A danger toast that stays until dismissed (the review's suggestion). A persistent message with a close control is a different surface: `Toast` is on the popover layer with `pointer-events: none` and no focus handling, and a close button inside it would need both. An error the person must act on belongs in the page (the `Notice` in `teisoro-notice.md`, still unbuilt); short of that, warning and danger toasts now default to 6000 ms. Recorded, not built.
- Scalewing-owned glyphs per tone. Scalewing publishes no icon catalog; the consumer passes its Lucide glyph through `icon`.
- Tinting the toast's fill or its text. A tinted glass fill fights the glass language and the warning tone is not guaranteed 4.5:1 as text on every palette; the border and icon mark the tone and the words carry it.

## Evidence

`toast.test.tsx` ("tints a toned toast, shows its icon, and announces danger as an alert", "keeps a neutral toast as it was", "keeps a warning or danger toast 6000 ms by default, and honors timeoutMs": not closed at 800 or 5999 ms, closed at 6000; neutral and success at 800; an explicit 1500 wins); `css/stylesheet.test.ts` (the tone rules and classes); `apps/gallery/e2e/toast.spec.ts` on desktop-en, mobile-es and forced-colors, with the gallery's "Save survey" and "Close the reserve log" toasts: the success toast is a `status` with the success border and icon color and text-colored words, the danger toast is an `alert` with the danger border and is still shown 1.5 s after it opens, and the icon is `aria-hidden`.

## Follow-up request (2026-09-30, Teisoro F-007-S05 task 1375): the page gutter on a phone

Status: merged in #83 (2026-09-30) and released in `@scalewing/react` 1.16.0; Teisoro adopts it next.
Source: Teisoro UX final check `services-drawer-cash-and-audits.md`, finding DRW-29 (polish, owner Scalewing). `es-390/05-the-cash-added.part-2.png`: the green border of "Se agregaron $40.00 al cajón desde la bóveda." runs from about x 1 to x 388 on a 390 px screen.

Teisoro need: every Services toast (`apps/teisoro-web/src/app/ServicesDrawerSupport.tsx` and the other drawer results) keeps the 16 px side gutter its page has on a phone. Teisoro owns no CSS, so it cannot cap the width itself.

Existing surface this might already be: `Toast` itself. `.sw-toast` was `width: max-content` with no cap, so a message wider than the screen ran to its edges (or past them: the gallery's long message started at x −131 on a 390 px screen). `className` or `style` would let Teisoro set a `max-width`, but that is hand-written CSS or spacing invented in JSX in the consumer.

Behavior (no API change): `.sw-toast` gains `max-width: calc(100% - var(--sw-space-4) - var(--sw-space-4))`, spacing step 4 (16 px) on each side, and `overflow-wrap: break-word`. It stays as wide as its message up to that cap and centred, so a short toast is unchanged at every width, and a long one wraps inside the gutter. `100%` is the top layer's containing block, which leaves out a classic scrollbar where `100vw` would not (as `DateField`'s calendar does). A travelling toast (`anchor` and `target`) takes the same cap.

Rejected alternatives:

- A `maxWidth` or `width` prop. No consumer wants a toast that runs to the screen edge; the gutter is the design system's, not the screen's.
- A cap only below `md`. On a desktop the cap only matters for a message wider than the screen, where the gutter is right too; one rule is simpler.
- `calc(100vw - …)`, as `Dialog` has. With a classic scrollbar `100vw` includes it, and the toast would sit under it on the right.
- Capping at a reading measure (such as 40ch). A shorter line changes every existing toast on a desktop; this finding is about the phone's edges only.

Evidence: `toast.test.tsx` ("keeps the page gutter on each side and wraps a long message": the rule's cap and wrapping, still `max-content` and centred); `apps/gallery/e2e/toast.spec.ts` "a long Toast keeps the page gutter on each side and wraps its message" on desktop-en, mobile-es and forced-colors, with the gallery's new "Share field notes" toast: its box starts at least 16 px from the left and ends at least 16 px from the right, centred to a pixel; on a phone the message wraps onto more than one line and the toast is the viewport less 32 px; on a desktop it stays one line, as wide as its words. Without the rule the phone check fails (the toast started at x −131).
