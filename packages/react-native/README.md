# @scalewing/react-native

React Native / Expo primitives that consume the same Scalewing tokens as the DOM package.

```ts
import { Button, Card, SegmentedControl, Stack, TabBar, Text, ThemeProvider } from '@scalewing/react-native';

<ThemeProvider colorScheme="system" palette="cerulean">
  <Card padding={4}>
    <Stack gap={3}>
      <Text variant="title">Kickoff</Text>
      <Button onPress={() => undefined}>Save</Button>
    </Stack>
  </Card>
</ThemeProvider>
```

There is no CSS class API. `padding={4}` is spacing step 4, the same step as `sw-padding-4` on web. Field is web-only (`@scalewing/react`). `colorScheme` is `"light"`, `"dark"`, or `"system"`. Named palettes include both schemes; `colors` may be `{ light, dark }`.

React and React Native are peer dependencies so the host Expo app owns the runtime. Rationale: duplicating React Native inside this package would fight Metro and Expo upgrades.
