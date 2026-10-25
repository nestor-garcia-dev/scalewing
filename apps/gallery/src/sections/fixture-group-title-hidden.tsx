import { Card, FixtureGroup, FixtureRow, Stack, Text } from '@scalewing/react';

/**
 * One count's result in a card whose heading already names the pairing and
 * the day: `FixtureGroup titleHidden` keeps that caption as the list's name
 * for assistive technology without drawing it a second time.
 */
export function CountResultCard() {
  return (
    <Card padding={4} variant="outlined">
      <Stack gap={2}>
        <Stack gap={0}>
          <Text as="h3" variant="title">
            Heron Marsh vs Otter Pool
          </Text>
          <Text color="muted" variant="caption">
            Sunday 25 October
          </Text>
        </Stack>
        <FixtureGroup
          title="Heron Marsh vs Otter Pool, Sunday 25 October"
          titleHidden
        >
          <FixtureRow
            away={{ name: 'Otter Pool' }}
            center="14–9"
            centerKind="score"
            home={{ name: 'Heron Marsh' }}
            status={{ label: 'Counted', tone: 'success' }}
          />
        </FixtureGroup>
      </Stack>
    </Card>
  );
}
