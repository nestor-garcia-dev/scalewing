import { Card, DenominationGrid, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

const packColumns = [
  { key: 's', label: 'S', caption: '× 10' },
  { key: 'm', label: 'M', caption: '× 10' },
  { key: 'l', label: 'L', caption: '× 5' },
  { key: 'xl', label: 'XL', caption: '× 5' },
] as const;

const tagsPerPack = [10, 10, 5, 5] as const;
const packsInStock = [6, 4, 3, 0] as const;
const suggested = [2, 1, 1, 0] as const;

type Counts = (number | null)[];

function tagTotal(counts: Counts): string {
  const tags = counts.reduce<number>(
    (sum, count, index) => sum + (count ?? 0) * tagsPerPack[index]!,
    0,
  );
  return `${tags} tags`;
}

/**
 * Count entry in a strip: packs fitted this morning (a Stepper per size,
 * capped by the store room, a suggestion toned until it is changed), the
 * store room's stock as a quiet row to compare against, and a row that does
 * not apply today.
 */
export function DenominationEntryExample() {
  const [fitted, setFitted] = useState<Counts>([...suggested]);
  const errors = fitted.map((count, index) =>
    count !== null && count > packsInStock[index]!
      ? `Only ${packsInStock[index]} in stock.`
      : null,
  );
  return (
    <Card padding={4}>
      <Stack gap={2}>
        <Text color="muted" variant="label">
          Tag packs for the morning round
        </Text>
        <DenominationGrid
          columns={packColumns}
          label="Tag packs for the morning round"
          totalLabel="Total"
          rows={[
            {
              id: 'fitted',
              label: 'Fitted',
              caption: 'this morning',
              cells: fitted,
              cellTones: fitted.map((count, index) =>
                count === suggested[index] && count !== 0 ? 'accent' : null,
              ),
              total: tagTotal(fitted),
              entry: {
                decrementLabel: 'One pack less',
                incrementLabel: 'One pack more',
                placeholder: '0',
                errors,
                onChange: (key, value) =>
                  setFitted((counts) =>
                    counts.map((count, index) =>
                      packColumns[index]!.key === key ? value : count,
                    ),
                  ),
              },
            },
            {
              id: 'stock',
              label: 'In stock',
              caption: 'store room',
              emphasis: 'quiet',
              cells: [...packsInStock],
              total: tagTotal([...packsInStock]),
            },
            {
              id: 'returned',
              label: 'Returned',
              caption: 'no round back yet',
              disabled: true,
              cells: [null, null, null, null],
              entry: {
                decrementLabel: 'One pack less',
                incrementLabel: 'One pack more',
                placeholder: '0',
                onChange: () => undefined,
              },
            },
          ]}
        />
        <Text color="muted" variant="caption">
          An entry row edits its cells with a Stepper per column, named by the
          row and the column as its header reads (&quot;Fitted M × 10&quot;);
          max caps each count and errors says why a count is wrong under it. The
          suggested counts are toned accent until changed. A quiet row sits on
          the subtle fill to compare against; a disabled row fades and disables
          its entry. Captions add a muted line under a row label and a note
          after a column label, in either layout.
        </Text>
        <DenominationGrid
          columns={packColumns}
          label="Packs by crew"
          layout="tiles"
          rows={[
            {
              id: 'north',
              label: 'North crew',
              caption: 'ridge',
              cells: [2, 1, 0, 1],
            },
            {
              id: 'south',
              label: 'South crew',
              caption: 'estuary',
              cells: [1, 0, 2, 0],
            },
          ]}
        />
      </Stack>
    </Card>
  );
}
