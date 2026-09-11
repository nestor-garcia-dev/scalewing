# @scalewing/react-native

React Native / Expo primitives that consume the same Scalewing tokens as the DOM package.

Native `Accordion` is controlled by `open` / `onOpenChange`. Provide a title,
localized disclosure `accessibilityLabel`, and content. Optional `leading`
and `metadata` slots support marks and counts. With `onTitlePress`, the title
is a separate action (named by `titleAccessibilityLabel` or `title`) and only
the trailing control toggles. Otherwise the entire header toggles. Collapsed
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

`SegmentedControl` uses the active palette's accent/onAccent pair for the
selected section, with a 44-point minimum touch height. Labels grow with
system text size. The native example demonstrates switching sections.

React and React Native are peer dependencies so the host Expo app owns the runtime. Rationale: duplicating React Native inside this package would fight Metro and Expo upgrades.
