import { Bracket, Stack, Text } from '@scalewing/react-native';
import { useState } from 'react';

/** A heat-and-final race bracket: the semi-finals run, the final to come. */
export function BracketDemo() {
  const [round, setRound] = useState('semis');

  return (
    <Stack gap={3}>
      <Text variant="title">Bracket</Text>
      <Bracket
        accessibilityLabel="Race rounds"
        onChange={setRound}
        rounds={[
          {
            id: 'semis',
            label: 'Semi-finals',
            matches: [
              {
                accessibilityLabel: 'Heron 2, Otter 0, Heron goes through',
                away: {
                  label: 'Otter',
                  outcome: 'loser',
                  score: '0',
                  seed: '4',
                },
                detail: 'North pond',
                home: {
                  label: 'Heron',
                  outcome: 'winner',
                  score: '2',
                  seed: '1',
                },
                id: 'sf1',
                status: 'Done',
              },
              {
                accessibilityLabel: 'Lynx versus Badger, Saturday',
                away: { label: 'Badger', seed: '3' },
                detail: 'South pond',
                home: { label: 'Lynx', seed: '2' },
                id: 'sf2',
                status: 'Sat 10:00',
              },
            ],
          },
          {
            id: 'final',
            label: 'Final',
            matches: [
              {
                accessibilityLabel:
                  'Heron versus the winner of Lynx and Badger',
                away: { label: 'Winner of Lynx v Badger', outcome: 'pending' },
                home: { label: 'Heron', seed: '1' },
                id: 'final',
                status: 'Sun 10:00',
                tentative: true,
              },
            ],
          },
        ]}
        value={round}
      />
    </Stack>
  );
}
