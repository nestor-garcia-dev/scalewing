---
'@scalewing/react-native': minor
---

`ListRow` takes `accessory="switch"` with `switchValue` and
`onSwitchChange(value)`: a row that turns a setting on or off in place, like
iOS Settings, with a native `Switch` on its end side (on in `success`, off in
`border`, the platform's thumb). The row is one `switch` element named by its
lines that announces its checked and disabled state, and a tap anywhere on it
toggles; it has no chevron, no `onPress`, and no pressed fill. New types
`ListRowPressProps` and `ListRowSwitchProps`; `ListRowProps` is their union,
and existing rows are unchanged. No new dependency.
