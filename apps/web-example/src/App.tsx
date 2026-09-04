import {
  Box,
  Button,
  Card,
  Field,
  Inline,
  Stack,
  Text,
  ThemeProvider,
} from '@scalewing/react';
import { useState } from 'react';

export function App() {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeProvider colorScheme={scheme}>
      <main className="sw-container sw-padding-4">
        <Stack gap={4}>
          <Inline justify="between" align="center" className="sw-full-width">
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
            CSS is imported from @scalewing/react/styles.css. This app does not
            vendor a copy of those classes.
          </Text>
          <Card padding={4}>
            <Stack gap={2}>
              <Text variant="title">Sunday kickoff</Text>
              <Inline gap={3} className="sw-padding-top-4">
                <Text color="muted">North FC</Text>
                <Text variant="label">2–1</Text>
                <Text color="muted">Harbor United</Text>
              </Inline>
              <Box as="a" href="https://gitlab.com/dna-consulting/scalewing">
                Repository
              </Box>
              <Field label="Scoring">
                <select>
                  <option>PPR</option>
                  <option>Half PPR</option>
                </select>
              </Field>
            </Stack>
          </Card>
        </Stack>
      </main>
    </ThemeProvider>
  );
}
