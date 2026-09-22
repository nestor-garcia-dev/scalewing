import { Card, DenominationGrid, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

const tagColumns = [
  { key: 'xs', label: 'XS' },
  { key: 's', label: 'S' },
  { key: 'm', label: 'M' },
  { key: 'l', label: 'L' },
  { key: 'xl', label: 'XL' },
  { key: 'xxl', label: 'XXL' },
] as const;

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
  return (
    <svg
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 16 16"
      width="16"
    >
      <path d={path} />
    </svg>
  );
}

export function DenominationGridSection() {
  return (
    <Section
      id="denomination-grid"
      purpose="DenominationGrid shows counts per unit across a fixed set of columns: the strip layout is a captioned table with a toned row label, muted zeros, signed deltas, and an optional total; the tiles layout stacks label, count, and a consumer-formatted subtotal per column. Icons are consumer slots."
      title="DenominationGrid"
      usage={`<DenominationGrid
  label="Tag movement by size"
  columns={[{ key: 'xs', label: 'XS' }, { key: 's', label: 'S' }]}
  rows={[
    { id: 'in', label: 'Tagged', tone: 'success', cells: [12, 0], total: '+124 g' },
    { id: 'net', label: 'Net', cells: [12, -3], signed: true, total: '+96 g' },
  ]}
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
                  total: '-99 g',
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
              Tags in the field kit
            </Text>
            <DenominationGrid
              columns={tagColumns}
              label="Tags in the field kit"
              layout="tiles"
              rows={[{ id: 'kit', label: 'Kit', cells: [40, 25, 0, 12, 6, 2] }]}
              subtotal={(count, column) =>
                `${count * tagWeightGrams[column.key as keyof typeof tagWeightGrams]} g`
              }
            />
          </Stack>
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
                cells: [40, 24, 0, 12, 6, 2],
                total: 'One S tag short',
              },
            ]}
          />
        </Card>
        <Text color="muted" variant="caption">
          Zero and null counts render the zero label at quiet opacity. A signed
          row prefixes positive counts and tones them by sign. Totals are
          consumer-formatted strings; on a phone the strip moves each total
          under its row label.
        </Text>
      </Stack>
    </Section>
  );
}
