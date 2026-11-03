import {
  ActionMenu,
  Button,
  Card,
  FixtureCard,
  type FixtureScoreSide,
  Grid,
  Separator,
  Stack,
  Text,
  ThemeProvider,
  useTheme,
} from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';
import { useGalleryPalette } from '../palette-context.js';

const dots = 'M3 8h.01M8 8h.01M13 8h.01';

type Tally = { home: string; away: string };

type Pairing = {
  id: string;
  home: string;
  away: string;
  day: string;
  homeNote?: string;
  awayNote?: string;
  counted?: Tally;
};

const blank: Tally = { home: '', away: '' };

const waiting: readonly Pairing[] = [
  {
    id: 'w1',
    home: 'Heron Marsh',
    away: 'Otter Pool',
    day: 'Sun, Oct 18',
    homeNote: 'North hide',
  },
  {
    id: 'w2',
    home: 'The Great Northern Bittern Fen and Reed Bed Reserve',
    away: 'Elm Row',
    day: 'Sun, Oct 18',
    awayNote: 'Second count of the season at this station',
  },
];

const counted: readonly Pairing[] = [
  {
    id: 'c1',
    home: 'Pine Ridge',
    away: 'Bayside Dunes',
    day: 'Sat, Oct 17',
    counted: { home: '4', away: '2' },
  },
];

