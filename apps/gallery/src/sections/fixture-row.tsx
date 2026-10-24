import {
  FixtureGroup,
  FixtureRow,
  GlyphTile,
  type GlyphTileHue,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
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

  return (
    <Section
      id="fixture-row"
      purpose="FixtureRow is one pairing between two sides, such as two stations' teams counting together: the home side's name ending at the centre with its mark beside it, the centre (a kickoff time in a grey chip, or a score in bold figures, both tabular), the away side starting from it, then meta and a status Badge at the end. A FixtureGroup heads a run of them (a day, a place) and names their list; the rows share one grid, so every centre lines up down the run. Below md the meta and status move under the sides; metaHideBelow leaves the meta out below md or lg. With href or onPress the whole row is a link or a button with a chevron (aria-label names it in your words); a plain press on a link with onPress is handed to a client router. Names wrap; right-to-left mirrors the sides."
      title="FixtureRow"
      usage={`<FixtureGroup title="Sunday 25 October · North meadow hides">
  <FixtureRow
    home={{ name: 'Heron Marsh', mark: <Crest /> }}
    away={{ name: 'Otter Pool', mark: <Crest /> }}
    center="8:00"
    meta="Hide 1"
    href="/counts/1"
    aria-label="Heron Marsh with Otter Pool, 8:00, Hide 1"
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
        <Text color="muted" role="status" variant="caption">
          Last opened: {opened}
        </Text>
      </Stack>
    </Section>
  );
}
