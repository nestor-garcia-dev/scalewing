import { MatchCard, Stack, Text } from '@scalewing/react-native';
import { useState } from 'react';

/** The next race as a card that opens it, with and without a leading line. */
export function MatchCardDemo() {
  const [opened, setOpened] = useState(0);

  return (
    <Stack gap={3}>
      <Text variant="title">Match card</Text>
      <MatchCard
        accessibilityHint="Opens the race"
        details={['North pond · Lane 2', 'Spring meet · Heats']}
        leading="Your next race"
        onPress={() => setOpened((count) => count + 1)}
        sides={[
          { caption: 'Home', name: 'Heron' },
          { caption: 'Away', name: 'Otter Creek Swimmers' },
        ]}
        when="Tomorrow · 9:00 AM"
      />
      <MatchCard
        details={['South pond']}
        onPress={() => setOpened((count) => count + 1)}
        sides={[
          { caption: 'Home', initials: 'LX', name: 'Lynx' },
          { caption: 'Away', name: 'Badger' },
        ]}
        when="Saturday · 10:30 AM"
      />
      <Text color="muted" variant="caption">
        Opened {opened} times
      </Text>
    </Stack>
  );
}
