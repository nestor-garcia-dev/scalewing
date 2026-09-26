# @scalewing/react-native

React Native / Expo primitives that consume the same Scalewing tokens as the DOM package.

Native `Accordion` is controlled by `open` / `onOpenChange`. Provide a title,
localized disclosure `accessibilityLabel`, and content. Optional `leading`
and `metadata` slots support marks and counts. An optional `subtitle` adds one
muted caption line below the title, and `truncateTitle` keeps the title on
one line with a tail ellipsis instead of wrapping. With `onTitlePress`, the
title is a separate action (named by `titleAccessibilityLabel`, or the title
followed by the subtitle) and only the trailing control toggles. Otherwise the entire header toggles. Collapsed
content unmounts and is absent from the accessibility tree.

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

There is no CSS class API. `padding={4}` is spacing step 4, the same step as
`sw-padding-4` on web. Native `Field` renders a controlled `TextInput` with a
visible label and optional hint or error; it accepts standard text-input props
except styling and controlled semantics owned by the component. `colorScheme`
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
pair; an optional `accessibilityLabel` names it. A `ListRow` has a `title`,
an optional muted `detail` line and trailing `value`, and an optional
`leading` slot for a consumer mark or Lucide glyph. With `onPress` it is a
button with a chevron (`accessory="none"` hides it for a row that acts in
place) and fills with `subtle` while pressed. `selected` makes it a choice
that shows a check while true and announces its selected state. Without
`onPress` it is one read-only text element with no chevron. Its accessible
name is the title, detail, and value unless `accessibilityLabel` replaces
it.

`SegmentedControl` uses the active palette's accent/onAccent pair for the
selected section, with a 44-point minimum touch height. Labels grow with
system text size. The native example demonstrates switching sections.

`TabBar` gives destinations equal-width, shrinking columns and keeps an
optional trailing control at its token-owned hit target. Destination labels
continue to scale with the system and ellipsize visually when space is tight;
their full accessible names remain on the tab controls.

React and React Native are peer dependencies so the host Expo app owns the runtime. Rationale: duplicating React Native inside this package would fight Metro and Expo upgrades.
