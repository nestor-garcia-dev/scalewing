import { Card, Inline, Stack, Text, ThemeProvider } from '@scalewing/react';
import { useState } from 'react';

export function App() {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeProvider colorScheme={scheme}>
      <main className="sw-container sw-padding-4">
        <Stack gap={4}>
          <Inline justify="between" align="center" className="sw-full-width">
            <Text variant="heading">Scalewing</Text>
            <button
              type="button"
              className="sw-padding-x-3 sw-padding-y-2"
              onClick={() =>
                setScheme((current) => (current === 'light' ? 'dark' : 'light'))
              }
            >
              {scheme === 'light' ? 'Dark theme' : 'Light theme'}
            </button>
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
            </Stack>
          </Card>
        </Stack>
      </main>
    </ThemeProvider>
  );
}
