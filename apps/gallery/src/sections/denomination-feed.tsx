import { Card, DenominationGrid, Stack, Text } from '@scalewing/react';

const tagColumns = [
  { key: 'xs', label: 'XS' },
  { key: 's', label: 'S' },
  { key: 'm', label: 'M' },
  { key: 'l', label: 'L' },
  { key: 'xl', label: 'XL' },
  { key: 'xxl', label: 'XXL' },
] as const;

const feed = [
  {
    id: 'morning',
    title: 'Morning round · 6:10',
    rows: [
      {
        id: 'in',
        label: 'Tagged',
        tone: 'success',
        cells: [12, 4, 0, 9, 2, 1],
      },
    ],
  },
  {
    id: 'noon',
    title: 'Release at the river mouth · 12:40',
    rows: [
      {
        id: 'out',
        label: 'Released back',
        tone: 'danger',
        cells: [3, 0, 120, 0, 0, 1],
      },
    ],
  },
  {
    id: 'evening',
    title: 'Kit check · 18:05',
    rows: [
      { id: 'in', label: 'Found', tone: 'success', cells: [0, 2, 0, 0, 0, 0] },
      { id: 'out', label: 'Lost', tone: 'danger', cells: [1, 0, 0, 0, 0, 0] },
    ],
  },
] as const;

/**
 * A feed of cards, one strip each with its own labels and counts, lined up
 * with labelWidth so every size's column sits under the one above.
 */
export function DenominationFeed() {
  return (
    <Stack gap={2}>
      <Text color="muted" variant="label">
        Tag activity today
      </Text>
      <Stack gap={2} role="list" aria-label="Tag activity today">
        {feed.map((card) => (
          <Card key={card.id} padding={3} variant="outlined" role="listitem">
            <Stack gap={2}>
              <Text variant="label">{card.title}</Text>
              <DenominationGrid
                columns={tagColumns}
                label={card.title}
                labelWidth="md"
                rows={card.rows.map((row) => ({
                  ...row,
                  cells: [...row.cells],
                }))}
              />
            </Stack>
          </Card>
        ))}
      </Stack>
      <Text color="muted" variant="caption">
        labelWidth md: the row labels take 8 rem and the six sizes share the
        rest of each card, so every XS sits under the XS above whatever the
        labels and counts are.
      </Text>
    </Stack>
  );
}
