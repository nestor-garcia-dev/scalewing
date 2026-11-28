Scalewing request from Teisoro.

Status: in implementation on branch `teisoro/counter-tiles` (requested 2026-11-28; Teisoro F-010 "counter PIN switching", S10 acceptance review, Q-4 "the name buttons' height"; an extension of S11 "Scalewing pieces"). Not released yet.
Renderer: react
Missing surface: two options on the existing `ListGroup`: `size="lg"`, rows at least 56 px tall, and `variant="tiles"` together with `maxHeight`, the grid of tiles scrolling inside its panel.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the counter's "Who's working?" board draws each person's name as a pressable tile 56 px tall, three across, the grid scrolling in a panel past 12 names. A pressable `ListRow` is 44 px on a coarse pointer (plus the tile's border) and as tall as its words on a fine one, and `ListGroup` refused `tiles` with `maxHeight` (a `RangeError`), so Teisoro falls back to a one-column scrolling list past 12 names. Teisoro owns no CSS.
Existing surface this might already be: `ListGroup` `variant="tiles"` and `maxHeight` (each alone); a `Grid` of `Button`s (not a list, no 56 px size).
Workaround I almost used: a one-column bounded `ListGroup` past 12 names, shipped as the interim.
Teisoro use: `counter/WhoIsWorking`, the names as `size="lg"` tiles, `maxHeight={{ rows: 4 }}` past 12. Every later lane screen (CAP-02) needs the same piece.

## Why tiles refused `maxHeight`, and what it took

The refusal (`teisoro-list-group-tiles.md`, 1.46.0) read "tiles neither scroll as rows nor add up to a total". There was a real reason under it, three in fact, none of them virtualisation (Scalewing has none) or focus order:

- **The tile rules did not reach a bounded list.** Every tile rule was written for the group's own list (`.sw-list-group-tiles > .sw-list`). A bounded group's list sits in its scroll region, one level down, so removing the guard alone gave a plain one-column list with no panels. The tile rules now name both lists (`tileList` in `css-list-tiles.ts`: a selector list, so each keeps the specificity it had alone and the existing order still decides).
- **The height counted rows, not rows of tiles.** `maxHeight: { rows }` is `rows × (a title and one detail line + the 1 px hairline)`. Tiles have two hairlines each and a space-3 gap between rows. The bounded tiles' height is `rows × (counted row + 2 px) + (rows − 1) × space-3` (`css-list-tiles-bounded.ts`), so `rows` counts rows of tiles; below `md`, one tile a row, it counts tiles.
- **The scroll shade was drawn under the rows.** A bounded list shades an edge with more past it by a background gradient on the region, painted under its transparent rows. Tiles are opaque panels, so it would be hidden except in the gaps. A bounded grid of tiles draws its shade over them instead: the region's `::before` and `::after`, each a space-5 strip pulled out of the flow by an equal negative margin (no tile moves), `position: sticky` at the region's top and bottom, `pointer-events: none`, a gradient only while `ScrollRegion` marks that edge (`sw-scroll-more-top`, `sw-scroll-more-bottom`). The list-of-rows shade is narrowed to groups that are not tiles. Forced colours draw no shade (the system's scrollbar is the cue); printed, every tile shows.

Focus: the tiles are in DOM order, row by row, so Tab reads them in their visual order and the region stays the one named keyboard stop before them, as it is for a bounded list. A focused tile is scrolled into view by the browser; `scroll-padding-block: space-5` keeps that scroll a shade's depth from either edge, so the tile and its inset ring are never under the shade. A footer stays refused on tiles: they do not add up to a total.

## Accepted API (2026-11-28)

New exports: `listGroupSizes`, `ListGroupSize`. New class: `sw-list-group-lg`. No new tokens, layers or dependencies.

```ts
type ListGroupSize = 'md' | 'lg';
type ListGroupProps = {
  // …as before, plus:
  /** `md` (default): rows as tall as their words; `lg`: at least 56 px on every pointer, words centred. */
  size?: ListGroupSize;
  /** Now also with `variant="tiles"`: counts rows of tiles, the grid scrolling in the named region. */
  maxHeight?: ListGroupMaxHeight;
};
```

- **`size="lg"`**: every row of the group (`.sw-list-group-lg .sw-list-row`) at least 56 px (`calc(space-8 + space-2)`) on every pointer, with `align-items: center`. Two classes outrank the 44 px coarse-pointer rule. Any variant. A row of a title and a detail is 62 px already, so the counted bounded row is the same at either size. An unknown size throws a `RangeError`.
- **`variant="tiles"` with `maxHeight`**: accepted (it threw). The region is the shared `ScrollRegion` (a named, focusable `group`; a name is still required). Height, shade and focus as above. `footer` on tiles still throws, now "A ListGroup of tiles takes no footer".
- Other variants and sizes render exactly as before.

Limits to know: a bounded grid counts rows of a title and one detail line (62 px), so title-only `lg` tiles (58 px with their hairlines) show a part of the next row under the shade, which says there is more. Every tile is in the DOM (no virtualisation).

Evidence: `list-group-size.test.tsx` (md by default, lg on any variant with its class, the refusal, the 56 px rule after the touch target); `list-group-tiles-bounded.test.tsx` (one named list of 13 tiles in one named region, DOM order kept, the rows-of-tiles height, the overlay shade's rules, no shade under tiles, forced colours and print); `list-group-tiles.test.tsx` (the footer refusal, a bounded grid's name required, the tile rules naming both lists); `list-group.test.tsx` (the list-of-rows height unchanged, its shade narrowed to rows); gallery "ListGroup" (Which bird did you see?: 14 birds as lg tiles, three rows at a time); `apps/gallery/e2e/list-group-tiles-bounded.spec.ts` on desktop-en, mobile-es and forced-colors (every tile ≥ 56 px with its name centred, three across or one a row, the region scrolling at three counted rows, both shades over the tiles mid-scroll and none in forced colours, Tab through all 14 tiles each fully inside the region with its ring, no sideways scroll, axe in light and dark); `list-group.spec.ts` names the bounded list's region by its panel now that the section holds two.

Not verified: a real screen reader on the bounded tiles (the region and list names, the tile count); Safari and Firefox (the browser specs are Chromium).
