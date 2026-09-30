Status: implemented for the react-native 1.12.0 release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: a `ListRow` whose title reads as ending something, in the
danger colour, like Sign Out in iOS Settings.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas's owner
ruled on 2026-09-29 that a screen shows one solid button and that account
actions are rows, as in iOS Settings (FutMas `docs/MOBILE_UX.md`, rule 3;
canvas board Q7). Sign out moves from a Button to a row, and the owner asked
for it in red. `ListRow` always draws its title in the text colour, and
its title is not a slot, so a consumer cannot colour it.
Existing surface this might already be: `Button variant="danger"` (a solid
button, which the rule removes), `ListRow` with a consumer glyph in
`leading` (the title stays ink, which the owner rejected).
Workaround I almost used: a blue Lucide log-out glyph beside an ink title.
Proposed API (reusable names only):

```tsx
<ListGroup>
  <ListRow accessory="none" onPress={signOut} title="Sign out" tone="danger" />
</ListGroup>
```

Behavior and failure boundary: colour only. `tone` defaults to `default`;
the row's role, pressed fill, chevron, and accessible name are unchanged.
Any confirm stays the consumer's.

Scalewing owns the prop, its colour mapping, tests, docs, and the native
example. FutMas owns the copy and the sign-out behaviour.
