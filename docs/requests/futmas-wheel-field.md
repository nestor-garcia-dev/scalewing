Status: implemented for the react-native 1.4.0 release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: `WheelField`, a labeled field that discloses one snapping
wheel for a choice from a long ordered list.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: a season's start
year must be picked, not typed. The owner asked for the platform birthday
picker feel: a wheel that starts on the current year so nobody creates a
season in the past, with no free text to validate. `Field` with a number pad
accepts anything; `SingleSelect` chips do not scale past a handful of years.
Existing surface this might already be: `TimeField` already owns the
private snapping `Wheel` column; it is bound to hour, minute, and period
columns and a `HH:MM` value contract, so it cannot show an arbitrary list.
Workaround I almost used: a numeric `Field` with a "2020 to 2100" error
message.
FutMas use: the season period's year on the new-season and draft-season
screens (F-017-S01, owner feedback 2026-09-22). Later: roster capacity, a
count of qualifiers, any bounded ordered choice.
Proposed API: `label`, `items` (`{ id, label }`, ordered), `value` (an item
id or the empty string), `onChange(id)`, `placeholder`, `disabled`, `hint`,
`error`, `wheelLabel` (accessible name of the column; the field label when
omitted), and `testID` (names the column `<testID>-wheel`). The control is
the same field-shaped disclosure button as `DateField` and `TimeField`; it
opens the existing wheel over the items. Rows are radio targets, a settled
scroll or a tap selects, and an empty value rests on the first item and
reports nothing until the person taps a row or scrolls the wheel. The
consumer builds the item list (for example the current year onward) and owns
the value contract.
