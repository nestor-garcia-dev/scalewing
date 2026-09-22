Status: implemented for the react-native 1.1.0 release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: `DateField`, a labeled calendar-date input
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Field` is a free
text input; a schedule start date and skip dates need a picked calendar day
with month navigation, bounds, and locale-aware labels. React Native has no
date input primitive, and a native picker dependency would tie the package to
one Expo SDK.
Existing surface this might already be: web `DateField` (same value contract,
cannot be imported into React Native).
Workaround I almost used: a hand-styled month grid of raw `Pressable`s in the
app, or typing `YYYY-MM-DD` into `Field`.
FutMas use: season start date and skip dates in the schedule builder; later
the team-availability editor.
Proposed API: `label`, `value` (`YYYY-MM-DD` or empty), `onChange`, `min`,
`max`, `locale`, `weekStartsOn` (0 or 1), `placeholder`, `previousMonthLabel`,
`nextMonthLabel`, `disabled`, `hint`, `error`. The control is a field-shaped
button that discloses a six-row month grid. Day cells are buttons labeled
with the full localized date; cells outside `min`/`max` are disabled. The
consumer owns copy for the placeholder and month navigation labels.
