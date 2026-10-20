Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.42.0 (PR #198; accepted 2026-10-19; Teisoro F-014-S03 "Scalewing: file picker, PDF viewer, Markdown view, blue count", task 2610; the training library inventory's row 1 and §2; plan approval under the owner's F-014 delegation of 2026-10-19).
Renderer: react
Missing surface: a second colour for `NavCount`, the accent, for a count that is news rather than work.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the training boards put Training in the top bar with a blue count, what was added since the person last opened it (Teisoro F-014 D-7). `NavCount` is always the danger pill, which says "overdue" next to Tasks; a new document is not overdue. Drawing a blue pill in Teisoro would copy the count pill's CSS.
Existing surface this might already be: `NavCount` (the pill and its naming, in the danger colour only); `Badge` (a status word, not part of a link's name, and not the pill's size).
Workaround I almost used: `Badge tone="accent"` inside the link, the wrong size and not counted in its name the same way.
Teisoro use: `AreaBar`'s Training link on every screen's top bar (S04).
Proposed API (inventory): `tone?: 'danger' | 'accent'` on `NavCount`, default `danger`.

## Accepted API (2026-10-19)

- `NavCount` `tone?: 'danger' | 'accent'` (`NavCountTone`, `navCountTones`), default `danger`, so every existing count is unchanged.
- `accent` adds `sw-nav-count-accent` to the pill (give it a `countLabel`, such as "3 new", so its words say it is news; place it on a neutral or ghost destination): the accent fill with its on-colour figures (4.5:1 in every palette, as a primary Button's label; the accent is at least 3:1 on the canvas and on the glass bar). It is one class more specific than the shared pill rule, so it wins in any order. Size, weight, spacing, the link layout and the name ("Training 3", or `countLabel` in its place) are the danger pill's.
- Forced colours draw the same system-colour edge for either tone: the tone is never the only sign, the count's words say what it is (`countLabel`).
- An unknown `tone` throws a `RangeError`.
- SectionNav's item count keeps the danger pill; it gains a tone only when a consumer asks.
- No new tokens, layers or dependencies. New class `sw-nav-count-accent`.

### Differences from the boards (Teisoro D-2)

- The boards' blue pill is a fixed blue with white figures; Scalewing's is the theme's accent with its on-colour (the `sky` palette's accent in Teisoro).

Evidence: `nav-count.test.tsx` (the default danger class, the accent class on a counted link with its `countLabel`, the generated accent rule, the accent's contrast on the canvas and the glass in every palette, light and dark, the refusal of an unknown tone, the catalog); gallery "Nav" (Field notes with 3 new in the accent beside Tasks 8 and Nests 12 in danger); `apps/gallery/e2e/nav-count.spec.ts` on desktop-en, mobile-es and forced-colors (the accent fill and on-colour figures from the tokens, light and dark, the figures at more than 4.5:1, a different fill from the danger pill, the same height inside its link, the system-colour edge in forced colours, and the name "Field notes 3 new" in Chromium's own accessibility tree).
