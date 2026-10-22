import {
  GlyphTile,
  type GlyphTileHue,
  Inline,
  ListGroup,
  ListRow,
  Stack,
  Text,
} from '@scalewing/react';

import { Glyph } from '../glyph.js';

const feather = 'M12 2 4 10v2h2l8-8M8 6h4M6 8h4M2 14l4-4';

const arrivals: readonly {
  id: string;
  title: string;
  detail: string;
  hue: GlyphTileHue;
}[] = [
  {
    id: 'heron-alert',
    title: 'Heron colony disturbance near the north marsh boardwalk',
    detail: 'Alert · Wetlands › Herons',
    hue: 'orange',
  },
  {
    id: 'owl-boxes',
    title: 'Owl boxes',
    detail: 'Guide · Woodlands › Owls',
    hue: 'teal',
  },
  {
    id: 'tern-count',
    title: 'Counting terns from the dunes',
    detail: 'Course · Coast › Terns',
    hue: 'green',
  },
];

/**
 * ListGroup `variant="tiles"`: New arrivals as one list of three tiles
 * under its heading and count, three across from `md` up and one a row
 * on a phone, each tile a link row cut to one line.
 */
export function ListGroupTilesExample({
  onOpen,
}: {
  onOpen: (what: string) => void;
}) {
  return (
    <Stack as="section" aria-labelledby="list-group-arrivals" gap={3}>
      <Inline align="center" gap={2}>
        <Text as="h3" id="list-group-arrivals" variant="title">
          New arrivals
        </Text>
        <Text as="span" color="muted" variant="caption">
          {String(arrivals.length)}
        </Text>
      </Inline>
      <ListGroup aria-labelledby="list-group-arrivals" variant="tiles">
        {arrivals.map((arrival) => (
          <ListRow
            accessory="none"
            detail={arrival.detail}
            href={`#list-group-${arrival.id}`}
            key={arrival.id}
            leading={
              <GlyphTile hue={arrival.hue} size="lg">
                <Glyph path={feather} />
              </GlyphTile>
            }
            onPress={() => onOpen(arrival.title)}
            title={arrival.title}
            truncate
          />
        ))}
      </ListGroup>
      <Text color="muted" variant="caption">
        variant tiles keeps one list of rows and sets each row on a panel of its
        own, three across (tileColumns 2, 3 or 4) and one a row on a phone.
      </Text>
    </Stack>
  );
}
