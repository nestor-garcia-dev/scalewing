import { Button, ButtonGroup, Card, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function ButtonGroupSection() {
  const [lastPress, setLastPress] = useState('None yet');

  return (
    <Section
      id="button-group"
      purpose="ButtonGroup is the action row of a form or dialog. From the md breakpoint up the buttons sit on one line, at the end by default; on a phone they stack full width in source order, so put the primary action last."
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
        <Text variant="caption">Last press: {lastPress}</Text>
      </Stack>
    </Section>
  );
}
