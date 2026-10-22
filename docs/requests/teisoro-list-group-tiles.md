Scalewing request from Teisoro.

Status: accepted 2026-10-22 (Teisoro F-014-S06 "Acceptance and UX check", task 2632; a gap its acceptance review deferred, D-116, on the training board Main; plan approval under the owner's F-014 delegation of 2026-10-19 and the owner's 2026-10-22 go-ahead for the deferred gaps).
Renderer: react
Missing surface: one `ListGroup` whose rows are laid out as tiles in columns.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the Library board draws New for you as a strip of up to three tiles across (each a white rounded panel holding one document's row), stacking one a row on a phone. A `ListGroup` is one panel with its rows stacked; Teisoro draws the strip as a `Grid` of three one-row `ListGroup`s, so a screen reader meets three lists of one item instead of one list of three ("list, 3 items"), and the strip's heading names none of them. Teisoro owns no CSS and cannot lay a list's items out in columns.
Existing surface this might already be: `ListGroup` `variant` (`panel`, `plain`); `Grid` (lays out its children, not a list's items); `Card` per row (not a list).
Workaround I almost used: a `Grid` with `role="list"` and each `ListGroup` as a `listitem`, which nests a list in every item and still reads as lists of one.
Teisoro use: `training/NewForYou` (the Library's New for you strip, up to 12 rows, three across, one a row on a phone), named by its heading.
Proposed API: `variant="tiles"` on `ListGroup`, with `tileColumns?: 2 | 3 | 4` (default 3).

## Accepted API (2026-10-22)

- `variant="tiles"` (`listGroupVariants` gains `'tiles'`): the group is one `ul` (role kept, named as before), its `li` rows laid out on a grid a `--sw-space-3` apart; each `li` is a panel (the surface, a hairline border on every side, `--sw-radius-md`, clipped), so no hairline is drawn between rows. Below `md` one tile a row.
- `tileColumns?: ListGroupTileColumns` (`2 | 3 | 4`, `listTileColumnCounts`), default 3, from `md` up (below `md` always one a row); classes `sw-list-group-tiles` and `sw-list-group-tiles-<n>`.
- Forced colours draw each tile's border in `CanvasText`.
- A row's press fill and inset focus ring stay inside its tile; rows keep every option (`truncate`, `unread`, `tag`, `action`).
- Refused with a `RangeError`: `tileColumns` without `tiles`, a count other than 2, 3 or 4, tiles with `maxHeight` or a `footer`.
- Other variants render exactly as before. No new tokens or dependencies.

Evidence: `list-group-tiles.test.tsx` (one named list of three items with their link and button roles, three columns by default, 2 and 4, the refusals, the generated rules, the phone's one column and forced colours); gallery "ListGroup" (New arrivals: three link tiles under a heading and count, one title cut to one line); `apps/gallery/e2e/list-group-tiles.spec.ts` on desktop-en, mobile-es and forced-colors (one list of three items and links, a bordered rounded panel per tile, three equal tiles a row 12 px apart filling the list at 1280 and one a row at 390, the long title cut, focus, no sideways scroll), with `list-group.spec.ts`, `list-row-truncate.spec.ts`, `list-row-trailing.spec.ts` and `list-row-title-lang.spec.ts` unchanged and passing.
