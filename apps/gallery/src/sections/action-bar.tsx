import { ActionBar, Button, Card, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

const transectStops = [
  'Stop 1 · Reed bed edge · Grey heron',
  'Stop 2 · Mudflat · Curlew',
  'Stop 3 · Alder carr · Water vole',
  'Stop 4 · Open water · Great crested grebe',
  'Stop 5 · Hay meadow · Skylark',
  'Stop 6 · Hedgerow · Dormouse',
  'Stop 7 · Oak copse · Tawny owl',
  'Stop 8 · Stream bank · Kingfisher',
] as const;

export function ActionBarSection() {
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Section
      id="action-bar"
      purpose="ActionBar keeps a long page's actions on a glass bar stuck to the bottom of the viewport, with one short status line. Put it last in the content it acts on: it stays stuck while that content scrolls by and rests at the end. stickyBelow md keeps it in page flow on wider screens. It clears the bottom safe area."
      title="ActionBar"
      usage={`<Stack gap={4}>
  {longForm}
  <ActionBar status="Survey saved at 5:00 PM">
    <Button variant="secondary" onPress={save}>Save survey</Button>
    <Button onPress={submit}>Submit sightings</Button>
  </ActionBar>
</Stack>

<ActionBar stickyBelow="md" status="Not saved yet">…</ActionBar>`}
    >
      <Stack gap={5}>
        <Stack data-testid="action-bar-survey" gap={3}>
          {transectStops.map((stop) => (
            <Card key={stop} padding={4} variant="outlined">
              <Text>{stop}</Text>
            </Card>
          ))}
          <ActionBar
            aria-label="Survey actions"
            role="region"
            status={
              submitted
                ? 'Sightings submitted'
                : savedAt
                  ? `Survey saved at ${savedAt}`
                  : 'Not saved yet'
            }
          >
            <Button variant="secondary" onPress={() => setSavedAt('5:00 PM')}>
              Save survey
            </Button>
            <Button onPress={() => setSubmitted(true)}>Submit sightings</Button>
          </ActionBar>
        </Stack>
        <Stack data-testid="action-bar-below-md" gap={3}>
          <Text variant="caption" color="muted">
            stickyBelow md: stuck on a phone, in page flow from md up.
          </Text>
          <Card padding={4} variant="outlined">
            <Text>Night count · Bat detector at the pond</Text>
          </Card>
          <ActionBar stickyBelow="md" status="Night count not saved yet">
            <Button onPress={() => undefined} variant="secondary">
              Save count
            </Button>
          </ActionBar>
        </Stack>
      </Stack>
    </Section>
  );
}
