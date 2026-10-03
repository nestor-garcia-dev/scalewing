import {
  Accordion,
  ActionBar,
  Badge,
  Button,
  Card,
  Select,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';
import { sampleHabitats } from '../sample-copy.js';

const transectStops = [
  'Stop 1 · Reed bed edge · Grey heron',
  'Stop 2 · Mudflat · Curlew',
  'Stop 3 · Alder carr · Water vole',
  'Stop 4 · Open water · Great crested grebe',
  'Stop 5 · Hay meadow · Skylark',
  'Stop 6 · Hedgerow · Dormouse',
  'Stop 7 · Oak copse · Tawny owl',
  'Stop 8 · Stream bank · Kingfisher',
  'Stop 9 · Salt marsh · Redshank',
  'Stop 10 · Beech hanger · Nuthatch',
  'Stop 11 · Chalk grassland · Adonis blue',
] as const;

export function ActionBarSection() {
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [habitatOpen, setHabitatOpen] = useState(true);
  const [habitat, setHabitat] = useState('forest');
  const [countSaved, setCountSaved] = useState(false);

  return (
    <Section
      id="action-bar"
      purpose="ActionBar keeps a long page's actions on a glass bar stuck to the bottom of the viewport, with one short status: a line, or a Badge and a line on one row that wraps under the badge when it is full. Put it last in the content it acts on: it stays stuck while that content scrolls by and rests at the end. stickyBelow md keeps it in page flow on wider screens. It clears the bottom safe area. Its status line is a polite live region, so a new status is announced. An open popup, such as a Select list in an Accordion, paints over the bar."
      title="ActionBar"
      usage={`<Stack gap={4}>
  {longForm}
  <ActionBar status="Survey saved at 5:00 PM">
    <Button variant="secondary" onPress={save}>Save survey</Button>
    <Button onPress={submit}>Submit sightings</Button>
  </ActionBar>
</Stack>

<ActionBar
  stickyBelow="md"
  status={saved ? <><Badge tone="accent">Saved</Badge><span>6 bat passes</span></> : undefined}
>…</ActionBar>`}
    >
      <Stack gap={5}>
        <Stack data-testid="action-bar-survey" gap={3}>
          {transectStops.slice(0, 4).map((stop) => (
            <Card key={stop} padding={4} variant="outlined">
              <Text>{stop}</Text>
            </Card>
          ))}
          <Accordion
            data-testid="action-bar-habitat"
            onOpenChange={setHabitatOpen}
            open={habitatOpen}
            subtitle="An open list paints over the bar"
            title="Habitat at stop 4"
          >
            <Select
              label="Stop habitat"
              onChange={setHabitat}
              options={sampleHabitats}
              value={habitat}
            />
          </Accordion>
          {transectStops.slice(4).map((stop) => (
            <Card key={stop} padding={4} variant="outlined">
              <Text>{stop}</Text>
            </Card>
          ))}
          <ActionBar
            aria-label="Survey actions"
            role="region"
            status={
              submitted ? (
                <>
                  <Badge tone="success">Submitted</Badge>
                  <span>11 stops · 14 sightings</span>
                </>
              ) : savedAt ? (
                `Survey saved at ${savedAt}`
              ) : (
                'Not saved yet'
              )
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
            stickyBelow md: stuck on a phone, in page flow from md up. No status
            until the count is saved; then a Badge and a line, which wraps under
            the badge when it does not fit beside it.
          </Text>
          <Card padding={4} variant="outlined">
            <Text>Night count · Bat detector at the pond</Text>
          </Card>
          <ActionBar
            stickyBelow="md"
            status={
              countSaved ? (
                <>
                  <Badge tone="accent">Saved</Badge>
                  <span>
                    Night count · 6 bat passes at the pond, 2 species heard
                  </span>
                </>
              ) : undefined
            }
          >
            <Button onPress={() => setCountSaved(true)} variant="secondary">
              Save count
            </Button>
          </ActionBar>
        </Stack>
      </Stack>
    </Section>
  );
}
