Scalewing request from Teisoro.

Status: implemented on `claude/services-ux-fixes` for Teisoro F-007-S05 task 1335; pull request pending review.
Renderer: react
Surface: `Badge` inside a filled `Button`. No new prop.
Source: Teisoro UX review `services-nsf.md`, finding NSF-1 (major, WCAG 1.4.3), the Scalewing part for badges. The toggle button's fade is `teisoro-button.md`.

## Finding

Every `Badge` tone but `neutral` has `background: transparent`, and `neutral` a translucent glass fill, so a badge inside a filled button draws its tone on the button's fill. On Teisoro's selected risk-management party row (a `primary` button) the orange "2 NSF" badge measured 1.1:1 against the accent and nearly disappeared.

Teisoro use: `apps/teisoro-web/src/app/risk/RiskEntityColumn.tsx` (`PartyButton`: a `Button` with the party's name, an NSF count `Badge` and a status `Badge`).

## Behavior

A badge inside a `primary`, `secondary`, `tertiary` or `danger` button takes `background: var(--sw-color-surface)` and `color: var(--sw-color-text)`: its words are in the text color, at least 4.5:1 on the surface in every palette and scheme, and its tone stays on its 1 px border, at least 3:1 on the surface in every palette and scheme (3.29:1 at the lowest, `mocha` dark danger). The rule is generated from `buttonVariants` less `ghost`, which has no fill. In forced colors the badge follows the system colors like any other; the pressed button no longer opts out of them (`teisoro-button.md`).

The first version of this change (review of PR #73) kept the tone on the badge's words, which some palettes cannot carry at 4.5:1 on the surface: `harvest` light warning 4.35:1, `harvest` dark accent 4.24:1 and danger 3.53:1, `mocha` dark danger 3.29:1, `sunburst` dark danger 4.11:1. It also added a forced-colors opt-back that the button fix made unnecessary.

No API change.

## Rejected alternatives

- An `inverse` badge tone for filled buttons (the review's other option). Every consumer would have to know when a badge sits on a fill and pick it; the context is known to the stylesheet.
- Recoloring the badge in `onAccent`. The five tones would all turn one color on the selected row, and the status the tone carries (warning, good) would be lost exactly where the row is chosen.

## Note on palettes

The status tones (`success`, `warning`, `danger`) are held to 4.5:1 on the default palette's surface and background (unit test in `data.test.tsx`), but some named palettes fall below it on either (for example `harvest` light warning 3.96:1 on the background and 4.35:1 on the surface). That is a palette issue for every badge on a card; inside a filled button the words no longer depend on it.

## Evidence

`css/stylesheet.test.ts` (the generated rule, no forced-colors opt-back); `data.test.tsx` ("reads at 4.5:1 inside a filled button, its tone border at 3:1, in every palette": the text color on the surface and each tone on the surface for every palette × light and dark, from `createTheme`; and a badge nested in a button); `apps/gallery/e2e/badge.spec.ts` "a Badge inside a filled button sits on the surface and keeps its contrast" on desktop-en, mobile-es and forced-colors, with the gallery's "Nesting site" toggle buttons: the warning and success badges are at least 4.5:1 against the painted background on the pressed `primary` and the `secondary` button, their background is opaque, their words are in the text color and the warning badge's border in the warning color. With the rule removed the same check measures the warning badge on the accent at 1.13:1, as the review did.
