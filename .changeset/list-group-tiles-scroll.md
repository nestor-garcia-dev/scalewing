---
'@scalewing/react': minor
---

`ListGroup` `size="lg"` (opt-in; `listGroupSizes`, `ListGroupSize`, class `sw-list-group-lg`): every row of the group at least 56 px on every pointer, its parts centred, such as names pressed at a shared counter. `variant="tiles"` now takes `maxHeight` (it threw): the grid scrolls inside the same named region, `rows` counting rows of tiles, the edge shade drawn over the opaque tiles, and a tile focused from the keyboard scrolled fully into view, its ring whole; tiles still take no `footer` (its error now reads "A ListGroup of tiles takes no footer"). A tile's row now fills its tile, so beside a taller tile on the same grid row its press area, fill and focus ring reach the tile's edges (an `action` stays centred). Other variants and sizes render as before. No new tokens, no new dependency. Request: `docs/requests/teisoro-list-group-tiles-scroll.md`.
