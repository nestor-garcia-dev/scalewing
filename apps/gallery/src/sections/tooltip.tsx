import { Button, Inline, Stack, Switch, Text, Tooltip } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function TooltipSection() {
  const [pressCount, setPressCount] = useState(0);
  const [named, setNamed] = useState(false);

  return (
    <Section
      id="tooltip"
      purpose="Tooltip adds supplementary help to an already named trigger. Hover, focus, or touch exposes the text; required instructions stay visible. disabled turns it off while the trigger stays mounted, for a name that is visible at some widths."
      title="Tooltip"
      usage={`<Tooltip
  content="Sighting records include the observation time"
  trigger={<Button aria-label="Sighting details" onPress={openDetails}>?</Button>}
/>

<Tooltip
  content="Habitat map"
  disabled={nameShown}
  trigger={<Button aria-label="Habitat map" onPress={openMap}>{icon}{nameShown ? 'Habitat map' : null}</Button>}
/>`}
    >
      <Stack gap={3}>
        <Inline gap={3}>
          <Tooltip
            content="Sighting records include the observation time"
            trigger={
              <Button
                aria-label="Sighting details"
                onPress={() => setPressCount((count) => count + 1)}
                variant="secondary"
              >
                ?
              </Button>
            }
          />
          <Tooltip
            content="The habitat guide describes local species"
            trigger={
              <Button
                onPress={() => setPressCount((count) => count + 1)}
                variant="secondary"
              >
                Habitat guide
              </Button>
            }
          />
          <Tooltip
            content="Habitat map"
            disabled={named}
            trigger={
              <Button
                aria-label="Habitat map"
                onPress={() => setPressCount((count) => count + 1)}
                variant="secondary"
              >
                {named ? 'Habitat map' : '#'}
              </Button>
            }
          />
        </Inline>
        <Switch
          checked={named}
          description="The map button shows its name, so its tooltip is off"
          label="Show the map's name"
          onCheckedChange={setNamed}
        />
        <Text color="muted" variant="caption">
          Actions pressed: {pressCount}. The tooltip supplements each button
          name.
        </Text>
      </Stack>
    </Section>
  );
}
