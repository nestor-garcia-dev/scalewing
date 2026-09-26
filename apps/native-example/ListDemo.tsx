import {
  ListGroup,
  ListRow,
  Stack,
  Text,
  useTheme,
} from '@scalewing/react-native';
import { useState } from 'react';
import { View } from 'react-native';

const shifts = ['Dawn', 'Midday', 'Dusk'] as const;

/** A token-sized placeholder for a consumer's leading mark. */
function HabitatMark() {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.subtle,
        borderRadius: theme.radius.sm,
        height: theme.space[5],
        width: theme.space[5],
      }}
    />
  );
}

/** Rows that open, rows that choose in place, and rows that only show. */
export function ListDemo() {
  const [opened, setOpened] = useState('None yet');
  const [shift, setShift] = useState<(typeof shifts)[number]>('Dawn');

  return (
    <Stack gap={3}>
      <Text variant="label">Habitats</Text>
      <ListGroup accessibilityLabel="Habitats">
        <ListRow
          detail="12 animals · Keeper on duty"
          leading={<HabitatMark />}
          onPress={() => setOpened('Wetland')}
          title="Wetland"
        />
        <ListRow
          detail="4 animals"
          leading={<HabitatMark />}
          onPress={() => setOpened('Forest')}
          title="Forest"
          value="Closed"
        />
        <ListRow disabled onPress={() => undefined} title="Desert" />
      </ListGroup>
      <Text color="muted" variant="caption">
        Last opened: {opened}
      </Text>
      <Text variant="label">Feeding shift</Text>
      <ListGroup accessibilityLabel="Feeding shift">
        {shifts.map((name) => (
          <ListRow
            key={name}
            onPress={() => setShift(name)}
            selected={shift === name}
            title={name}
          />
        ))}
      </ListGroup>
      <ListGroup accessibilityLabel="Climate">
        <ListRow title="Humidity" value="68%" />
        <ListRow detail="Checked at dawn" title="Water" value="21 °C" />
      </ListGroup>
    </Stack>
  );
}
