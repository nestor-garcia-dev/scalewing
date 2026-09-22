Status: implemented for the 0.5.0 release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: `Field`, a reusable labeled native text input
Why Box/Stack/Inline/Card/Text/Button cannot do this: none owns native input
semantics, focus/error state, secure entry, or consistent token-derived control
chrome.
Existing surface this might already be: web `Field`, but it cannot be imported
into React Native.
Workaround I almost used: repeat a raw React Native `TextInput` inside a themed
`Box` for search, profile, and invitation code forms.
Proposed API: `Field` with reusable `label`, `value`, `onChangeText`, optional
`error`, `hint`, `disabled`, and standard native text-input behavior. The
visible label is also the input's accessibility label. Styling comes from the
active native theme.

## 2026-09-21 — text clipping in the 44-point control

Status: fixed in react-native 1.1.0.

Observed in FutMas: input text sat low and was clipped on iOS in every
`Field`. Cause: `mapFieldInputStyle` set the body `lineHeight` (25) on a
`TextInput` whose 44-point control leaves 28 points for the line box after
padding, and iOS positions the baseline from that fixed line height. Fix: let
the native input size its own line box (no `lineHeight`), center vertically
on Android (`textAlignVertical`, `includeFontPadding: false`), and share the
bordered frame with the new disclosure inputs through
`mapControlFrameStyle`.
