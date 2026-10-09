import { Box, Card, Stack, TabPanel, Tabs, Text } from '@scalewing/react';
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

const reserveTabs = [
  { id: 'birds', label: 'Birds' },
  { id: 'mammals', label: 'Mammals' },
  { id: 'amphibians', label: 'Amphibians' },
  { id: 'plants', label: 'Plants' },
] as const;

type ReserveId = (typeof reserveTabs)[number]['id'];

const reserveLog: Record<ReserveId, readonly string[]> = {
  birds: [
    'Grey heron · Reed bed edge',
    'Curlew · Mudflat',
    'Great crested grebe · Open water',
    'Skylark · Hay meadow',
    'Tawny owl · Oak copse',
    'Kingfisher · Stream bank',
    'Redshank · Salt marsh',
    'Nuthatch · Beech hanger',
  ],
  mammals: [
    'Water vole · Alder carr',
    'Dormouse · Hedgerow',
    'Otter · River mouth',
    'Roe deer · Woodland ride',
    'Pipistrelle · Pond edge',
    'Harvest mouse · Reed bed',
  ],
  amphibians: [
    'Common toad · Breeding pond',
    'Great crested newt · Field pond',
    'Common frog · Ditch',
    'Palmate newt · Heath pool',
    'Natterjack toad · Dune slack',
    'Smooth newt · Garden pond',
  ],
  plants: [
    'Marsh marigold · Wet meadow',
    'Bogbean · Fen pool',
    'Yellow flag · Reed bed edge',
    'Ragged robin · Damp pasture',
    'Sundew · Bog',
    'Water mint · Stream bank',
  ],
};

/**
 * A long page in a phone-tall frame (the frame scrolls as a page would), so
 * the strip sticks to the frame's top instead of under the gallery header.
 */
function StickyTabsPage() {
  const [group, setGroup] = useState<ReserveId>('birds');

  return (
    <Box
      border
      className="gallery-page-frame"
      data-testid="tabs-sticky-page"
      radius="lg"
    >
      <Stack gap={3}>
        <Box paddingTop={4} paddingX={4}>
          <Text variant="title">Wetland reserve</Text>
        </Box>
        <Tabs
          aria-label="Reserve log"
          id="reserve"
          items={reserveTabs}
          onChange={(id) => setGroup(id as ReserveId)}
          sticky
          value={group}
        />
        <Box paddingBottom={4} paddingX={4}>
          {reserveTabs.map((tab) => (
            <TabPanel id={tab.id} key={tab.id} tabsId="reserve" value={group}>
              <Stack gap={3}>
                {reserveLog[tab.id].map((entry) => (
                  <Card key={entry} padding={4} variant="outlined">
                    <Text>{entry}</Text>
                  </Card>
                ))}
              </Stack>
            </TabPanel>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}

export function TabsSection() {
  const [habitat, setHabitat] = useState<HabitatId>('forest');

  return (
    <Section
      id="tabs"
      purpose="Tabs is the strip for the sections of one page: tablist semantics, an accent underline under the current tab, arrow keys, Home and End to move and select, and sideways scrolling when the labels overflow, with a shade on each edge that has more tabs past it, as a wide Table has (narrow the window to see it). Each tab pairs with a TabPanel. sticky keeps the strip at the top of the viewport while a long panel scrolls under it: a full-bleed band of the page canvas with its hairline, a little see-through over the glass blur, solid under Reduce Transparency. A sticky strip only sticks within its parent, so make it a direct child of the page container that holds the panels and put the side gutter on the title and panels; each tab's 16 px inline padding lines the first label up with a space-4 gutter. Use SegmentedControl for an exclusive choice that changes what a form does, Nav for destinations."
      title="Tabs"
      usage={`<Tabs
  id="habitats"
  aria-label="Habitats"
  items={[{ id: 'forest', label: 'Forest' }, { id: 'ocean', label: 'Ocean' }]}
  value={habitat}
  onChange={setHabitat}
/>
<TabPanel tabsId="habitats" id="forest" value={habitat}>…</TabPanel>
<TabPanel tabsId="habitats" id="ocean" value={habitat}>…</TabPanel>

// sticky: a direct child of the long page, gutter on the title and panels.
<Stack gap={3}>
  <Box paddingX={4}><Text variant="title">Wetland reserve</Text></Box>
  <Tabs sticky id="reserve" aria-label="Reserve log" items={groups} value={group} onChange={setGroup} />
  <Box paddingX={4}>
    <TabPanel tabsId="reserve" id="birds" value={group}>…</TabPanel>
  </Box>
</Stack>`}
    >
      <Stack gap={5}>
        <Stack gap={3}>
          <Tabs
            aria-label="Habitats"
            id="habitats"
            items={tabs}
            onChange={(id) => setHabitat(id as HabitatId)}
            value={habitat}
          />
          {tabs.map((tab) => (
            <TabPanel
              id={tab.id}
              key={tab.id}
              tabsId="habitats"
              value={habitat}
            >
              <Text>{notes[tab.id]}</Text>
            </TabPanel>
          ))}
          <Text color="muted" variant="caption">
            Only the current panel is shown; the others carry the hidden
            attribute so a product can keep them mounted or render one at a
            time.
          </Text>
        </Stack>
        <Stack gap={3}>
          <Text color="muted" variant="caption">
            sticky: scroll the reserve page. The strip stays at its top while
            the log scrolls under it.
          </Text>
          <StickyTabsPage />
        </Stack>
      </Stack>
    </Section>
  );
}
