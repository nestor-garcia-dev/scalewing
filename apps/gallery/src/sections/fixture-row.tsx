import {
  Button,
  FixtureGroup,
  FixtureRow,
  GlyphTile,
  type GlyphTileHue,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { CountResultCard } from './fixture-group-title-hidden.js';
import { Section } from '../layout/Section.js';

const station = 'M2 8l6-5 6 5 M4 7v7h8V7';

function side(name: string, hue: GlyphTileHue) {
  return {
    name,
    mark: (
      <GlyphTile hue={hue} size="sm">
        <Glyph path={station} />
      </GlyphTile>
    ),
  };
}

const heron = side('Heron Marsh', 'teal');
const otter = side('Otter Pool', 'blue');
const pine = side('Pine Ridge', 'green');
const fen = side('Bittern Fen', 'purple');
const dunes = side('Bayside Dunes with a long station name', 'orange');

export function FixtureRowSection() {
  const [opened, setOpened] = useState('None yet');
  const [moving, setMoving] = useState('None yet');
  const [chosen, setChosen] = useState<readonly string[]>([
    'Heron Marsh vs Otter Pool',
  ]);
  const choose = (game: string) => ({
    checked: chosen.includes(game),
    label: `Select ${game}`,
    onCheckedChange: (checked: boolean) =>
      setChosen((last) =>
        checked ? [...last, game] : last.filter((one) => one !== game),
      ),
  });

  return (
    <Section
      id="fixture-row"
      purpose="FixtureRow is one pairing between two sides, such as two stations' teams counting together: the home side's name ending at the centre with its mark beside it, the centre (a kickoff time in a grey chip, or a score in bold figures, both tabular), the away side starting from it, then meta and a status Badge at the end. A FixtureGroup heads a run of them (a day, a place) and names their list; the rows share one grid, so every centre lines up down the run. Below md the meta and status move under the sides; metaHideBelow leaves the meta out below md or lg. With href or onPress the whole row is a link or a button with a chevron (aria-label names it in your words); a plain press on a link with onPress is handed to a client router. flag marks an issue at the row's start (amber by default; red with tone danger, as on Hide flooded): a round mark whose label is its tooltip and is read before the row's name. action is a control after the row, such as a small neutral Move button, outside the row's press area and its own Tab stop; it stays on the row's first line at every width. select is a leading checkbox before the row, such as games chosen to postpone: named by its label (not drawn), outside the row's press area, the standard box with a 44 px target on a coarse pointer, and it works with flag, action, href and onPress. The run's columns are shared, so on a phone a select, marks, a chevron and an action together leave the names little room: these rows leave their marks out. A flagged row with nothing for the details' line below md keeps its flag on the first line. Names wrap; right-to-left mirrors the sides. titleHidden keeps a group's title as its list's name without drawing it, for one row in a card whose heading already names the pairing and the day."
      title="FixtureRow"
      usage={`// Crest, openMove, chosen, id and toggle are your own.
<FixtureGroup title="Sunday 25 October · North meadow hides">
  <FixtureRow
    home={{ name: 'Heron Marsh', mark: <Crest /> }}
    away={{ name: 'Otter Pool', mark: <Crest /> }}
    center="8:00"
    meta="Hide 1"
    href="/counts/1"
    aria-label="Heron Marsh with Otter Pool, 8:00, Hide 1"
  />
  <FixtureRow
    home={{ name: 'Heron Marsh' }}
    away={{ name: 'Pine Ridge' }}
    center="8:00"
    flag={{ label: 'Tide clash' }}
    action={
      <Button aria-label="Move Heron Marsh vs Pine Ridge" onPress={openMove} size="sm" variant="neutral">
        Move
      </Button>
    }
  />
  <FixtureRow
    home={{ name: 'Otter Pool' }}
    away={{ name: 'Bittern Fen' }}
    center="9:15"
    select={{
      label: 'Select Otter Pool vs Bittern Fen',
      checked: chosen.includes(id),
      onCheckedChange: (checked) => toggle(id, checked),
    }}
  />
</FixtureGroup>`}
    >
      <Stack gap={4}>
        <FixtureGroup title="Sunday 25 October · North meadow hides">
          <FixtureRow
            aria-label="Heron Marsh with Otter Pool, 8:00, Hide 1"
            away={otter}
            center="8:00"
            home={heron}
            href="#fixture-row"
            meta="Hide 1"
            onPress={() => setOpened('Heron Marsh with Otter Pool')}
          />
          <FixtureRow
            away={fen}
            center="9:15"
            home={pine}
            meta="Hide 2"
            metaHideBelow="md"
            onPress={() => setOpened('Pine Ridge with Bittern Fen')}
          />
          <FixtureRow
            away={heron}
            center="10:30"
            home={dunes}
            meta="Hide 1"
            status={{ label: 'To confirm', tone: 'warning' }}
          />
        </FixtureGroup>
        <FixtureGroup title="Saturday 24 October · Reed bed">
          <FixtureRow
            away={pine}
            center="14–9"
            centerKind="score"
            home={otter}
            meta="Hide 3"
            status={{ label: 'Counted', tone: 'success' }}
          />
          <FixtureRow away={dunes} center="6–6" centerKind="score" home={fen} />
        </FixtureGroup>
        <FixtureGroup title="Monday 26 October · Reed bed">
          <FixtureRow
            action={
              <Button
                aria-label="Move Heron Marsh vs Pine Ridge"
                onPress={() => setMoving('Heron Marsh vs Pine Ridge')}
                size="sm"
                variant="neutral"
              >
                Move
              </Button>
            }
            away={pine}
            center="8:00"
            flag={{ label: 'Tide clash' }}
            home={heron}
            meta="Hide 1"
          />
          <FixtureRow
            action={
              <Button
                aria-label="Move Otter Pool vs Bittern Fen"
                onPress={() => setMoving('Otter Pool vs Bittern Fen')}
                size="sm"
                variant="neutral"
              >
                Move
              </Button>
            }
            aria-label="Otter Pool vs Bittern Fen, 9:15, Hide 2"
            away={fen}
            center="9:15"
            home={otter}
            meta="Hide 2"
            onPress={() => setOpened('Otter Pool with Bittern Fen')}
          />
          <FixtureRow
            away={dunes}
            center="10:30"
            flag={{ label: 'Hide flooded', tone: 'danger' }}
            home={pine}
            meta="Hide 3"
          />
        </FixtureGroup>
        <FixtureGroup title="Tuesday 27 October · Reed bed">
          <FixtureRow
            aria-label="Heron Marsh vs Otter Pool, 8:00"
            away={{ name: 'Otter Pool' }}
            center="8:00"
            home={{ name: 'Heron Marsh' }}
            meta="Hide 1"
            onPress={() => setOpened('Heron Marsh with Otter Pool')}
            select={choose('Heron Marsh vs Otter Pool')}
          />
          <FixtureRow
            action={
              <Button
                aria-label="Move Elm Row vs Pine Ridge"
                onPress={() => setMoving('Elm Row vs Pine Ridge')}
                size="sm"
                variant="neutral"
              >
                Move
              </Button>
            }
            away={{ name: 'Pine Ridge' }}
            center="9:15"
            flag={{ label: 'Tide clash' }}
            home={{ name: 'Elm Row' }}
            select={choose('Elm Row vs Pine Ridge')}
          />
          <FixtureRow
            away={{ name: 'Otter Pool' }}
            center="10:30"
            home={{ name: 'Bayside Dunes' }}
            meta="Hide 2"
            select={{
              ...choose('Bayside Dunes vs Otter Pool'),
              disabled: true,
            }}
            status={{ label: 'Counted', tone: 'success' }}
          />
        </FixtureGroup>
        <CountResultCard />
        <Text color="muted" role="status" variant="caption">
          Chosen: {chosen.length === 0 ? 'None' : chosen.join(', ')}
        </Text>
        <Text color="muted" role="status" variant="caption">
          Last opened: {opened}
        </Text>
        <Text color="muted" role="status" variant="caption">
          Last moved: {moving}
        </Text>
      </Stack>
    </Section>
  );
}
