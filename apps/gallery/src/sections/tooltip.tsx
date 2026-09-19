import { Button, Inline, Stack, Text, Tooltip } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function TooltipSection() {
  const [pressCount, setPressCount] = useState(0);

  return (
    <Section
      id="tooltip"
      purpose="Tooltip adds supplementary help to an already named trigger. Hover, focus, or touch exposes the text; required instructions stay visible."
      title="Tooltip"
      usage={`<Tooltip
  content="Sighting records include the observation time"
  trigger={<Button aria-label="Sighting details" onPress={openDetails}>?</Button>}
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
        </Inline>
        <Text color="muted" variant="caption">
          Actions pressed: {pressCount}. The tooltip supplements each button
          name.
        </Text>
      </Stack>
    </Section>
  );
}
