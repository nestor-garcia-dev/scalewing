import { Card, DenominationGrid, Stack, Text } from '@scalewing/react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const tagColumns = [
  { key: 'xs', label: 'XS' },
  { key: 's', label: 'S' },
  { key: 'm', label: 'M' },
  { key: 'l', label: 'L' },
  { key: 'xl', label: 'XL' },
  { key: 'xxl', label: 'XXL' },
] as const;

const hourColumns = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((hour) => ({
  key: `h${hour}`,
  label: `${hour}h`,
}));

const tagWeightGrams: Record<(typeof tagColumns)[number]['key'], number> = {
  xs: 5,
  s: 8,
  m: 12,
  l: 20,
  xl: 35,
  xxl: 60,
};

function ArrowGlyph({ direction }: { direction: 'in' | 'out' | 'sum' }) {
  const path =
    direction === 'in'
      ? 'M8 3v8m0 0-3-3m3 3 3-3M3 13h10'
      : direction === 'out'
        ? 'M8 13V5m0 0-3 3m3-3 3 3M3 3h10'
        : 'M4 3h8l-5 5 5 5H4';
  return <Glyph path={path} />;
}

export function DenominationGridSection() {
  return (
    <Section
      id="denomination-grid"
      purpose="DenominationGrid shows counts per unit across a fixed set of columns: the strip layout is a captioned table with a toned row label, muted zeros, signed deltas, and an optional total; the tiles layout stacks label, count, and a consumer-formatted subtotal per column. A lone tiles row without an icon or total whose label repeats the grid's is named only by the grid; any other row names its own region, or its own group with rowRole set to group, so a page of grids keeps its landmark list short. Icons are consumer slots; a row's glyph stays on its label's line, and a long label wraps its words beside the glyph."
      title="DenominationGrid"
      usage={`<DenominationGrid
  label="Tag movement by size"
  columns={[{ key: 'xs', label: 'XS' }, { key: 's', label: 'S' }]}
  rows={[
    { id: 'in', label: 'Tagged', tone: 'success', cells: [12, 0], total: '+124 g' },
    { id: 'net', label: 'Net', cells: [12, -3], signed: true, total: '+96 g' },
  ]}
  totalLabel="Total weight"
/>`}
    >
      <Stack gap={4}>
        <Card padding={4}>
          <Stack gap={2}>
            <Text color="muted" variant="label">
              Tag movement by size
            </Text>
            <DenominationGrid
              columns={tagColumns}
              label="Tag movement by size"
              totalLabel="Total weight"
              rows={[
                {
                  id: 'in',
                  label: 'Tagged',
                  tone: 'success',
                  icon: <ArrowGlyph direction="in" />,
                  cells: [12, 4, 0, 9, 2, 1],
                  total: '+367 g',
                },
                {
                  id: 'out',
                  label: 'Released',
                  tone: 'danger',
                  icon: <ArrowGlyph direction="out" />,
                  cells: [3, 0, 2, 0, 0, 1],
                  total: '−99 g',
                },
                {
                  id: 'net',
                  label: 'Net',
                  icon: <ArrowGlyph direction="sum" />,
                  cells: [9, 4, -2, 9, 2, 0],
                  signed: true,
                  total: '+268 g',
                },
              ]}
            />
          </Stack>
        </Card>
        <Card padding={4}>
          <Stack gap={2}>
            <Text color="muted" variant="label">
              Den watch
            </Text>
            <DenominationGrid
              columns={tagColumns}
              label="Den watch by tag size"
              rows={[
                {
                  id: 'returned',
                  label: 'Returned to the den at dusk',
                  tone: 'success',
                  icon: <ArrowGlyph direction="in" />,
                  cells: [4, 2, 0, 1, 0, 0],
                },
                {
                  id: 'left',
                  label: 'Left',
                  tone: 'danger',
                  icon: <ArrowGlyph direction="out" />,
                  cells: [1, 0, 0, 0, 0, 0],
                },
              ]}
            />
          </Stack>
        </Card>
        <Card padding={4}>
          <Stack gap={2}>
            <Text color="muted" variant="label">
              Sightings by hour
            </Text>
            <DenominationGrid
              columns={hourColumns}
              label="Sightings by hour"
              rows={[
                {
                  id: 'birds',
                  label: 'Birds',
                  tone: 'accent',
                  cells: [14, 22, 18, 9, 6, 4, 3, 5, 8, 12, 16],
                  total: '117 sightings',
                },
                {
                  id: 'mammals',
                  label: 'Mammals',
                  cells: [6, 3, 1, 0, 0, 0, 1, 0, 2, 4, 7],
                  total: '24 sightings',
                },
              ]}
            />
          </Stack>
        </Card>
        <Card padding={4}>
          <Stack gap={2}>
            <Text color="muted" variant="label">
              Field kit check
            </Text>
            <Card padding={3} variant="outlined">
              <DenominationGrid
                columns={tagColumns}
                label="Kit check by size"
                rows={[
                  {
                    id: 'expected',
                    label: 'Expected',
                    cells: [40, 25, 0, 12, 6, 2],
                    total: '1,020 g',
                  },
                  {
                    id: 'counted',
                    label: 'Counted',
                    cells: [40, 24, 0, 12, 6, 2],
                    total: '1,012 g',
                  },
                  {
                    id: 'difference',
                    label: 'Difference',
                    tone: 'danger',
                    cells: [0, -1, 0, 0, 0, 0],
                    signed: true,
                    total: '−8 g',
                  },
                ]}
              />
            </Card>
          </Stack>
        </Card>
        <Card padding={4}>
          <Stack gap={2}>
            <Text color="muted" variant="label">
              Tags in the field kit
            </Text>
            <DenominationGrid
              columns={tagColumns}
              label="Tags in the field kit"
              layout="tiles"
              rows={[
                {
                  id: 'kit',
                  label: 'Tags in the field kit',
                  cells: [40, 25, 0, 12, 6, 2],
                },
              ]}
              subtotal={(count, column) =>
                `${count * tagWeightGrams[column.key as keyof typeof tagWeightGrams]} g`
              }
            />
          </Stack>
        </Card>
        <Card padding={4}>
          <DenominationGrid
            columns={tagColumns}
            label="Tags fitted today"
            layout="tiles"
            rows={[
              {
                id: 'fitted',
                label: 'Fitted',
                cells: [2, 1, 0, 0, 1, 0],
                total: '53 g',
              },
            ]}
          />
        </Card>
        <Card padding={4}>
          <DenominationGrid
            columns={tagColumns}
            label="Kit audit"
            layout="tiles"
            rows={[
              {
                id: 'expected',
                label: 'Expected',
                cells: [40, 25, 0, 12, 6, 2],
              },
              {
                id: 'counted',
                label: 'Counted',
                tone: 'danger',
                icon: <ArrowGlyph direction="sum" />,
                cells: [40, 24, 0, 12, 6, 2],
                total: 'One S tag short',
              },
            ]}
          />
        </Card>
        <Card padding={4}>
          <DenominationGrid
            columns={tagColumns}
            label="Nest box check"
            layout="tiles"
            rowRole="group"
            rows={[
              {
                id: 'fitted',
                label: 'Fitted',
                cells: [6, 4, 0, 2, 0, 0],
              },
              {
                id: 'occupied',
                label: 'Occupied',
                cells: [5, 2, 0, 1, 0, 0],
              },
            ]}
          />
        </Card>
        <Text color="muted" variant="caption">
          Zero and null counts render the zero label at quiet opacity. A signed
          row prefixes positive counts and tones them by sign; a negative count
          takes the typographic minus (−2), not a hyphen. Totals are
          consumer-formatted strings; totalLabel names their column for a screen
          reader. On a phone the strip shows each total under its row label and
          keeps the total cell in the table, visually hidden. A strip wider than
          its container scrolls sideways inside it with the row labels pinned;
          the page never scrolls sideways. Each named tiles row is a region by
          default; rowRole="group" keeps its name without making it a landmark.
        </Text>
      </Stack>
    </Section>
  );
}
