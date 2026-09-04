# @scalewing/react-native

React Native / Expo primitives that consume the same Scalewing tokens as the DOM package.

```ts
import { Card, Stack, Text, ThemeProvider } from '@scalewing/react-native';

<Card padding={4}>
  <Text variant="title">Kickoff</Text>
</Card>
```

There is no CSS class API. `padding={4}` is spacing step 4, the same step as `sw-padding-4` on web.

React and React Native are peer dependencies so the host Expo app owns the runtime. Rationale: duplicating React Native inside this package would fight Metro and Expo upgrades.
