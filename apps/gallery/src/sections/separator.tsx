import { Inline, Separator, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function SeparatorSection() {
  return (
    <Section
      id="separator"
      purpose="Separator divides related sections. Use semantic mode when a division carries meaning and decorative mode when the line only supports layout."
      title="Separator"
      usage={`<Separator />
<Separator orientation="vertical" />
<Separator decorative />`}
    >
      <Stack gap={3}>
        <Text>Forest sightings</Text>
        <Separator />
        <Text>Coastal sightings</Text>
        <Inline align="stretch" gap={3}>
          <Text>Forest</Text>
          <Separator orientation="vertical" />
          <Text>Coast</Text>
        </Inline>
        <Separator decorative />
      </Stack>
    </Section>
  );
}
