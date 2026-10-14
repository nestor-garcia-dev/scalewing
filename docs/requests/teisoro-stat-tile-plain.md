Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.40.0 (PR #184; accepted 2026-10-14; Teisoro F-012-S05, release M3 "periods, lists and figures", item 4; the manager views inventory's row 5; plan approval under Teisoro decisions O-1, D-1 and D-9).
Renderer: react
Missing surface: `StatTile` `appearance="plain"`, a figure with no card surface, so it fits inside a card.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: every report opens with its answer in one card: the question in grey, a dot and the answer line, then four figures in a row with hairlines between them ("Expected in the store", its amount, then "From <day>'s <amount> and every move since"; "In the store, Mon night"; "Off"; "Off, last 13 weeks"); on a phone the four sit two by two. `StatTile` already draws a label, a toned tabular value and a caption, but always on its own bordered surface with padding, so four tiles inside the answer card would be cards in a card. Rebuilding the label, value and caption from `Text` in Teisoro would copy StatTile's type and tone mapping.
Existing surface this might already be: `StatTile` (the figure, but always a card); `DescriptionList` (terms beside details, not a figure); `ActionBar` `summary` (a figure in a bar).
Workaround I almost used: three `Text`s per figure in a Teisoro `Figure` component.
Teisoro use: `ReportAnswer` (F-012 composite) on every report and on a day.
Proposed API (inventory): `StatTile` `appearance="plain"` (no card, for figures inside a card). The hairlines come from `Grid` and `Separator orientation="vertical"`.

## Accepted API (2026-10-14)

- `StatTile` gains `appearance?: 'card' | 'plain'` (`StatTileAppearance`, `statTileAppearances`), default `card` (unchanged).
- `plain` adds `sw-stat-tile-plain`: no background, border, radius or padding, and the glyph and body aligned to the top (`align-items: flex-start`), so the figure sits on the card around it, inset by that card's padding. The label, value (tone included), caption and glyph are unchanged.
- A plain tile cannot be `emphasis="primary"` (the primary look is a fill, and a plain tile has no surface): that, or an unknown appearance, throws a `RangeError`.
- The row's hairlines are composed, not built in: a `Grid` (`columns={4}`, `columnsBelow={{ md: 2 }}`) of cells that put a decorative vertical `Separator` before every tile but the first, in an `Inline align="stretch"`, the one that would start a phone's second row hidden below `md` (`Inline hideBelow="md"`). The gallery shows it.
- No new tokens, layers or dependencies. New class `sw-stat-tile-plain`.

### Differences from the boards (Teisoro D-2)

- The boards' labels are 12 px grey; StatTile's label is the label variant (15 px) in the muted colour, and its value the heading variant, as every StatTile.
- On a phone the board draws a hairline above each pair; the gallery composes the vertical hairline between the two of a row instead. Teisoro may add a horizontal `Separator` per row if its board needs it.

No board figures are quoted here: the boards hold the owner's store data and this repository is public.

Evidence: `stat-tile-plain.test.tsx` (card by default and plain on request with its parts and tone unchanged, refusals, the generated rule and catalog); the existing `data.test.tsx` StatTile tests unchanged; gallery "StatTile" (four plain answers in a card with hairlines between, two by two on a phone, in light and dark); `apps/gallery/e2e/stat-tile.spec.ts` on desktop-en, mobile-es and forced-colors (no surface, edge or padding, inset by the card, four in a row with three hairlines on a desktop, two by two with one hairline per row and no sideways scroll at 390 px, and in the dark theme the toned values at 4.5:1 or more).
