Status: implemented for the react-native 1.5.0 release.

Scalewing request from FutMas.

Renderer: react-native
Surface: `Stepper` (bug fix).
Problem: the value element is `adjustable` with
`accessibilityValue={{ min, max, now }}`. With no `text`, iOS announces the
value as a percentage of the range. A field count of 1 in 1 to 8 reads
"14%", and 11 players per side in 3 to 11 reads "100%". VoiceOver users
hear the wrong number. FutMas's Maestro flows could not assert the value
either and fell back to checking the plus and minus states.
Fix: add `text: String(value)` to the accessibility value, keeping `min`,
`max`, and `now` for Android and adjustable semantics.
FutMas use: table points, players per side, minutes per half, and the
venue field count.
