import { Button, ButtonGroup, Card, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

export function ButtonGroupSection() {
  const [lastPress, setLastPress] = useState('None yet');
  const [view, setView] = useState<'list' | 'map'>('list');

  return (
    <Section
      id="button-group"
      purpose="ButtonGroup is the action row of a form or dialog. From the md breakpoint up the buttons sit on one line, at the end by default; on a phone they stack full width in source order, so put the primary action last. attached joins the buttons into one control, such as Previous, Today and Next: no gap, single dividers, square inner corners; it keeps its row on a phone. appearance track (attached only) sets the buttons as words on one quiet grey track with a hairline between them."
      title="ButtonGroup"
      usage={`<ButtonGroup>
  <Button variant="secondary" onPress={discard}>Discard</Button>
  <Button onPress={save}>Save sighting</Button>
</ButtonGroup>

<ButtonGroup justify="between">
  <Button variant="secondary" onPress={back}>Back</Button>
  <Button onPress={next}>Next transect</Button>
</ButtonGroup>`}
    >
      <Stack gap={4}>
        <Card variant="outlined">
          <Stack gap={3}>
            <Text>Log a heron sighting on the marsh transect.</Text>
            <ButtonGroup aria-label="Sighting actions">
              <Button
                variant="secondary"
                onPress={() => setLastPress('Discard')}
              >
                Discard
              </Button>
              <Button onPress={() => setLastPress('Save sighting')}>
                Save sighting
              </Button>
            </ButtonGroup>
          </Stack>
        </Card>
        <ButtonGroup justify="between" aria-label="Transect actions">
          <Button variant="secondary" onPress={() => setLastPress('Back')}>
            Back
          </Button>
          <Button onPress={() => setLastPress('Next transect')}>
            Next transect
          </Button>
        </ButtonGroup>
        <Text variant="label">Attached: one joined control</Text>
        <ButtonGroup aria-label="Survey day" attached>
          <Button
            aria-label="Previous day"
            onPress={() => setLastPress('Previous day')}
            variant="secondary"
          >
            <Glyph path="M10 3 5 8l5 5" />
          </Button>
          <Button onPress={() => setLastPress('Today')} variant="secondary">
            Today
          </Button>
          <Button
            aria-label="Next day"
            disabled
            onPress={() => setLastPress('Next day')}
            variant="secondary"
          >
            <Glyph path="M6 3l5 5-5 5" />
          </Button>
        </ButtonGroup>
        <Text variant="label">Attached on one grey track</Text>
        <ButtonGroup appearance="track" aria-label="Survey week" attached>
          <Button
            aria-label="Previous week"
            onPress={() => setLastPress('Previous week')}
            size="sm"
            variant="secondary"
          >
            <Glyph path="M10 3 5 8l5 5" />
          </Button>
          <Button
            onPress={() => setLastPress('This week')}
            size="sm"
            variant="secondary"
          >
            This week
          </Button>
          <Button
            aria-label="Next week"
            disabled
            onPress={() => setLastPress('Next week')}
            size="sm"
            variant="secondary"
          >
            <Glyph path="M6 3l5 5-5 5" />
          </Button>
        </ButtonGroup>
        <Text variant="label">Attached toggles and a borderless variant</Text>
        <ButtonGroup aria-label="Sighting view" attached>
          {(['list', 'map'] as const).map((option) => (
            <Button
              aria-pressed={view === option}
              key={option}
              onPress={() => setView(option)}
              variant="secondary"
            >
              {option === 'list' ? 'List' : 'Map'}
            </Button>
          ))}
        </ButtonGroup>
        <ButtonGroup aria-label="Count actions" attached>
          <Button onPress={() => setLastPress('Count')}>Count</Button>
          <Button onPress={() => setLastPress('Recount')}>Recount</Button>
        </ButtonGroup>
        <Text variant="caption">Last press: {lastPress}</Text>
      </Stack>
    </Section>
  );
}
