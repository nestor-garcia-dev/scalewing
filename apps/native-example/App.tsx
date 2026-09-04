import {
  Button,
  Card,
  Inline,
  Stack,
  Text,
  ThemeProvider,
} from '@scalewing/react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native';

export default function App() {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeProvider colorScheme={scheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack gap={4} padding={4}>
          <Inline justify="between" align="center">
            <Text variant="heading">Scalewing</Text>
            <Button
              onPress={() =>
                setScheme((current) => (current === 'light' ? 'dark' : 'light'))
              }
              size="sm"
              variant="secondary"
            >
              {scheme === 'light' ? 'Dark theme' : 'Light theme'}
            </Button>
          </Inline>
          <Text color="muted">
            Native uses spacing step props, not CSS class names.
          </Text>
          <Card padding={4}>
            <Stack gap={2}>
              <Text variant="title">Sunday kickoff</Text>
              <Inline gap={3} paddingTop={4}>
                <Text color="muted">North FC</Text>
                <Text variant="label">2–1</Text>
                <Text color="muted">Harbor United</Text>
              </Inline>
            </Stack>
          </Card>
        </Stack>
      </SafeAreaView>
    </ThemeProvider>
  );
}
