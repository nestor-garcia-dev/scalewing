Status: implemented for the react-native 1.8.0 release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: an inline month calendar, and a list presentation of
`MultiSelect`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the month grid
lives inside `DateField` behind a disclosure, so a screen that only asks
for a date would need a tap to reveal it or a consumer-built grid; and
`MultiSelect` only wraps chips, so a full-width list of checkbox rows would
be consumer-built rows with their own checked semantics.
FutMas use: the owner-approved stepped schedule flow (F-015-S10, canvas
boards 9 to 9f, 2026-09-24) asks one question per screen. "When does the
season start?" shows the month open (board 9); "Which days can you play?"
and "Which fields?" list the choices as full-width rows with a check mark
(board 9a).
Existing surface this might already be: `DateField` (its month grid) and
`MultiSelect` (its value contract).
Workaround I almost used: a `DateField` that needs a tap before the month
shows, and weekday chips, which the owner found crowded.
Proposed API:

- `Calendar` with `label`, `value`, `onChange`, `min`, `max`, `locale`,
  `weekStartsOn`, `nextMonthLabel`, `previousMonthLabel`, `hint`, and
  `error`, the `DateField` props without the disclosure ones.
- `MultiSelect` `variant?: 'chips' | 'list'`, default `chips`.

Behavior and failure boundary:

- `Calendar` shares the private month panel with `DateField`: day cells
  with full-date accessible names, the selected day marked, out-of-range
  days disabled, month paging. It opens on the selected month, else the
  current month, and a pick keeps it open on that month. Invalid values or
  bounds throw a `RangeError`, as `DateField` does.
- The list variant stacks one bordered panel of rows on the control scale,
  divided by hairlines, each a checkbox with the item label as its name and
  a check mark on the end side when selected. The mark is hidden from
  assistive technology; the checked state carries it. `disabled`, `hint`,
  `error`, and item-order values behave as for chips.

Scalewing owns the grid, rows, marks, and semantics. FutMas owns the labels
and the question copy.
