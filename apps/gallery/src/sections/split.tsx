import { Card, Inline, Split, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function SplitSection() {
  return (
    <Section
      id="split"
      purpose="Split is a start pane with a drag separator, a max width, and collapse when dragged too small. Inline cannot resize. Accordion discloses a block; it does not change column width."
      title="Split"
      usage={`<Split label="Watch list">
  <Text>Range notes stay labeled.</Text>
</Split>`}
    >
      <Inline align="stretch">
        <Split label="Watch list">
          <Card padding={4}>
            <Stack gap={3}>
              <Text variant="title">Watch list</Text>
              <Text>
                Higher range raises the watch score. Wintering grounds stay
                labeled.
              </Text>
            </Stack>
          </Card>
        </Split>
        <Stack className="sw-grow" gap={3}>
          <Text variant="title">Census</Text>
          <Text>Census counts stay a column. Habitat loss is subtracted.</Text>
        </Stack>
      </Inline>
    </Section>
  );
}
