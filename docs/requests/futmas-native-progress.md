Status: implemented for the react-native 1.7.0 release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: native `Progress`, the counterpart of the web `Progress`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: a known
numerator and denominator needs a filled track with progress-bar semantics
for VoiceOver and TalkBack. Composing one from Box would need
consumer-owned widths and fills.
FutMas use: a public league's home lists each draft season still in setup
with its checklist progress, such as "Next: add teams" and 4 of 8 steps
done (approved F-017-S18 plan, 2026-09-24).
Existing surface this might already be: the web `Progress`
(`@scalewing/react`). The native port keeps its props.
Workaround I almost used: text only ("4 of 8 steps"), which drops the
approved design's bar.
Proposed API: `label`, `value`, `max`, and `tone` (`accent`, `success`, or
`danger`; default `accent`), the same as the web component.
Behavior and failure boundary:

- The label reads on the start side and the muted count "value / max" on
  the end side, above a pill track filled to value / max.
- The whole control is one accessible element with the progress bar role,
  the label as its name, and the value range (0 to max, now = value).
- It throws a `RangeError` for an empty label, a max that is not a
  positive finite number, or a value outside 0..max, as the web component
  does.

Scalewing owns the track, fill, count format, semantics, and validation.
FutMas owns the label copy and which step count it shows.
