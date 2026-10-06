Status: implemented on `futmas/score-entry` for the next `@scalewing/react-native` minor release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: `StepperRow`, a `ListGroup` row with a title, an optional
muted detail, and a compact minus, count, and plus on its end side.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: a team admin
names who scored each goal of a match (FutMas canvas board W3). The sheet
lists the roster A–Z, one row per player (title the player's name, detail
the shirt number such as "#9" when there is one), then a "Someone else"
row (detail "Not on the roster or not sure") and an "Own goal" row, each
with a goal count. Rosters run to about 25 players. The labeled `Stepper`
puts its label above a full-width pill track, two lines and a 44-point
track per player, so 25 of them make a very long sheet, and its track does
not sit in a `ListGroup` panel. `ListRow` shows a value but cannot change
one.
Existing surface this might already be: `Stepper` (labeled, a track that
fills its column) and `ListRow` (rows in a `ListGroup`). This combines the
row's layout with the stepper's bounds, buttons, and adjustable semantics
rather than adding a parallel control; both share the same private
pieces.
Workaround I almost used: a FutMas row of `ListRow` text beside two
`Button`s around a `Text`, with its own spacing and glyphs.
Proposed API (reusable names only):

```tsx
<ListGroup accessibilityLabel="Goal scorers">
  <StepperRow
    decrementLabel="Remove a goal"
    detail="#9"
    incrementLabel="Add a goal"
    max={20}
    min={0}
    onChange={setGoals}
    testID="scorer-ana"
    title="Ana Pérez"
    value={2}
  />
</ListGroup>
```

- `title: string`, `detail?: string` (a muted line under the title), and
  `leading?: ReactNode` (a consumer mark or Lucide glyph, ADR 0008), laid
  out exactly like `ListRow`: same row height, padding, typography, and the
  group's hairlines.
- `value: number`, `min: number`, `max: number`, `step?: number` (default
  1), and `onChange(value: number)`, with the `Stepper` bounds rules: a
  bound stops its direction, and bounds that do not describe a range
  throw.
- `decrementLabel` and `incrementLabel` name the buttons (product copy).
- `disabled?: boolean` dims the row once and stops every input.
- `testID?: string` names the row, and its parts `<testID>-decrement`,
  `-value`, and `-increment`, as on `Stepper`.

Visual: round buttons at the smallest control size (so the row keeps the
44-point `ListRow` height), filled with the quiet `subtle` colour because
a row has no glass track for the Stepper's raised button to sit on; the
count between them in body type with tabular digits and room for two
digits, so the buttons do not move as it changes; a button fades at its
bound.

Accessibility: the title and detail (with the leading slot) are one
adjustable element named by the title and detail joined with a comma,
reporting the count as its value (with `text`, so iOS does not read a
percentage) and taking increment and decrement actions. That element
carries `<testID>-value`, as the Stepper's adjustable value does. The drawn
count is hidden from assistive technology because the adjustable element
already reports it. Each button stays a separate, named, 44-point touch
target (hit slop) and is disabled at its bound.

Scalewing owns the row layout, the buttons, bounds, and semantics. FutMas
owns the names, details, button labels, bounds, and what a count means.
