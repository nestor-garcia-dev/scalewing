import {
  ActionMenu,
  AppShell,
  type AppShellNavGroup,
  type NavCountTone,
  Badge,
  Button,
  Card,
  Grid,
  Inline,
  Stack,
  StatTile,
  Text,
  ThemeProvider,
} from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { readPalettePreference } from '../palette-preference.js';
import { readThemePreference } from '../theme-preference.js';

/** The query that renders this frame alone, for the AppShell section's frames. */
export const appShellFrameQuery = 'frame=app-shell';

const glyphs = {
  today: 'M2 4h12v10H2z M2 7h12 M5 2v3 M11 2v3',
  wetlands: 'M2 10c2-2 4 2 6 0s4 2 6 0 M2 13c2-2 4 2 6 0s4 2 6 0 M8 2v5',
  forests: 'M8 2l4 6H4z M8 6l5 7H3z M8 13v2',
  dunes: 'M1 13c3-6 6-6 9 0 M7 13c2-4 5-4 8 0',
  rangers:
    'M8 7a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5z M3 14c0-3 2.2-5 5-5s5 2 5 5',
  reports: 'M3 13V9 M7 13V5 M11 13V7',
  menu: 'M2 4h12 M2 8h12 M2 12h12',
  station: 'M2 8l6-5 6 5 M4 7v7h8V7',
} as const;

function destinations(current: string): AppShellNavGroup[] {
  const item = (
    id: keyof typeof glyphs,
    label: string,
    extra: {
      count?: number;
      countLabel?: string;
      countTone?: NavCountTone;
    } = {},
  ) => ({
    id,
    label,
    href: `#${id}`,
    icon: <Glyph path={glyphs[id]} size={18} />,
    current: id === current ? ('page' as const) : false,
    ...extra,
  });
  return [
    { id: 'field', items: [item('today', 'Today')] },
    {
      id: 'reserves',
      label: 'Reserves',
      items: [
        item('wetlands', 'Wetlands', {
          count: 3,
          countLabel: '3 sightings to check',
        }),
        item('forests', 'Forests'),
        item('dunes', 'Coastal dunes', { count: 12 }),
      ],
    },
    {
      id: 'team',
      label: 'Team',
      items: [
        item('rangers', 'Rangers', {
          count: 2,
          countLabel: '2 rotas to confirm',
          countTone: 'warning',
        }),
        item('reports', 'Reports'),
      ],
    },
  ];
}

const sightings = [
  'Grey heron',
  'Eurasian otter',
  'Marsh harrier',
  'Water vole',
  'Bittern',
  'Kingfisher',
  'Reed warbler',
  'Great crested grebe',
];

const stationMenu = [
  { id: 'heron', label: 'Heron Marsh station', onSelect: () => undefined },
  { id: 'pine', label: 'Pine Ridge station', onSelect: () => undefined },
];

/**
 * A field station's workspace in AppShell, rendered alone (`?frame=app-shell`)
 * so the gallery can show it in frames of three widths: the full sidebar,
 * the rail and the bar with its drawer.
 */
export function AppShellFrame() {
  const [current, setCurrent] = useState('wetlands');
  const groups = destinations(current);
  const title =
    groups.flatMap((group) => group.items).find((item) => item.id === current)
      ?.label ?? '';

  return (
    <ThemeProvider
      colorScheme={readThemePreference()}
      palette={readPalettePreference()}
    >
      <AppShell
        barTitle={<Text variant="label">Heron Marsh</Text>}
        footer={<Text variant="caption">Ranger Amaru Quispe</Text>}
        groups={groups}
        header={
          <ActionMenu
            items={stationMenu}
            label="Heron Marsh station"
            triggerAppearance="text"
          />
        }
        labels={{ openMenu: 'Open menu', closeMenu: 'Close menu' }}
        menuCount={5}
        menuCountLabel="5 need you"
        menuCountTone="warning"
        menuIcon={<Glyph path={glyphs.menu} size={18} />}
        navLabel="Field station"
        onNavigate={(item) => setCurrent(item.id)}
        pageBar={
          <>
            <Inline gap={2}>
              <Text variant="label">Spring census</Text>
              <Badge tone="success">Live</Badge>
            </Inline>
            <Button onPress={() => undefined} size="sm" variant="neutral">
              Export sightings
            </Button>
          </>
        }
        railHeader={
          <ActionMenu
            items={stationMenu}
            label="Stations"
            trigger={<Glyph path={glyphs.station} size={18} />}
            triggerAppearance="icon"
          />
        }
      >
        <Stack gap={4} padding={5}>
          <Text as="h1" variant="display">
            {title}
          </Text>
          <Grid columns={3} columnsBelow={{ md: 1 }} gap={4}>
            <StatTile label="Sightings today" value="48" />
            <StatTile label="Species" value="17" />
            <StatTile label="Rangers out" value="4" />
          </Grid>
          {sightings.map((species) => (
            <Card key={species} padding={4}>
              <Stack gap={1}>
                <Text variant="title">{species}</Text>
                <Text color="muted">
                  Seen along the north reed bed at first light; the page scrolls
                  with the window while the sidebar stays pinned.
                </Text>
              </Stack>
            </Card>
          ))}
        </Stack>
      </AppShell>
    </ThemeProvider>
  );
}
