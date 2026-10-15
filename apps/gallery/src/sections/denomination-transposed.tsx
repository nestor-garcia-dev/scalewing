import { Card, DenominationGrid, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

const ringColumns = [
  { key: 'one', label: '1 ring' },
  { key: 'five', label: '5 rings', caption: 'a strip' },
  { key: 'ten', label: '10 rings' },
  { key: 'twenty', label: '20 rings' },
  { key: 'fifty', label: '50 rings' },
  { key: 'hundred', label: '100 rings' },
  { key: 'box', label: 'Boxes', caption: 'of 500' },
] as const;

const ringsPer = [1, 5, 10, 20, 50, 100, 500] as const;

type Counts = (number | null)[];

/** Each column's rings, blank for none. */
function rings(counts: readonly (number | null)[]): (string | null)[] {
  return counts.map((count, index) =>
    count ? (count * ringsPer[index]!).toLocaleString('en-US') : null,
  );
}

function total(counts: readonly (number | null)[]): string {
  return counts
    .reduce<number>(
      (sum, count, index) => sum + (count ?? 0) * ringsPer[index]!,
      0,
    )
    .toLocaleString('en-US');
}

/**
 * The board options: counts of four digits with room for them in seven
 * columns, rings given out as signed counts that are not an error (plain,
 * never red), and on a phone the same grid transposed, a row per size.
 */
export function DenominationTransposedExample() {
  const [kept, setKept] = useState<Counts>([1200, 40, null, 12, 4, 2, 1]);
  const given = [-300, -10, 0, -2, 0, 0, 0];
  return (
    <Card padding={4}>
      <Stack gap={2}>
        <Text color="muted" variant="label">
          Bird rings at the station
        </Text>
        <DenominationGrid
          columns={ringColumns}
          countDigits={4}
          label="Bird rings at the station"
          labelAppearance="plain"
          totalLabel="Total"
          transposeBelow="md"
          zeroLabel=""
          rows={[
            {
              id: 'kept',
              label: 'Keep on hand',
              cells: kept,
              total: total(kept),
              valueRow: { label: 'Rings', cells: rings(kept) },
              entry: {
                decrementLabel: 'One fewer',
                incrementLabel: 'One more',
                placeholder: '0',
                onChange: (key, value) =>
                  setKept((counts) =>
                    counts.map((count, index) =>
                      ringColumns[index]!.key === key ? value : count,
                    ),
                  ),
              },
            },
            {
              id: 'given',
              label: 'Given out',
              caption: 'to the field teams',
              cells: given,
              signed: true,
              negativeAppearance: 'plain',
              emphasis: 'quiet',
              total: `−${total(given.map((count) => -count))}`,
            },
            {
              id: 'returned',
              label: 'Returned',
              caption: 'none due yet',
              disabled: true,
              cells: [null, null, null, null, null, null, null],
              total: '0',
            },
          ]}
        />
        <Text color="muted" variant="caption">
          countDigits 4 keeps a four-digit count whole in seven columns before
          the strip scrolls. negativeAppearance plain sets the rings given out
          in the text colour with their minus: going out is not an error (a
          quiet row to compare against; Returned does not apply yet).
          transposeBelow md draws the grid with a row per size on a phone, the
          rows as columns and the totals last.
        </Text>
      </Stack>
    </Card>
  );
}
