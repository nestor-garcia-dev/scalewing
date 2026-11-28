import { ListGroup, ListRow, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

/** Fourteen boardwalk birds, past what the panel shows at once. */
const birds = [
  'Grey heron',
  'Barn owl',
  'Common tern',
  'Little egret',
  'Eurasian bittern',
  'Marsh harrier',
  'Kingfisher',
  'Reed warbler',
  'Great crested grebe of the north marsh',
  'Spoonbill',
  'Avocet',
  'Bearded reedling',
  'Water rail',
  'Black-tailed godwit',
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
        {birds.map((name) => (
          <ListRow
            accessory="none"
            key={name}
            onPress={() => setBird(name)}
            title={name}
            truncate
          />
        ))}
      </ListGroup>
      <Text color="muted" variant="caption">
        With size lg every row is at least 56 px; with maxHeight the tiles
        scroll inside their own named region, three rows at a time (counted as
        rows with a detail line, so title-only tiles show a little of the next
        row). Chosen: {bird}.
      </Text>
    </Stack>
  );
}
