Scalewing request from FutMas.

Status: accepted 2026-10-24 (FutMas F-010 "admin web", with `AppShell`, `docs/requests/futmas-app-shell.md`; FutMas's calm colour rule: amber means "needs you", red is destructive).
Renderer: react
Missing surface: a `warning` tone for the shared count pill: `NavCount` `tone="warning"`, and an `AppShell` item's `countTone`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the count pill is always the danger red (or the accent for news). FutMas counts work that needs the league manager, such as scores to confirm, which is not an error or anything destructive; its semantic colour rule draws that amber. A `Badge tone="warning"` is not a count pill and is not read in a destination's name, and FutMas owns no CSS to retint the pill.
Existing surface this might already be: `NavCount` `tone` (`danger`, `accent`); `Badge tone="warning"`; the warning tint of `Notice` and `FilterChips` `tone="warning"`.
Workaround I almost used: `tone="accent"`, which says "news", not "needs you".
FutMas use: the admin sidebar's "Scores" destination, "2 to confirm".
Proposed API: `navCountTones` gains `warning`; `AppShellNavItem.countTone?: NavCountTone`.

## Accepted API (2026-10-24)

- `navCountTones` is `['danger', 'accent', 'warning']`. `tone="warning"` (class `sw-nav-count-warning`) draws the pill as the warning tint (the warning colour 10 % into the surface) with the warning ink (the warning colour 70 % toward the text colour), a warning Notice's pair, which keeps the figures at 4.5:1 on the tint in every palette and scheme (`nav-count.test.tsx`), inside a 1 px warning edge (a warning Badge's, 3:1 on the surface). Its size, spacing and name are the pill's. Forced colours draw its edge as every pill's.
- `AppShellNavItem.countTone?: NavCountTone`, default `danger` (class `sw-app-shell-count-warning` or `-accent`). An unknown tone, or a tone without a `count`, throws a `RangeError`.
- The tone modifiers of both pills come from one rule (`css-count-pill.ts`, `countToneClass`). `SectionNav` items are unchanged.
- Additive: the default stays danger and nothing else changes. No new tokens or dependencies.
