import { Grid, Stack, StatTile, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

function Glyph({ path }: { path: string }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      width="20"
    >
      <path d={path} />
    </svg>
  );
}

const paw =
  'M12 14c-3 0-5 2-5 4a3 3 0 0 0 5 2 3 3 0 0 0 5-2c0-2-2-4-5-4Zm-6-3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z';
const leaf =
  'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 21 2c1 2 2 4.5 2 8 0 5.5-4.8 10-10 10Z M2 22c1.25-1.25 2.5-2.5 3.5-4';

export function StatTileSection() {
  return (
    <Section
      id="stat-tile"
      purpose="StatTile is one prominent figure with its label: the tiles a report or a list opens with. The consumer formats the number and supplies the glyph; tone colours the value; emphasis primary fills the one figure a page leads with."
      title="StatTile"
      usage={`<StatTile label="Sightings" value="1,284" glyph={<Binoculars />} />

<StatTile
  emphasis="primary"
  label="Total sightings"
  value="1,284"
  caption="42 species this season"
/>

<StatTile label="Range change" value="-3" tone="danger" />`}
    >
      <Stack gap={4}>
        <StatTile
          caption="42 species across 6 habitats this season"
          emphasis="primary"
          glyph={<Glyph path={paw} />}
          label="Total sightings"
          value="1,284"
        />
        <Grid columns={4} columnsBelow={{ md: 1 }} gap={3}>
          <StatTile
            glyph={<Glyph path={leaf} />}
            label="Forest"
            tone="success"
            value="612"
          />
          <StatTile label="Savanna" tone="accent" value="418" />
          <StatTile label="Unconfirmed" tone="warning" value="27" />
          <StatTile
            caption="since last census"
            label="Range change"
            tone="danger"
            value="-3"
          />
        </Grid>
        <Text color="muted" variant="caption">
          Values are tabular so a row of tiles lines up. The tile sizes to its
          grid cell; a caption wraps under the value.
        </Text>
      </Stack>
    </Section>
  );
}
