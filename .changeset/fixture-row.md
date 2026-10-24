---
'@scalewing/react': minor
---

`FixtureRow` and `FixtureGroup`: one pairing of two sides with a kickoff time (a grey chip) or a score (bold figures) between them, the home side ending at the centre and the away side starting from it, marks on the centre side, meta and a status `Badge` at the end (under the sides below `md`, `metaHideBelow` leaving the meta out below `md` or `lg`); with `href` or `onPress` the whole row is a link or a button with a chevron. `FixtureGroup` is a caption naming the run's list, one grid with each row a subgrid, so the centres line up down the run. 44 px rows, right-to-left and forced colours covered. New classes `sw-fixture-*`; invalid words or props, or a row outside a group, throw a `RangeError`. No new tokens or dependencies. Request: `docs/requests/futmas-fixture-row.md`.
