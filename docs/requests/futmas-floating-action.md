Status: implemented; pending the react-native release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: a form's one action floating at the bottom in thumb reach,
as a lifted capsule inset from the edges over a fade, that stays put while the
form scrolls and rides above the keyboard.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas's owner
ruled that a form ends in one action as a floating capsule (FutMas
`docs/MOBILE_UX.md`, rule 9; canvas boards N9, N14, N16, approved
2026-09-30). `Button` is a flat pill sized to its row with no lift, and a
fade needs a gradient no consumer primitive draws.
Existing surface this might already be: `Button` in a consumer `View` with a
shadow (no fade; each screen would restyle the pill).
Workaround I almost used: FutMas's hand-made floating Today button on the
Matches tab (a `Button` in an absolute `Box`).
Proposed API (reusable names only):

```tsx
<FloatingAction disabled={busy} onPress={save} testID="save">
  Save
</FloatingAction>
```

Behavior and failure boundary: the capsule presses, dims while disabled, and
names itself by its label; the fade lets touches through. Placement, the
keyboard, and the scroll's bottom room stay the consumer's.

Scalewing owns the component, its styles, tests, docs, and the native
example. FutMas owns placement, copy, and the action.
