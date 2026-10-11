import {
  ActionBar,
  Button,
  Card,
  Stack,
  Stepper,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

const expectedNests = 16;

/**
 * A count whose figure rides in the bar: the summary's value is large and
 * tabular, danger while short and success once it matches, and the primary
 * stays disabled until it does.
 */
export function ActionBarSummaryExample() {
  const [nests, setNests] = useState<number | null>(14);
  const counted = nests ?? 0;
  const short = expectedNests - counted;
  const matches = short === 0;
  return (
    <Stack data-testid="action-bar-summary" gap={3}>
      <Text color="muted" variant="caption">
        summary: a labelled figure first in the status, its value large and
        tabular; tone colors the value, the detail says why.
      </Text>
      <Card padding={4} variant="outlined">
        <Stepper
          decrementLabel="One less"
          incrementLabel="One more"
          label="Nests counted on the island"
          onChange={setNests}
          placeholder="0"
          value={nests}
        />
      </Card>
      <ActionBar
        stickyBelow="md"
        summary={{
          label: 'Counted',
          value: `${counted} nests`,
          detail: matches
            ? `matches ${expectedNests}`
            : short > 0
              ? `short ${short}`
              : `over ${-short}`,
          tone: matches ? 'success' : 'danger',
        }}
      >
        <Button onPress={() => setNests(14)} variant="secondary">
          Cancel
        </Button>
        <Button disabled={!matches} onPress={() => undefined}>
          Save count
        </Button>
      </ActionBar>
    </Stack>
  );
}
