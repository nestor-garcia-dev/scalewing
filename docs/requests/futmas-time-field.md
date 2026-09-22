Status: implemented for the react-native 1.1.0 release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: `TimeField`, a labeled wall-clock time input
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: playable windows
need a start and end time chosen on a fixed minute step and shown in the
device's hour cycle; typing `HH:MM` into `Field` is error-prone and a native
time picker dependency would tie the package to one Expo SDK.
Existing surface this might already be: none.
Workaround I almost used: two numeric `Field`s for hour and minute with
product-side validation.
FutMas use: playable window start and end times; later team unavailability
ranges.
Proposed API: `label`, `value` (`HH:MM` 24-hour or empty), `onChange`,
`minuteStep` (divides 60, default 15), `locale`, `placeholder`, `hoursLabel`,
`minutesLabel`, `disabled`, `hint`, `error`. The control is a field-shaped
button that discloses hour chips (localized, 12- or 24-hour by locale) and
minute chips; each press reports the combined value and keeps the other
part.
