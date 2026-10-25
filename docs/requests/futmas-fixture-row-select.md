Scalewing request from FutMas.

Status: implemented for `@scalewing/react` 1.56.0 (accepted 2026-10-25; FutMas F-010-S16 "Postpone, new times and republish" gap 1: the D6 board's tick-and-untick rows for postponing a match day; standing owner approval).
Renderer: react
Missing surface: a selectable fixture row, plus four follow-ups from the 1.55.0 review. An extension of `FixtureRow`, with fixes to `FixtureRow`, `ScheduleGrid` and `DateToggleCalendar`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `FixtureRow` has no leading control; a `Checkbox` needs a visible label and FutMas cannot place it inside the row's grid without its own CSS; `TableSelectCell` belongs to `Table`, which would change the rows' look between browsing and selecting.
Existing surface this might already be: `TableSelectCell` (a table's select column), `ListRow` `leading` (not the fixture's centred two-sided layout).
Workaround I almost used: `schedule/live/PostponeDayTable.tsx`, the match day's games as a compact `Table` with `TableSelectCell` while selecting, the rest of the week staying rows.

## Accepted API (2026-10-25)

`FixtureRow` gains `select?: FixtureSelect` (`{ label: string; checked: boolean; onCheckedChange(checked: boolean): void; disabled?: boolean }`).

- A `Checkbox` with its label visually hidden, before the row in its list item: outside a link or button row's press area, before it in the Tab order, in the run's new first column (`auto`, so a run without a select keeps no space), centred on the row and lined up down the run at every width.
- The standard 24 px box (the board drew 22 px; Scalewing keeps one checkbox size), its own target on a fine pointer and 44 × 44 px on a coarse one.
- Works with `flag`, `action` (1.55.0), `href` and `onPress`; the hover fill spans the item where `:has` is supported.
- A blank `label`, a non-boolean `checked` or a missing `onCheckedChange` throws a `RangeError`.

## Follow-ups from the 1.55.0 review

- `ScheduleGrid` `labels.pickedUp(item, mode)`: the input (`ScheduleGridCarryMode`: `keyboard`, `tap`, `drag`) is passed as a second argument, and the default words fit it (arrow keys only for keys). One-argument functions still work.
- `FixtureRow`: below `md`, a flagged row with nothing on the details' line (no `status`, and no `meta` or one hidden below `md`) keeps the flag inline on its first line instead of a second line holding only the flag.
- `DateToggleCalendar` `onChange` returns only days that can be toggled: `value` entries outside `min`–`max` or on a disabled day are dropped (documented and tested).
- `ScheduleGrid`: a carry by keys or taps is cancelled when focus leaves the grid (not when the window blurs), and a mouse release handled before the drag's pick-up commits still drops or cancels instead of leaving the item held.
