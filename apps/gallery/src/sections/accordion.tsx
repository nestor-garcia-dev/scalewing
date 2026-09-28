import { Accordion, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function AccordionSection() {
  const [openId, setOpenId] = useState<'range' | 'habitat' | null>('range');
  const [methodOpen, setMethodOpen] = useState(false);

  return (
    <Section
      id="accordion"
      purpose="Accordion is a native details disclosure in page flow with a token chevron that turns when it opens. subtitle adds one muted line under the title. size sm is a quieter disclosure nested inside other content. Card is always expanded. Dialog leaves the canvas."
      title="Accordion"
      usage={`<Accordion
  open={open}
  onOpenChange={setOpen}
  subtitle="Twelve sightings · Two nests"
  title="Wetlands"
>
  <Text>Habitat loss is subtracted.</Text>
</Accordion>`}
    >
      <Stack gap={3}>
        <Accordion
          onOpenChange={(open) => {
            setOpenId(open ? 'range' : null);
          }}
          open={openId === 'range'}
          subtitle="Four regions · Wintering grounds labeled"
          title="Range"
        >
          <Text>
            Higher range raises the watch score. Wintering grounds stay labeled.
          </Text>
          <Accordion
            onOpenChange={setMethodOpen}
            open={methodOpen}
            size="sm"
            title="How the range is measured"
          >
            <Text>
              Field teams walk fixed transects at dawn and plot each sighting.
            </Text>
          </Accordion>
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
