import { Stack, TabPanel, Tabs, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

const tabs = [
  { id: 'forest', label: 'Forest' },
  { id: 'savanna', label: 'Savanna' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'alpine', label: 'Alpine' },
  { id: 'wetland', label: 'Wetland' },
  { id: 'desert', label: 'Desert' },
] as const;

type HabitatId = (typeof tabs)[number]['id'];

const notes: Record<HabitatId, string> = {
  forest: 'Red fox and tawny owl; 612 sightings this season.',
  savanna: 'Lion pride and giraffe herd; 418 sightings.',
  ocean: 'Green sea turtle and blue whale; 96 sightings.',
  alpine: 'Snow leopard at the ridge; 8 sightings.',
  wetland: 'Grey heron along the reed beds; 140 sightings.',
  desert: 'Fennec fox after dusk; 10 sightings.',
};

export function TabsSection() {
  const [habitat, setHabitat] = useState<HabitatId>('forest');

  return (
    <Section
      id="tabs"
      purpose="Tabs is the strip for the sections of one page: tablist semantics, an accent underline under the current tab, arrow keys, Home and End to move and select, and sideways scrolling when the labels overflow. Each tab pairs with a TabPanel. Use SegmentedControl for an exclusive choice that changes what a form does, Nav for destinations."
      title="Tabs"
      usage={`<Tabs
  id="habitats"
  aria-label="Habitats"
  items={[{ id: 'forest', label: 'Forest' }, { id: 'ocean', label: 'Ocean' }]}
  value={habitat}
  onChange={setHabitat}
/>
<TabPanel tabsId="habitats" id="forest" value={habitat}>…</TabPanel>
<TabPanel tabsId="habitats" id="ocean" value={habitat}>…</TabPanel>`}
    >
      <Stack gap={3}>
        <Tabs
          aria-label="Habitats"
          id="habitats"
          items={tabs}
          onChange={(id) => setHabitat(id as HabitatId)}
          value={habitat}
        />
        {tabs.map((tab) => (
          <TabPanel id={tab.id} key={tab.id} tabsId="habitats" value={habitat}>
            <Text>{notes[tab.id]}</Text>
          </TabPanel>
        ))}
        <Text color="muted" variant="caption">
          Only the current panel is shown; the others carry the hidden attribute
          so a product can keep them mounted or render one at a time.
        </Text>
      </Stack>
    </Section>
  );
}
