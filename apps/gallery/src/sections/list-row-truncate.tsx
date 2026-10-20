import {
  ActionMenu,
  Badge,
  Card,
  Grid,
  GlyphTile,
  ListGroup,
  ListRow,
  Stack,
  Text,
} from '@scalewing/react';

import { Glyph } from '../glyph.js';

const feather = 'M12 2 4 10v2h2l8-8M8 6h4M6 8h4M2 14l4-4';
const dots = 'M3 8h.01M8 8h.01M13 8h.01';

const wetlands = [
  {
    id: 'heron-dawn',
    title:
      'Heron calls heard along the north marsh before dawn, and how to tell them from the egrets',
    detail:
      'Guide · Wetlands › Herons and egrets › Calls at dawn and dusk · 12 pages · Oct 16',
    unread: true,
    only: undefined,
  },
  {
    id: 'reed-warbler',
    title: 'Reed nests',
    detail: 'Guide · 2 pages',
    unread: false,
    only: 'Only in English',
  },
] as const;

function Mark() {
  return (
    <GlyphTile hue="teal">
      <Glyph path={feather} />
    </GlyphTile>
  );
}

/**
 * ListRow `truncate`: two shelves side by side whose long titles and
 * detail lines end in "…" on one line each. Wetlands holds link rows
 * beside the dot, the tags and each row's menu; Woodlands a button row
 * and a statement row whose value and its line stay whole.
 */
export function ListRowTruncateExample({
  onOpen,
}: {
  onOpen: (what: string) => void;
}) {
  return (
    <Grid columns={2} columnsBelow={{ md: 1 }} gap={4}>
      <Card padding={4}>
        <Stack gap={2}>
          <Text as="h3" id="list-group-shelf-wetlands" variant="label">
            Wetlands
          </Text>
          <ListGroup
            aria-labelledby="list-group-shelf-wetlands"
            variant="plain"
          >
            {wetlands.map((guide) => (
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
                    ]}
                    label={`More for ${guide.title}`}
                    trigger={<Glyph path={dots} />}
                  />
                }
                detail={guide.detail}
                href={`#list-group-${guide.id}`}
                key={guide.id}
                leading={<Mark />}
                onPress={() => onOpen(guide.title)}
                tag={guide.only ? <Badge>{guide.only}</Badge> : undefined}
                title={guide.title}
                truncate
                unread={guide.unread}
                unreadLabel="New"
              />
            ))}
          </ListGroup>
        </Stack>
      </Card>
      <Card padding={4}>
        <Stack gap={2}>
          <Text as="h3" id="list-group-shelf-woodlands" variant="label">
            Woodlands
          </Text>
          <ListGroup
            aria-labelledby="list-group-shelf-woodlands"
            variant="plain"
          >
            <ListRow
              detail="Course · Woodlands › Owls › Pellets and prey · 16 pages"
              leading={<Mark />}
              onPress={() => onOpen('Owl pellets')}
              title="Reading owl pellets: bones, fur and what the owl ate last week"
              truncate
            />
            <ListRow
              detail="Survey · Woodlands › Beetles › Bark and sapwood tunnels"
              leading={<Mark />}
              title="Bark beetle galleries counted on the fallen oaks by the stream"
              truncate
              value="214 trees"
              valueDetail="since Sep 1"
            />
          </ListGroup>
        </Stack>
      </Card>
    </Grid>
  );
}
