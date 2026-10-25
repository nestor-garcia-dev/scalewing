import {
  Button,
  Field,
  FixtureGroup,
  FixtureRow,
  type FixtureScoreSide,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

type Tally = { home: string; away: string };

type Game = {
  id: string;
  home: string;
  away: string;
  /** The counted tally, when there is one. */
  counted?: Tally;
};

const games: readonly Game[] = [
  { id: 'g1', home: 'Heron Marsh', away: 'Otter Pool' },
  {
    id: 'g2',
    home: 'Pine Ridge',
    away: 'Bittern Fen',
    counted: { home: '4', away: '2' },
  },
  { id: 'g3', home: 'Elm Row', away: 'Reed Bed' },
];

const blank: Tally = { home: '', away: '' };

function saved(game: Game): Tally {
  return game.counted ?? blank;
}

function differs(game: Game, tally: Tally): boolean {
  const before = saved(game);
  return before.home !== tally.home || before.away !== tally.away;
}

/** The tally sheet: typed counts per game, a message and a reason per row. */
function useTallies() {
  const [tallies, setTallies] = useState<Record<string, Tally>>(() =>
    Object.fromEntries(games.map((game) => [game.id, saved(game)])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [recorded, setRecorded] = useState('None yet');

  const change = (game: Game, side: FixtureScoreSide, value: string) => {
    setTallies((last) => ({
      ...last,
      [game.id]: { ...last[game.id]!, [side]: value },
    }));
    setErrors((last) => ({ ...last, [game.id]: '' }));
  };
  const cancel = (game: Game) => {
    setTallies((last) => ({ ...last, [game.id]: saved(game) }));
    setErrors((last) => ({ ...last, [game.id]: '' }));
    setReasons((last) => ({ ...last, [game.id]: '' }));
  };
  const submit = (game: Game) => {
    const tally = tallies[game.id]!;
    let error = '';
    if (!tally.home || !tally.away) error = 'Type both counts.';
    else if (game.counted && !reasons[game.id]?.trim())
      error = 'Say why the count changed.';
    setErrors((last) => ({ ...last, [game.id]: error }));
    if (!error)
      setRecorded(`${game.home} ${tally.home}–${tally.away} ${game.away}`);
  };
  return {
    tallies,
    errors,
    reasons,
    recorded,
    change,
    cancel,
    submit,
    setReasons,
  };
}

export function FixtureRowScoreSection() {
  const sheet = useTallies();
  const [chosen, setChosen] = useState(false);

  const row = (game: Game, flagged = false) => {
    const tally = sheet.tallies[game.id]!;
    const error = sheet.errors[game.id] ?? '';
    const changing = game.counted !== undefined && differs(game, tally);
    const counted = game.counted;
    return (
      <FixtureRow
        key={game.id}
        action={
          <Button
            aria-label={`Record ${game.home} vs ${game.away}`}
            onPress={() => sheet.submit(game)}
            size="sm"
            variant="neutral"
          >
            Record
          </Button>
        }
        away={{ name: game.away }}
        detail={
          changing ? (
            <Field label="Reason" labelVisuallyHidden>
              <input
                onChange={(event) => {
                  const typed = event.currentTarget.value;
                  sheet.setReasons((last) => ({ ...last, [game.id]: typed }));
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') sheet.submit(game);
                }}
                placeholder="Why? (both stations see this)"
                value={sheet.reasons[game.id] ?? ''}
              />
            </Field>
          ) : undefined
        }
        flag={flagged ? { label: 'Counts differ' } : undefined}
        home={{ name: game.home }}
        meta={
          changing && counted
            ? `Changing the counted ${counted.home}–${counted.away}`
            : counted
              ? undefined
              : 'Type it and press Enter'
        }
        score={{
          away: {
            value: tally.away,
            label: game.away,
            invalid: error ? !tally.away : undefined,
          },
          error,
          home: {
            value: tally.home,
            label: game.home,
            invalid: error ? !tally.home : undefined,
          },
          label: `Count, ${game.home} v ${game.away}`,
          onCancel: () => sheet.cancel(game),
          onChange: (side, value) => sheet.change(game, side, value),
          onSubmit: () => sheet.submit(game),
        }}
        select={
          flagged
            ? {
                checked: chosen,
                label: `Select ${game.home} vs ${game.away}`,
                onCheckedChange: setChosen,
              }
            : undefined
        }
        status={
          counted && !changing
            ? { label: 'Counted', tone: 'success' }
            : undefined
        }
      />
    );
  };

  return (
    <Section
      id="fixture-row-score"
      purpose="FixtureRow score puts two score boxes between the sides in place of the centre, for typing a result by keyboard: a group named by its label, each box a text input named by its own label (inputmode numeric, two digits, non-digits dropped before onChange, its text selected on focus), an en dash between them. Enter in either box calls onSubmit and Escape calls onCancel, which puts the boxes back. The boxes are 32 px squares on a fine pointer, so the row keeps its height, and 44 px on a coarse one. error is said politely under the row in the danger ink, describing both boxes and marking them invalid (a box's invalid false keeps it unmarked). disabled locks both. A row with a score is never a link or a button, as the boxes are their own controls; it works with flag, select and action. detail is a full-width part under the row, outside its press area, lined up with the home side's start: here a reason field while a counted tally is changed."
      title="FixtureRow score"
      usage={`// tally, change, record and reset are your own state and handlers.
<FixtureRow
  home={{ name: 'Heron Marsh' }}
  away={{ name: 'Otter Pool' }}
  score={{
    label: 'Count, Heron Marsh v Otter Pool',
    home: { value: tally.home, label: 'Heron Marsh', ref: homeBox },
    away: { value: tally.away, label: 'Otter Pool' },
    onChange: (side, value) => change(side, value),
    onSubmit: record,
    onCancel: reset,
    error: missing ? 'Type both counts.' : undefined,
  }}
  meta="Type it and press Enter"
  detail={changing ? <Field label="Reason" labelVisuallyHidden><input /></Field> : undefined}
/>`}
    >
      <Stack gap={4}>
        <FixtureGroup title="Thursday 29 October · Tally sheet">
          {row(games[0]!)}
          {row(games[1]!)}
          <FixtureRow
            away={{ name: 'Otter Pool' }}
            home={{ name: 'Bayside Dunes' }}
            meta="Not counted yet"
            score={{
              away: { value: '', label: 'Otter Pool' },
              disabled: true,
              home: { value: '', label: 'Bayside Dunes' },
              label: 'Count, Bayside Dunes v Otter Pool',
              onChange: () => undefined,
              onSubmit: () => undefined,
            }}
          />
        </FixtureGroup>
        <FixtureGroup title="Friday 30 October · Tally sheet">
          {row(games[2]!, true)}
        </FixtureGroup>
        <Text color="muted" role="status" variant="caption">
          Last recorded: {sheet.recorded}
        </Text>
      </Stack>
    </Section>
  );
}
