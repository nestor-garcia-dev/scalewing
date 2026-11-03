Scalewing request from FutMas.

Status: implemented for `@scalewing/react` 1.62.0 (accepted 2026-11-02; FutMas F-010 Scores redesign; standing owner approval).
Renderer: react
Missing surface: `FixtureCard`, one pairing as a small vertical scorecard inside a `Card`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas's Scores page is being redesigned as three section cards, where each game reads as team names on the left and a score box to the right of each. `FixtureRow`'s score boxes sit in the row's middle and need `FixtureGroup`'s grid, a bare `input` in `Inline` would not be `sw-fixture-score-box` (digits only, select on focus, Enter and Escape, 32 and 44 px, compact density), and apps may not write CSS.
Existing surface this might already be: `FixtureRow` `score`, whose layout is the one this page cannot use. Its boxes, keys, error wiring and validation are reused, not copied.
Workaround I almost used: a compact `Table` with two `Field size="xs"` per row, or app CSS around `FixtureRow`.

## Accepted API (2026-11-02)

`FixtureCard` takes `home` and `away` (`FixtureCardSide`: `{ name; note? }`), `score` (the existing `FixtureScore`, unchanged), and the slots `meta`, `menu`, `actions` and `detail`.

- No border, fill or radius of its own: it sits inside a `Card`, and the consumer separates several with its own divider. It does not read `FixtureGroup`'s context.
- Top to bottom: a top line only with `meta` or `menu` (`meta` at the start in caption size and the muted ink, a coloured `Text` inside it keeping its colour; `menu` at the end); the home then away side, each the name in body at weight 500 with `note` under it in caption muted, then that side's box at the end, vertically centred, the boxes in one column; the score's polite live region, the same element and id wiring as `FixtureRow`'s, present and empty without an error, danger ink, caption; `actions`, a wrapping row; `detail`, no type of its own so a `Field` in it keeps its size.
- Names wrap and never truncate.
- The root is `role="group"` named by `score.label`.
- `ScoreBox` and `scoreKeyDown` move out of `FixtureScoreBoxes.tsx` into `fixture/ScoreBox.tsx`, shared by both; the class stays `sw-fixture-score-box`. `FixtureScoreError` gains an internal `className`, its default `FixtureRow`'s class.
- A blank `home.name`, `away.name` or `score.label`, or a score `FixtureRow` would refuse, throws a `RangeError`.
- The name's body size follows `ThemeProvider density="compact"` through the list in `css-density.ts`.

Purely additive: `FixtureRow`'s output and CSS do not change, so Teisoro sees nothing. Scalewing owns the classes, tests, gallery evidence and changeset. FutMas owns adopting it, its copy and its pages.
