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

## Revision 2026-09-22: wheel instead of chips

Status: in implementation for a `@scalewing/react-native` minor release.

The owner tested playable windows on a phone: twenty-four hour chips and
four minute chips are hard to scan and tap. The disclosure now opens
scrolling wheels like the platform pickers: an hour column (12, 1 … 11 or
00 … 23 by the locale's hour cycle), a minute column on `minuteStep`, and an
AM/PM column on a 12-hour locale. Rows snap, the selected row sits in a
hairline band, a tap on a visible row selects it, and each row is a radio
target for assistive technology and for tap-driven tests. An empty value
rests at noon and reports nothing until the person changes a column.

No native module and no dependency: the wheel is a `ScrollView` with
`snapToInterval` and token-owned rows. Public props are unchanged apart
from two optional additions: `periodLabel` names the AM/PM column, and
`testID` names the columns `<testID>-hours`, `-minutes`, and `-period`.
