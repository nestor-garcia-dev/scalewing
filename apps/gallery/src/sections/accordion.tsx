import { Accordion, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function AccordionSection() {
  const [openId, setOpenId] = useState<'range' | 'habitat' | null>('range');

  return (
    <Section
      id="accordion"
      purpose="Accordion is a native details disclosure in page flow. Card is always expanded. Dialog leaves the canvas."
      title="Accordion"
      usage={`<Accordion open={open} onOpenChange={setOpen} title="Why we watch">
  <Text>Habitat loss is subtracted.</Text>
</Accordion>`}
    >
      <Stack gap={3}>
        <Accordion
          onOpenChange={(open) => {
            setOpenId(open ? 'range' : null);
          }}
          open={openId === 'range'}
          title="Range"
        >
          <Text>
            Higher range raises the watch score. Wintering grounds stay labeled.
          </Text>
        </Accordion>
        <Accordion
          onOpenChange={(open) => {
            setOpenId(open ? 'habitat' : null);
          }}
          open={openId === 'habitat'}
          title="Habitat"
        >
          <Text>Habitat loss is subtracted. Census counts stay a column.</Text>
        </Accordion>
      </Stack>
    </Section>
  );
}
