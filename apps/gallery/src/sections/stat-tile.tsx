import {
  Card,
  Grid,
  Inline,
  Separator,
  Stack,
  StatTile,
  Text,
} from '@scalewing/react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const paw =
  'M12 14c-3 0-5 2-5 4a3 3 0 0 0 5 2 3 3 0 0 0 5-2c0-2-2-4-5-4Zm-6-3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z';
const leaf =
  'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 21 2c1 2 2 4.5 2 8 0 5.5-4.8 10-10 10Z M2 22c1.25-1.25 2.5-2.5 3.5-4';

/** Answers per row on a phone, shared by the grid and its hairlines. */
const phoneColumns = 2;

const plainAnswers = [
  {
    label: 'Expected on the marsh',
    value: '1,290',
    caption: 'from the spring count and every arrival since',
  },
  {
    label: 'Counted, Monday night',
    value: '1,284',
    caption: 'north colony 812 · south reeds 472',
  },
  {
    label: 'Off',
    value: '−6',
    tone: 'danger',
    caption: 'all in the north colony',
  },
  {
    label: 'Off, last 13 weeks',
    value: '+21',
    tone: 'success',
    caption: '2 nights more than 10 off',
  },
] as const;

export function StatTileSection() {
  return (
    <Section
      id="stat-tile"
      purpose="StatTile is one prominent figure with its label: the tiles a report or a list opens with. The consumer formats the number and supplies the glyph; tone colours the value; emphasis primary fills the one figure a page leads with. appearance plain drops the tile's surface, edge and padding for figures inside a card, such as four answers in a row with hairlines between them (Grid and a vertical Separator; two by two on a phone)."
      title="StatTile"
      usage={`<StatTile label="Sightings" value="1,284" glyph={<Binoculars />} />

<StatTile
  emphasis="primary"
  label="Total sightings"
  value="1,284"
  caption="42 species this season"
/>

<StatTile label="Range change" value="-3" tone="danger" />

<Card padding={5}>
  <Grid columns={4} columnsBelow={{ md: 2 }} gap={4}>
    {answers.map((answer, index) => (
      <Inline align="stretch" gap={4} key={answer.label}>
        {index > 0 ? (
          // 2 is columnsBelow md: an answer that starts a row there has no hairline.
          <Inline align="stretch" hideBelow={index % 2 === 0 ? 'md' : undefined}>
            <Separator orientation="vertical" decorative />
          </Inline>
        ) : null}
        <StatTile appearance="plain" {...answer} />
      </Inline>
    ))}
  </Grid>
</Card>`}
    >
      <Stack gap={4}>
        <StatTile
          caption="42 species across 6 habitats this season"
          emphasis="primary"
          glyph={<Glyph grid={24} path={paw} size={20} />}
          label="Total sightings"
          value="1,284"
        />
        <Grid columns={4} columnsBelow={{ md: 1 }} gap={3}>
          <StatTile
            glyph={<Glyph grid={24} path={leaf} size={20} />}
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
        <Card padding={5}>
          <Stack gap={4}>
            <Stack gap={1}>
              <Text color="muted" variant="caption">
                Did every heron on the marsh get counted?
              </Text>
              <Text as="h3" variant="title">
                Every heron accounted for, to within 6
              </Text>
            </Stack>
            <Grid columns={4} columnsBelow={{ md: phoneColumns }} gap={4}>
              {plainAnswers.map((answer, index) => (
                <Inline align="stretch" gap={4} key={answer.label}>
                  {index > 0 ? (
                    // An answer that starts a phone's row has no hairline before it.
                    <Inline
                      align="stretch"
                      hideBelow={index % phoneColumns === 0 ? 'md' : undefined}
                    >
                      <Separator decorative orientation="vertical" />
                    </Inline>
                  ) : null}
                  <StatTile appearance="plain" {...answer} />
                </Inline>
              ))}
            </Grid>
          </Stack>
        </Card>
        <Text color="muted" variant="caption">
          Values are tabular so a row of tiles lines up. The tile sizes to its
          grid cell; a caption wraps under the value.
        </Text>
      </Stack>
    </Section>
  );
}