/** A set of cards' typed counts and messages, one per pairing. */
function useCards(pairings: readonly Pairing[]) {
  const start = (one: Pairing) => one.counted ?? blank;
  const [tallies, setTallies] = useState<Record<string, Tally>>(() =>
    Object.fromEntries(pairings.map((one) => [one.id, start(one)])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, string>>({});

  const change = (one: Pairing, side: FixtureScoreSide, value: string) => {
    setTallies((last) => ({
      ...last,
      [one.id]: { ...last[one.id]!, [side]: value },
    }));
    setErrors((last) => ({ ...last, [one.id]: '' }));
    setSaved((last) => ({ ...last, [one.id]: '' }));
  };
  const cancel = (one: Pairing) => {
    setTallies((last) => ({ ...last, [one.id]: start(one) }));
    setErrors((last) => ({ ...last, [one.id]: '' }));
    setSaved((last) => ({ ...last, [one.id]: '' }));
  };
  const submit = (one: Pairing) => {
    const tally = tallies[one.id]!;
    const missing = !tally.home || !tally.away;
    setErrors((last) => ({
      ...last,
      [one.id]: missing ? 'Type both counts.' : '',
    }));
    setSaved((last) => ({
      ...last,
      [one.id]: missing ? '' : `Recorded ${tally.home}–${tally.away}.`,
    }));
  };
  return { cancel, change, errors, saved, submit, tallies };
}

function PairingCard({
  cards,
  one,
  prefix,
}: {
  cards: ReturnType<typeof useCards>;
  one: Pairing;
  prefix: string;
}) {
  const tally = cards.tallies[one.id]!;
  const error = cards.errors[one.id] ?? '';
  const saved = cards.saved[one.id] ?? '';
  const pairing = `${one.home} v ${one.away}`;
  return (
    <FixtureCard
      actions={
        <>
          <Button
            aria-label={`Record ${pairing}${prefix}`}
            onPress={() => cards.submit(one)}
            size="sm"
            variant="neutral"
          >
            Record
          </Button>
          <Button
            aria-label={`Move ${pairing}${prefix}`}
            onPress={() => undefined}
            size="sm"
            variant="neutral"
          >
            Move
          </Button>
        </>
      }
      away={{ name: one.away, note: one.awayNote }}
      detail={
        saved ? (
          <Text color="success" role="status" variant="caption">
            {saved}
          </Text>
        ) : undefined
      }
      home={{ name: one.home, note: one.homeNote }}
      menu={
        <ActionMenu
          align="end"
          items={[
            { id: 'note', label: 'Add a note', onSelect: () => undefined },
          ]}
          label={`More for ${pairing}${prefix}`}
          trigger={<Glyph path={dots} />}
          triggerAppearance="icon"
        />
      }
      meta={
        one.counted ? (
          <Text color="success" variant="caption">
            {one.day} · Counted
          </Text>
        ) : (
          one.day
        )
      }
      score={{
        away: {
          invalid: error ? !tally.away : undefined,
          label: `${one.away} count${prefix}`,
          value: tally.away,
        },
        error,
        home: {
          invalid: error ? !tally.home : undefined,
          label: `${one.home} count${prefix}`,
          value: tally.home,
        },
        label: `Count, ${pairing}${prefix}`,
        onCancel: () => cards.cancel(one),
        onChange: (side, value) => cards.change(one, side, value),
        onSubmit: () => cards.submit(one),
      }}
    />
  );
}

function PairingList({
  pairings,
  prefix = '',
  title,
}: {
  pairings: readonly Pairing[];
  prefix?: string;
  title: string;
}) {
  const cards = useCards(pairings);
  return (
    <Card padding={4} variant="outlined">
      <Stack gap={3}>
        <Text as="h4" variant="label">
          {title}
        </Text>
        {pairings.map((one, index) => (
          <Stack key={one.id} gap={3}>
            {index > 0 ? <Separator decorative /> : null}
            <PairingCard cards={cards} one={one} prefix={prefix} />
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

export function FixtureCardSection() {
  const { colorScheme } = useTheme();
  const { palette } = useGalleryPalette();
  return (
    <Section
      id="fixture-card"
      purpose="FixtureCard is one pairing as a small vertical scorecard for inside a Card: the sides stacked with a score box at each one's end, so it fits a narrow column where a FixtureRow's boxes in the row's middle cannot. It draws no edge, fill or radius, and the consumer separates several with its own divider. It takes FixtureRow's score: the same boxes (digits only, selected on focus, Enter calls onSubmit, Escape calls onCancel, 32 px on a fine pointer, 44 px on a coarse one) and the same polite error line, under the sides in the danger ink. Its root is a group named by score.label, and it needs no FixtureGroup. meta and menu make a top line, the meta in caption size and the muted ink (a coloured Text inside it keeps its colour), the menu at the end. A side's note is muted caption words under its name. Names wrap and never truncate. actions is a wrapping row under the sides, and detail is under the actions with no type of its own, so give it a Text. Blank names or a blank score label throw a RangeError."
      title="FixtureCard"
      usage={`// tally, change, record and reset are your own state and handlers.
<Card padding={4}>
  <Stack gap={3}>
    <FixtureCard
      meta="Sun, Oct 18"
      menu={<ActionMenu label="More for Heron Marsh v Otter Pool"
        items={items} trigger={<Dots />} triggerAppearance="icon" />}
      home={{ name: 'Heron Marsh', note: 'North hide' }}
      away={{ name: 'Otter Pool' }}
      score={{
        label: 'Count, Heron Marsh v Otter Pool',
        home: { value: tally.home, label: 'Heron Marsh count' },
        away: { value: tally.away, label: 'Otter Pool count' },
        onChange: change,
        onSubmit: record,
        onCancel: reset,
        error: missing ? 'Type both counts.' : undefined,
      }}
      actions={<Button size="sm" variant="neutral" onPress={record}>Record</Button>}
      detail={<Text color="success" variant="caption">Recorded 3–1.</Text>}
    />
    <Separator decorative />
    {/* the next FixtureCard */}
  </Stack>
</Card>`}
    >
      <Stack gap={4}>
        <Grid columns={3} columnsBelow={{ md: 1 }} gap={4}>
          <PairingList pairings={waiting} title="Waiting for a count" />
          <PairingList pairings={counted} title="Counted" />
          <Card padding={4} variant="outlined">
            <Stack gap={3}>
              <Text as="h4" variant="label">
                Other shapes
              </Text>
              <FixtureCard
                away={{ name: 'Reed Bed' }}
                home={{ name: 'Elm Row' }}
                score={{
                  away: { label: 'Reed Bed count', value: '' },
                  home: { label: 'Elm Row count', value: '' },
                  label: 'Count, Elm Row v Reed Bed',
                  onChange: () => undefined,
                  onSubmit: () => undefined,
                }}
              />
              <Separator decorative />
              <FixtureCard
                away={{ name: 'Otter Pool' }}
                home={{ name: 'Bayside Dunes' }}
                meta="Not counted yet"
                score={{
                  away: { label: 'Otter Pool count', value: '' },
                  disabled: true,
                  home: { label: 'Bayside Dunes count', value: '' },
                  label: 'Count, Bayside Dunes v Otter Pool',
                  onChange: () => undefined,
                  onSubmit: () => undefined,
                }}
              />
            </Stack>
          </Card>
        </Grid>
        <Stack gap={2}>
          <Text color="muted" variant="caption">
            density compact
          </Text>
          <ThemeProvider
            colorScheme={colorScheme}
            density="compact"
            palette={palette}
          >
            <Grid
              columns={3}
              columnsBelow={{ md: 1 }}
              data-testid="fixture-card-compact"
              gap={4}
            >
              <PairingList
                pairings={waiting}
                prefix=" (compact)"
                title="Waiting for a count"
              />
            </Grid>
          </ThemeProvider>
        </Stack>
      </Stack>
    </Section>
  );
}
