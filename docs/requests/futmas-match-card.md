Status: implemented in `@scalewing/react-native` 1.18.0.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: `MatchCard`, one upcoming match as a card that opens it.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas F-027
adds an Agenda tab that leads with "your next game": the day and kickoff in
large type with a chevron, both teams with their crests, names and
Home/Away, and the venue and league underneath, with an optional small line
above for whose game it is (a child, or "You're refereeing"). The whole card
opens the game, so it must be one accessible button with one combined name.
Composing it from `Box`, `Inline`, and `Text` inside a raw `Pressable` would
repeat the game page's match card by hand in every screen that shows a next
game, with its crest mark, pressed fill, and Dynamic Type layout drifting
apart.
Existing surface this might already be: `BracketMatch` (a compact
one-line-per-side card for a knockout round, no crests, no when line),
`ListRow` (one line and a detail, not two sides), `Card` (a surface, not a
button).
Workaround I almost used: a product `Pressable` around a `Box` with
`background="surface" border radius="lg"` and the game page's `LeagueMark`.
Proposed API (reusable names only):

```tsx
<MatchCard
  details={['North pond', 'Spring meet']}
  leading="Your next race"
  onPress={openRace}
  sides={[
    { caption: 'Home', name: 'Heron' },
    { caption: 'Away', crest: <Image … />, name: 'Otter' },
  ]}
  when="Tomorrow · 9:00 AM"
/>
```

Behavior and failure boundary: the card is one `button` named by its visible
lines in reading order (or `accessibilityLabel`), with an optional
`accessibilityHint`; it fills with `subtle` while pressed. It uses the
outlined card's surface, hairline and large radius in light and dark. A
side's mark is the consumer's `crest` or its `initials` (default: the first
letters of its name) in a round mark on the `border` grey, hidden from
assistive technology. Long names wrap and nothing truncates; at
accessibility text sizes the sides stack. More than two `details` throws a
`RangeError`. `versus` defaults to "vs".

Scalewing owns the layout, marks, semantics, tests, docs, and the native
example. FutMas owns the copy (day words, captions, venue, league, role
lines), the crest images, and navigation.
