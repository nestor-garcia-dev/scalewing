import { Card, DenominationGrid, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

const birdColumns = [
  { key: 'heron', label: 'Herons' },
  { key: 'egret', label: 'Egrets' },
  { key: 'ibis', label: 'Ibises' },
  { key: 'stork', label: 'Storks' },
] as const;

const expected = [14, 6, 0, 3] as const;

type Counts = (number | null)[];

function birds(counts: readonly (number | null)[]): string {
  const sum = counts.reduce<number>((total, count) => total + (count ?? 0), 0);
  return `${sum} birds`;
}

function signedBirds(sum: number): string {
  if (sum === 0) return '0 birds';
  return `${sum > 0 ? '+' : '−'}${Math.abs(sum)} birds`;
}

/**
 * The framed table look: a count against the last survey with blank
 * zeros, strong totals, the difference on a danger pill and a changed
 * count on an accent pill, and − kept plain at zero.
 */
export function DenominationFramedExample() {
  const [counted, setCounted] = useState<Counts>([14, 6, null, 2]);
  const difference = counted.map(
    (count, index) => (count ?? 0) - expected[index]!,
  );
  const off = difference.reduce((sum, count) => sum + count, 0);
  return (
    <Card padding={4}>
      <Stack gap={2}>
        <Text color="muted" variant="label">
          Wading birds at the weir
        </Text>
        <DenominationGrid
          cellToneAppearance="pill"
          columns={birdColumns}
          frame="table"
          label="Wading birds at the weir"
          labelAppearance="plain"
          totalEmphasis="strong"
          totalLabel="Total"
          zeroLabel=""
          rows={[
            {
              id: 'counted',
              label: 'Counted',
              caption: 'this morning',
              cells: counted,
              total: birds(counted),
              entry: {
                decrementLabel: 'One bird fewer',
                incrementLabel: 'One bird more',
                limitAppearance: 'plain',
                placeholder: '0',
                onChange: (key, value) =>
                  setCounted((counts) =>
                    counts.map((count, index) =>
                      birdColumns[index]!.key === key ? value : count,
                    ),
                  ),
              },
            },
            {
              id: 'expected',
              label: 'Expected',
              caption: 'last survey',
              emphasis: 'quiet',
              cells: [...expected],
              total: birds(expected),
            },
            {
              id: 'difference',
              label: 'Difference',
              tone: off === 0 ? 'neutral' : 'danger',
              signed: true,
              cells: difference,
              cellTones: difference.map((count) =>
                count === 0 ? null : 'danger',
              ),
              total: signedBirds(off),
            },
            {
              id: 'after',
              label: 'After',
              cells: [14, 6, 0, 3],
              cellTones: [null, null, null, 'accent'],
              total: birds([14, 6, 0, 3]),
            },
          ]}
        />
        <Text color="muted" variant="caption">
          frame table draws the strip as a framed table: a hairline with rounded
          corners, the heading row on the subtle fill and a rule between
          columns. zeroLabel empty leaves zeros blank, totalEmphasis strong sets
          the totals in bold (a neutral row in the text color),
          cellToneAppearance pill draws a toned count on a tint of its tone (the
          storks one short, the changed count in accent), and the entry&apos;s
          limitAppearance plain keeps − unfaded at zero.
        </Text>
      </Stack>
    </Card>
  );
}
