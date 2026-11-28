import { ListGroup, ListRow, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

/**
 * Fourteen boardwalk birds, past what the panel shows at once. One has a
 * detail line, so its tile is taller than the two beside it on a row.
 */
const birds: readonly { name: string; detail?: string }[] = [
  { name: 'Grey heron' },
  { name: 'Barn owl', detail: 'Seen at dusk' },
  { name: 'Common tern' },
  { name: 'Little egret' },
  { name: 'Eurasian bittern' },
  { name: 'Marsh harrier' },
  { name: 'Kingfisher' },
  { name: 'Reed warbler' },
  { name: 'Great crested grebe of the north marsh' },
  { name: 'Spoonbill' },
  { name: 'Avocet' },
  { name: 'Bearded reedling' },
  { name: 'Water rail' },
  { name: 'Black-tailed godwit' },
];

/**
 * ListGroup `size="lg"` tiles with `maxHeight`: the boardwalk's birds as
 * 56 px tiles, three across from `md` up and one a row on a phone, the
 * grid scrolling inside one named region after three rows.
 */
export function ListGroupTilesBoundedExample() {
  const [bird, setBird] = useState('none yet');
  return (
    <Stack as="section" aria-labelledby="list-group-birds" gap={3}>
      <Text as="h3" id="list-group-birds" variant="title">
        Which bird did you see?
      </Text>
      <ListGroup
        aria-labelledby="list-group-birds"
        maxHeight={{ rows: 3 }}
        size="lg"
        variant="tiles"
      >
        {birds.map(({ name, detail }) => (
          <ListRow
            accessory="none"
            detail={detail}
            key={name}
            onPress={() => setBird(name)}
            title={name}
            truncate
          />
        ))}
      </ListGroup>
      <Text color="muted" variant="caption">
        With size lg every row is at least 56 px; with maxHeight the tiles
        scroll inside their own named region. Chosen: {bird}.
      </Text>
    </Stack>
  );
}
