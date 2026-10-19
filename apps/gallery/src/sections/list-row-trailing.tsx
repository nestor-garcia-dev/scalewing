import {
  ActionMenu,
  Badge,
  Card,
  GlyphTile,
  ListGroup,
  ListRow,
  Stack,
  Text,
} from '@scalewing/react';

import { Glyph } from '../glyph.js';

const feather = 'M12 2 4 10v2h2l8-8M8 6h4M6 8h4M2 14l4-4';
const book = 'M3 3h4a2 2 0 0 1 2 2v9a2 2 0 0 0-2-2H3zM13 3H9v11';
const dots = 'M3 8h.01M8 8h.01M13 8h.01';

const guides = [
  {
    id: 'heron',
    title: 'Heron calls',
    detail: 'Guide · 2 pages · Oct 16',
    unread: true,
    only: undefined,
    glyph: feather,
  },
  {
    id: 'owl',
    title: 'Owl pellets',
    detail: 'Guide · 1 page · Oct 16',
    unread: true,
    only: 'Only in English',
    glyph: feather,
  },
  {
    id: 'frog',
    title: 'Coro de ranas',
    detail: 'Course · 16 pages · Sep 24',
    unread: false,
    only: 'Only in Spanish',
    glyph: book,
  },
] as const;

/**
 * ListRow's unread dot, tag and action: field guides, the new ones marked,
 * a language tag, and each row's own menu beside it.
 */
export function ListRowTrailingExample({
  onOpen,
}: {
  onOpen: (what: string) => void;
}) {
  return (
    <Card padding={4}>
      <Stack gap={2}>
        <Text as="h3" id="list-group-guides" variant="label">
          Field guides
        </Text>
        <ListGroup aria-labelledby="list-group-guides" variant="plain">
          {guides.map((guide) => (
            <ListRow
              accessory="none"
              action={
                <ActionMenu
                  align="end"
                  items={[
                    {
                      id: 'open',
                      label: 'Open',
                      onSelect: () => onOpen(guide.title),
                    },
                    {
                      id: 'archive',
                      label: 'Archive…',
                      destructive: true,
                      onSelect: () => onOpen(`Archive ${guide.title}`),
                    },
                  ]}
                  label={`More for ${guide.title}`}
                  trigger={<Glyph path={dots} />}
                />
              }
              detail={guide.detail}
              href={`#list-group-${guide.id}`}
              key={guide.id}
              leading={
                <GlyphTile hue={guide.glyph === book ? 'green' : 'orange'}>
                  <Glyph path={guide.glyph} />
                </GlyphTile>
              }
              onPress={() => onOpen(guide.title)}
              tag={guide.only ? <Badge>{guide.only}</Badge> : undefined}
              title={guide.title}
              unread={guide.unread}
              unreadLabel="New"
            />
          ))}
        </ListGroup>
      </Stack>
    </Card>
  );
}
