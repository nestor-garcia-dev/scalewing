Status: implemented for the react-native 1.5.0 release.

Scalewing request from FutMas.

Renderer: react-native
Change to existing surfaces: `WheelField`, `TimeField`, and `DateField`
close the way people expect, and only one of them is open at a time.
Why: the product owner tested the season year wheel and the playable window
time wheels on a phone. A wheel only closed when its own field was tapped
again ("won't close on selection, not on blur"). An open wheel also spins
when a page scroll starts over it, which changed a picked year in testing.
Existing surface this might already be: `DateField` already closes after a
day is picked; the wheels did not follow it.
Behavior:

- A tapped row selects and closes `WheelField`.
- `TimeField` stays open on a tapped hour, so the minutes can follow, and
  closes on a tapped minute or AM/PM row.
- A scroll that settles on a row selects and keeps the picker open, so
  people can browse.
- Opening a `DateField`, `TimeField`, or `WheelField` closes any other one
  open under the same `ThemeProvider`.
  Public API: unchanged. `ThemeProvider` now also holds which picker is open.
  Out of scope: closing on a tap elsewhere on the screen (needs a screen-wide
  touch listener) and a Done button.
