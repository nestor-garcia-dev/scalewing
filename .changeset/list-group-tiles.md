---
'@scalewing/react': minor
---

`ListGroup` `variant="tiles"`: the same one list (its name, its items and their count) with its rows laid out as tiles, each row its own bordered panel on the surface and no hairline between them, in `tileColumns` equal columns (2, 3 by default, or 4) a space-3 apart from `md` up, and one a row below it whatever `tileColumns` says, such as a strip of new arrivals. A row's press fill and inset focus ring stay inside its tile. Tiles take no `maxHeight` or `footer`, and `tileColumns` needs `tiles` (a `RangeError`, as for a count other than 2, 3 or 4). New classes `sw-list-group-tiles` and `sw-list-group-tiles-2`, `-3`, `-4`; `listTileColumnCounts` and `ListGroupTileColumns` are exported. No new tokens or dependencies. Request: `docs/requests/teisoro-list-group-tiles.md`.
