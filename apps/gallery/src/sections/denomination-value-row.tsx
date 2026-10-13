import { Card, DenominationGrid, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

const sackColumns = [
  { key: 'one', label: '1 kg' },
  { key: 'five', label: '5 kg' },
  { key: 'ten', label: '10 kg' },
  { key: 'twenty', label: '20 kg' },
] as const;

const kilosPerSack = [1, 5, 10, 20] as const;
const inStore = [4, 2, 0, 3] as const;
const returned = [1, null, null, null] as const;

type Counts = (number | null)[];

/** Each column's weight: blank for none, as the counts leave zeros blank. */
function weights(counts: readonly (number | null)[]): (string | null)[] {
  return counts.map((count, index) =>
    count ? `${count * kilosPerSack[index]!} kg` : null,
  );
}

function kilos(counts: readonly (number | null)[]): string {
  const sum = counts.reduce<number>(
    (total, count, index) => total + (count ?? 0) * kilosPerSack[index]!,
    0,
  );
  return `${sum} kg`;
}

/**
 * Value rows: a line under each row of sacks giving each column's weight,
 * the row's total on it, for counts typed (one over the store's, which its
 * message says), counts read, and a row that does not apply today.
 */
export function DenominationValueRowExample() {
  const [packed, setPacked] = useState<Counts>([2, null, 1, 3]);
  return (
    <Card padding={4}>
      <Stack gap={2}>
        <Text color="muted" variant="label">
          Seed sacks for the aviary
        </Text>
        <DenominationGrid
          columns={sackColumns}
          frame="table"
          label="Seed sacks for the aviary"
          labelAppearance="plain"
          labelWidth="md"
          totalEmphasis="strong"
          totalLabel="Total"
          zeroLabel=""
          rows={[
            {
              id: 'packed',
              label: 'Packed',
              cells: packed,
              total: kilos(packed),
              valueRow: { label: 'Weight', cells: weights(packed) },
              entry: {
                decrementLabel: 'One sack fewer',
                incrementLabel: 'One sack more',
                limitAppearance: 'plain',
                placeholder: '0',
                errors: packed.map((count, index) =>
                  count !== null && count > inStore[index]!
                    ? `Only ${inStore[index]} in the store.`
                    : null,
                ),
                onChange: (key, value) =>
                  setPacked((counts) =>
                    counts.map((count, index) =>
                      sackColumns[index]!.key === key ? value : count,
                    ),
                  ),
              },
            },
            {
              id: 'store',
              label: 'In the store',
              emphasis: 'quiet',
              cells: [...inStore],
              total: kilos(inStore),
              valueRow: { label: 'Weight', cells: weights(inStore) },
            },
            {
              id: 'returned',
              label: 'Returned',
              caption: 'no round back yet',
              disabled: true,
              cells: [...returned],
              total: kilos(returned),
              valueRow: { label: 'Weight', cells: weights(returned) },
            },
          ]}
        />
        <Text color="muted" variant="caption">
          A row&apos;s valueRow adds a line under it on the subtle fill: its
          name in the label column, each column&apos;s value centred under its
          count (the consumer formats it; blank for none) and the row&apos;s
          total moved onto it. Each typed count is described by the value under
          it, then by its message; a disabled row fades its line too.
        </Text>
      </Stack>
    </Card>
  );
}
