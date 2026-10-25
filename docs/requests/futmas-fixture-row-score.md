Scalewing request from FutMas.

Status: implemented for `@scalewing/react` 1.57.0 (accepted 2026-10-25; FutMas F-010-S17 "Inbox, scores, score sheet and standings" gaps 1–3: the E2 Scores, E3 week score sheet and E4 standings boards; standing owner approval).
Renderer: react
Missing surface: score entry in a fixture row, a part under a fixture row, and a cut line under a table row. Extensions of `FixtureRow` and `TableRow`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `FixtureRow`'s centre is a string, so FutMas cannot place inputs between the sides or size them for touch without its own CSS; a sibling after the row's `li` breaks `FixtureGroup`'s list, and `meta` sits at the row's end on one line; `TableRow` `variant="total"` draws a heavy rule above a row and bolds it, and nothing draws a rule under one.
Existing surface this might already be: a compact `Table` with `Field`s in a score column (changes the rows' look from the Overview and Schedule), `TableRow variant="total"` (a rule above, with weight 600).
Workaround I almost used: `scores/ScoreGroup.tsx`, each match day as a compact `Table` with two `Field size="xs"` inputs per row and the reason field in a `colSpan` row; no cut line on the standings (the page's words already say "top 4 … go to the playoffs").

## Accepted API (2026-10-25)

`FixtureRow` gains `score?: FixtureScore` and `detail?: ReactNode`; `center` becomes optional when `score` is given.

- `FixtureScore`: `{ label; home: FixtureScoreBox; away: FixtureScoreBox; onChange(side: 'home' | 'away', value: string); onSubmit(); onCancel?(); disabled?; error? }`; `FixtureScoreBox`: `{ value; label; ref?; invalid? }`. The plan's `invalid?: boolean` on the score became `error?: string` (said politely under the row, describing both boxes, as `Stepper` and `Field` take `error`), with a per-box `invalid` to keep a filled box unmarked.
- Two text inputs (`inputmode="numeric"`, `pattern="[0-9]*"`, `maxLength` 2, digits only, tabular, select-all on focus) around a hidden en dash, in a `role="group"` named by `label`, each named by its own `label`; Enter calls `onSubmit`, Escape `onCancel`.
- 32 px squares on a fine pointer (the row keeps 44 px), 44 px on a coarse one; a space-2 margin below `md`.
- A score row is never a link or a button; `score` works with `flag`, `select`, `action`, `meta`, `status` and `detail`. Neither or both of `center` and `score`, `centerKind` with `score`, or `href`/`onPress` with `score` throws a `RangeError`.
- `detail`: a full-width part in the row's list item, under the row (and a score's message), outside its press area, from the home side's start (after `select`'s box) to the action's end.

`TableRow` gains `rule?: 'after'` (`TableRowRule`, `tableRowRules`): the cells' bottom border 2 px in the muted grey (the board drew the text colour; the plan asked for grey, not colour-coded, and muted keeps 3:1 for a line that carries meaning), `CanvasText` in forced colors. The consumer says what the line means in words.
