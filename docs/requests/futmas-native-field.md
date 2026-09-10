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
