Status: implemented for the react-native 1.9.0 release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: a list presentation of `SingleSelect`, and a detail line
on list rows.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `SingleSelect`
only wraps chips, so full-width radio rows would be consumer-built rows with
their own radio semantics; and `MultiSelect`'s list rows show one label, so
"Twice · Home and away" would need a consumer row.
FutMas use: the owner-approved stepped new-season flow (F-002-S40, canvas
boards 12 to 12h, 2026-09-24 and 2026-09-25) asks one question per screen.
"Who plays?", "Which age group?", "When is this season?", "How often do
teams meet?", and "Which competition?" list their choices as full-width
radio rows, some with a detail ("Annual · The whole year").
Existing surface this might already be: `SingleSelect` (its value contract)
and the private `CheckList` behind `MultiSelect variant="list"`.
Workaround I almost used: radio chips, which the owner found crowded on the
schedule steps.
Proposed API:

- `SingleSelect` `variant?: 'chips' | 'list'`, default `chips`.
- `SingleSelectItem.detail?` and `MultiSelectItem.detail?`, shown by the
  list variants only.

Behavior and failure boundary:

- The list variant shares `MultiSelect`'s bordered panel of rows: one
  radiogroup named by the label, each row a radio with `selected` state and
  a check mark on the end side when chosen (hidden from assistive
  technology). Pressing the chosen row is a no-op, as with chips; the empty
  value shows no mark. `disabled`, `hint`, and `error` behave as for chips.
- A `detail` renders as a muted caption under the label and joins the row's
  accessible name ("Annual, The whole year"). Rows grow to fit it.

Scalewing owns the rows, marks, and semantics. FutMas owns the labels,
details, and question copy.
