import { Button, Inline, Stack, Switch, Text, Tooltip } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function TooltipSection() {
  const [pressCount, setPressCount] = useState(0);
  const [helpShown, setHelpShown] = useState(false);

  return (
    <Section
      id="tooltip"
      purpose="Tooltip adds supplementary help to an already named trigger. Hover, focus, or touch exposes the text; required instructions stay visible. Disabled turns the tooltip off, not its trigger, which stays mounted and keeps its focus, for help that is shown as text at some widths."
      title="Tooltip"
      usage={`<Tooltip
  content="Sighting records include the observation time"
  trigger={<Button aria-label="Sighting details" onPress={openDetails}>?</Button>}
/>

<Tooltip
  content="Where each species lives"
  disabled={helpShown}
  trigger={<Button aria-label="Habitat map" onPress={openMap}>{icon}</Button>}
/>
{helpShown ? <Text variant="caption">Where each species lives</Text> : null}`}
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
            content="Where each species lives"
            disabled={helpShown}
            trigger={
              <Button
                aria-label="Habitat map"
                onPress={() => setPressCount((count) => count + 1)}
                variant="secondary"
              >
                ⌖
              </Button>
            }
          />
          {helpShown ? (
            <Text color="muted" variant="caption">
              Where each species lives
            </Text>
          ) : null}
        </Inline>
        <Switch
          checked={helpShown}
          description="The map's help shows as text, so its tooltip is off"
          label="Show the map's help"
          onCheckedChange={setHelpShown}
        />
        <Text color="muted" variant="caption">
          Actions pressed: {pressCount}. The tooltip supplements each button
          name.
        </Text>
      </Stack>
    </Section>
  );
}
