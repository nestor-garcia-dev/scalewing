Status: implemented for the react-native 1.1.0 release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: `MultiSelect`, a labeled group of checkable chips
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: choosing several
weekdays or several fields needs checkbox semantics (`checked` state per
option) with a shared label and error caption. `SegmentedControl` is
single-select and `Button` rows carry no checked state.
Existing surface this might already be: web `FilterChips` (single-select
radio) and web `Checkbox` (one option); neither is multi-select or native.
Workaround I almost used: a row of primary/secondary `Button`s toggled by the
product, as the current league-rules form does for single choices.
FutMas use: weekdays and fields for a playable window; later team
unavailability weekdays.
Proposed API: `label`, `items` (`{ id, label }`), `value` (ids), `onChange`
(ids in item order), `disabled`, `hint`, `error`. Chips wrap on the control
scale so each is a 44-point target.
