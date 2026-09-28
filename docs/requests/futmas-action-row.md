Status: implemented for `@scalewing/react-native@1.11.0` (on
`@scalewing/tokens@1.4.0`).

Scalewing request from FutMas.

Renderer: react-native
Missing surface: a row of action tiles under a screen's title that holds
the actions for the thing the screen shows (iOS Contacts style).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas
F-002-S25 (owner-approved design, 2026-09-28) puts up to four tinted
rounded tiles, each a glyph over a one-line label, in four equal slots
across the width, with a More tile once there are more actions. `Button`
is a pill with a text label, not a glyph-over-label tile; `TabBar` is a
bottom tablist, not buttons; a row of Cards would need product spacing,
fill, and slot math, and the tint does not exist outside the tokens.
Existing surface this might already be: `Button` (one pill action),
`TabBar` (icon-over-label destinations, tab semantics), `Inline` (layout
only).
Workaround I almost used: a FutMas tile with its own height, radius, and
an accent layer at a made-up opacity.
Proposed API (reusable names only):

```tsx
<ActionRow
  accessibilityLabel="Season actions"
  actions={[
    { key: 'team', label: 'Team', icon: <Users />, onPress: addTeam },
    {
      key: 'competition',
      label: 'Competition',
      accessibilityLabel: 'New competition',
      icon: <Trophy />,
      onPress: addCompetition,
      testID: 'season-new-competition',
    },
    {
      key: 'venue',
      label: 'Venue',
      icon: <MapPin />,
      onPress: addVenue,
      disabled: true,
    },
  ]}
  more={{
    label: 'More',
    icon: <Ellipsis />,
    onPress: (rest) => showSheet(rest),
  }}
/>
```

- Four equal slots, each (width − 3 gaps) / 4. Fewer actions keep
  quarter-width tiles from the start side, so tiles never change size or
  place as actions are added.
- A tile is `accessibilityRole="button"`, named by its label unless
  `accessibilityLabel` gives a longer name, with `accessibilityState`
  `disabled`. The glyph is hidden from assistive technology. The row is a
  `toolbar` and takes an optional `accessibilityLabel`.
- Past four actions, the first three show and the fourth slot is More.
  Pressing it calls `more.onPress` with the remaining actions; the product
  shows them (a native action sheet). More's label, glyph, and accessible
  name are product copy. `more` is required once there are more than four
  actions; without it `ActionRow` throws.
- `disabled` dims a tile in its slot and stops presses. A pressed tile
  quiets.
- `testID` on the row, on each action, and on More, for Maestro.

Tokens: fill `colors.accentSubtle`, glyph and label `accent`, height
`space[8] + space[4]` (64), radius `radius.md`, label the `caption` size at
the `label` weight on one line, pressed `quietOpacity`, disabled
`disabledOpacity`, gap `space[2]`. Glyphs follow ADR 0008: Lucide in the
product at spacing step 5 in `theme.colors.accent`, `strokeWidth={1.75}`.

Behavior and failure boundary: Scalewing owns the slots, tile shape, tint,
states, and More's place. FutMas owns labels, glyphs, what each press does,
and the sheet More opens.
