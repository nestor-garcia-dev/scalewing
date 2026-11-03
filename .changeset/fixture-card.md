---
'@scalewing/react': minor
---

`FixtureCard`, one pairing as a small vertical scorecard for inside a `Card` (FutMas F-010, Scores redesign): an optional top line (`meta`, `menu`), the two sides with `note`s and a score box at each one's end, the score's polite error line, then `actions` and `detail`. It takes `FixtureRow`'s `FixtureScore` and the same boxes, needs no `FixtureGroup`, and draws no edge or fill. New exports: `FixtureCard`, `FixtureCardProps`, `FixtureCardSide`. New classes: `sw-fixture-card` and `sw-fixture-card-*`. Purely additive: `FixtureRow`'s output and CSS are unchanged.
