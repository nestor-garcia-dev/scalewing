import { FixtureGroup, FixtureRow, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

/** Two runs with different centres: `fixed` sets their centres at one place. */
function TwoRuns({ sides }: { sides: 'fluid' | 'fixed' }) {
  return (
    <Stack data-testid={`fixture-sides-${sides}`} gap={3}>
      <FixtureGroup sides={sides} title="Saturday 31 October · Salt marsh">
        <FixtureRow
          away={{ name: 'Pine Ridge' }}
          center="14–9"
          centerKind="score"
          home={{ name: 'Otter Pool' }}
          status={{ label: 'Counted', tone: 'success' }}
        />
        <FixtureRow
          away={{ name: 'Bayside Dunes with a long station name' }}
          center="6–6"
          centerKind="score"
          home={{ name: 'Bittern Fen' }}
        />
      </FixtureGroup>
      <FixtureGroup sides={sides} title="Sunday 1 November · Alder hides">
        <FixtureRow
          away={{ name: 'Otter Pool' }}
          center="8:00"
          home={{ name: 'Heron Marsh' }}
          meta="Hide 1"
        />
        <FixtureRow
          away={{ name: 'Bittern Fen' }}
          center="10:30 PM"
          home={{ name: 'Pine Ridge' }}
          meta="Hide 2"
        />
      </FixtureGroup>
    </Stack>
  );
}

export function FixtureGroupSidesSection() {
  return (
    <Section
      id="fixture-group-sides"
      purpose="FixtureGroup sides fixed keeps the centre at one place across the runs of a page: from md the sides are at most 16rem each, the centre holds a least width whatever it shows, and the end column takes the rest, with its details and action at the row's end. Below md both are the same: the end under the sides. A run with a select starts one box later. The default, fluid, shares the row between the sides."
      title="FixtureGroup sides"
      usage={`<FixtureGroup sides="fixed" title="Saturday 31 October · Salt marsh">
  <FixtureRow home={{ name: 'Otter Pool' }} away={{ name: 'Pine Ridge' }} center="14–9" centerKind="score" />
</FixtureGroup>`}
    >
      <Stack gap={5}>
        <Stack gap={2}>
          <Text color="muted" variant="caption">
            sides fixed: the centres stay in one column across the runs
          </Text>
          <TwoRuns sides="fixed" />
        </Stack>
        <Stack gap={2}>
          <Text color="muted" variant="caption">
            sides fluid, the default: each run's centre follows its own widths
          </Text>
          <TwoRuns sides="fluid" />
        </Stack>
      </Stack>
    </Section>
  );
}
