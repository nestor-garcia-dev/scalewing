# @scalewing/react-native

React Native / Expo primitives that consume the same Scalewing tokens as the DOM package.

Native `Accordion` is controlled by `open` / `onOpenChange`. Provide a title,
localized disclosure `accessibilityLabel`, and content. Optional `leading`
and `metadata` slots support marks and counts. An optional `subtitle` adds one
muted caption line below the title, and `truncateTitle` keeps the title on
one line with a tail ellipsis instead of wrapping. With `onTitlePress`, the
title is a separate action (named by `titleAccessibilityLabel`, or the title
followed by the subtitle) and only the trailing control toggles. Otherwise the entire header toggles. Collapsed
content unmounts and is absent from the accessibility tree. `flush` drops the
content's side and bottom padding so a plain `ListGroup` of choices runs to
the accordion's edges.

```ts
import { Button, Card, Field, SegmentedControl, Stack, TabBar, Text, ThemeProvider } from '@scalewing/react-native';

<ThemeProvider colorScheme="system" palette="cerulean">
  <Card padding={4}>
    <Stack gap={3}>
      <Text variant="title">Kickoff</Text>
      <Field label="Team name" onChangeText={() => undefined} value="Harbor United" />
      <Button onPress={() => undefined}>Save</Button>
    </Stack>
  </Card>
</ThemeProvider>
```

`Card` defaults to `glass`; `outlined` and `elevated` are solid surfaces,
and `filled` is a quiet `subtle` fill with no border for plain information
apart from pressable rows.

There is no CSS class API. `padding={4}` is spacing step 4, the same step as
`sw-padding-4` on web. Native `Field` renders a controlled `TextInput` with a
visible label and optional hint or error; it accepts standard text-input props
except styling and controlled semantics owned by the component. `variant="search"`
is a filled search capsule: the `label` is not drawn but stays the input's
accessible name, a consumer `leading` glyph (a Lucide magnifier) sits at the
start, the return key defaults to `search`, and while there is text a clear
button named by the required `clearLabel` calls `onChangeText('')`
(`<testID>-clear`). `colorScheme`
is `"light"`, `"dark"`, or `"system"`. Named palettes include both schemes;
`colors` may be `{ light, dark }`.

`Progress` shows a known count out of a total: its `label`, a muted
"value / max" count, and a pill track filled in the `tone` color (`accent`,
`success`, or `danger`). It is one accessible progress bar named by the
label with its value range, and it throws a `RangeError` for an empty label
or a value outside 0..max, like the web `Progress`.

`Calendar` is the `DateField` month grid shown inline and always open, for a
screen whose one question is a date. It takes the same `value`, `min`, `max`,
`locale`, `weekStartsOn`, and month-navigation labels, opens on the selected
month (else today's), and stays open after a pick.

`MultiSelect` and `SingleSelect` chips are outlined pills that never fill,
so they do not read as buttons. A selected chip turns its outline and label
to the accent and leads with a check.

`MultiSelect` takes `variant="list"` to stack full-width checkbox rows with a
check mark on each selected row instead of wrapping chips. The value contract
and item order are the same. `SingleSelect` takes the same `variant="list"`
for radio rows in one radiogroup, with the mark on the chosen row. In either
list, an item's optional `detail` is a muted line under its label and part of
its accessible name; chips omit it.

`ListGroup` is one bordered panel of `ListRow`s with a hairline between each
pair; an optional `accessibilityLabel` names it. `variant="plain"` draws no
panel and puts a hairline above the first row too, for rows inside a surface
that already has one, such as a `flush` accordion. A `ListRow` has a `title`,
an optional muted `detail` line and trailing `value`, and an optional
`leading` slot for a consumer mark or Lucide glyph. With `onPress` it is a
button with a chevron (`accessory="none"` hides it for a row that acts in
place) and fills with `subtle` while pressed. `selected` makes it a choice
that shows a check while true and announces its selected state.
`tone="danger"` draws the title in the danger colour for a row that ends
something, such as Sign out; any confirm stays the consumer's. Without
`onPress` it is one read-only text element with no chevron. Its accessible
name is the title, detail, and value unless `accessibilityLabel` replaces
it.

`StepperRow` is a `ListGroup` row that counts something: a `ListRow`'s
`title`, optional `detail` and `leading` slot, and a compact round minus and
plus around the count on the end side, with `Stepper`'s `value`, `min`,
`max`, `step`, `onChange`, `decrementLabel`, `incrementLabel`, and
`disabled`. The title and detail are one adjustable element that reports the
count (`<testID>-value`); the buttons (`-decrement`, `-increment`) stay
separate 44-point targets and are disabled at their bounds.

`FloatingAction` is a screen's one action as a lifted accent capsule in
thumb reach, over a fade from clear to the page colour so content scrolling
under it fades out. It places nothing itself: the consumer puts it at the
bottom of the screen and lets the platform's keyboard avoidance lift it, with
no keyboard toolbar. Only the capsule takes touches. A string child is its
accessible name; `disabled` dims it and `testID` reaches the capsule. The fade
uses React Native's `experimental_backgroundImage` (New Architecture).

`ActionRow` holds the actions for what a screen shows as tinted tiles under
its title, iOS Contacts style: each `actions` item is a consumer `icon` over
a one-line `label` on the `accentSubtle` tint. The row keeps four equal
slots, so one to four actions keep quarter-width tiles from the start side.
Past four, the first three show and the fourth is a `more` tile whose
`onPress` receives the remaining actions for the product's action sheet;
`more` is required then. Each tile is a button named by its label unless its
`accessibilityLabel` gives a longer name; `disabled` dims it in place, and
`testID` works on the row, each action, and More. Pass Lucide glyphs at
spacing step 5 in `theme.colors.accent` (ADR 0008).

`SegmentedControl` uses the active palette's accent/onAccent pair for the
selected section, with a 44-point minimum touch height. Labels grow with
system text size. The native example demonstrates switching sections.

`TabBar` gives destinations equal-width, shrinking columns and keeps an
optional trailing control at its token-owned hit target. Destination labels
continue to scale with the system and ellipsize visually when space is tight;
their full accessible names remain on the tab controls.

React and React Native are peer dependencies so the host Expo app owns the runtime. Rationale: duplicating React Native inside this package would fight Metro and Expo upgrades.
