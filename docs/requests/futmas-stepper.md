Status: implemented for the next react-native release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: `Stepper`, a labeled bounded number changed with round
minus and plus buttons.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: table points
(win, draw, loss) are small whole numbers from 0 to 10. Three stacked
number-pad `Field`s take a screen of vertical space, open a keyboard for a
one-step change, and accept text that must then be validated. The owner
asked for a stepper so the three values sit side by side, each titled above
its control, and the season form scrolls less.
Existing surface this might already be: `SegmentedControl` and
`SingleSelect` pick one of a few labels; eleven point values do not fit
three to a row. `WheelField` suits long lists, not a quick nudge.
Workaround I almost used: two `Button`s around a `Text` in the product,
with hand-drawn glyphs.
FutMas use: table points on the season rules form (win, draw, loss); later
counts such as minutes per half or qualifiers.
Proposed API: `label`, `value` (number), `onChange(number)`, `min`, `max`,
`step` (default 1), `decrementLabel` and `incrementLabel` (the buttons'
accessible names; product copy), `disabled`, `hint`, `error`, and `testID`
(parts `<testID>-decrement`, `-value`, `-increment`). Visual: the label
above, then a glass pill track that fills its column with a raised round
minus button, the value centered, and a raised round plus button; a button
fades at its bound. The value is one adjustable element with increment and
decrement actions for assistive technology. The consumer places several in
an `Inline` to share a row.
