Status: implemented for the react-native 1.2.0 release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: `SingleSelect`, a labeled group of radio chips
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: choosing one
gameweek out of up to a hundred, one field out of a league's venues, or one
of two daylight-saving offsets needs radio semantics (`selected` state per
option, one group label, one error caption) and chips that wrap.
`SegmentedControl` is a single-choice radiogroup but is a fixed pill track
sized for two to four short labels; `MultiSelect` has checkbox semantics and
reports arrays.
Existing surface this might already be: web `Select` (web-only) and web
`FilterChips`; neither is native.
Workaround I almost used: `MultiSelect` with the product keeping only the
last toggled id, which announces "checked" for a single choice and lets two
chips look selected between renders.
FutMas use: gameweek, venue and field, and fold-offset choice in the fixture
editor (F-015-S06); team choice in team availability (F-015-S07).
Proposed API: `label`, `items` (`{ id, label }`), `value` (one id or `''`),
`onChange(id)` only when a different chip is pressed, `disabled`, `hint`,
`error`. Chips wrap on the control scale so each is a 44-point target.
