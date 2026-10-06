import {
  Field,
  ListGroup,
  Stack,
  StepperRow,
  Text,
  useTheme,
} from '@scalewing/react-native';
import { useState } from 'react';
import { View } from 'react-native';

const birds = [
  { band: '#4', name: 'Avocet' },
  { band: '#12', name: 'Heron' },
  { band: undefined, name: 'Kingfisher' },
  { band: '#9', name: 'Plover' },
] as const;

/** A token-sized placeholder for a consumer's Lucide magnifier. */
function SearchMark() {
  const theme = useTheme();

  return (
    <View
      style={{
        borderColor: theme.colors.muted,
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        height: theme.space[3],
        width: theme.space[3],
      }}
    />
  );
}

/** A search field over a list of counted rows, filtered as you type. */
export function TallyDemo() {
  const [query, setQuery] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({ Heron: 2 });
  const shown = birds.filter((bird) =>
    bird.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const count = (name: string) => counts[name] ?? 0;
  const setCount = (name: string) => (value: number) =>
    setCounts((current) => ({ ...current, [name]: value }));

  return (
    <Stack gap={3}>
      <Text variant="label">Nest tally</Text>
      <Field
        autoCorrect={false}
        clearLabel="Clear search"
        label="Search birds"
        leading={<SearchMark />}
        onChangeText={setQuery}
        placeholder="Search"
        testID="bird-search"
        value={query}
        variant="search"
      />
      <ListGroup accessibilityLabel="Hatchlings per bird">
        {shown.map((bird) => (
          <StepperRow
            decrementLabel={`One fewer for ${bird.name}`}
            detail={bird.band}
            incrementLabel={`One more for ${bird.name}`}
            key={bird.name}
            max={6}
            min={0}
            onChange={setCount(bird.name)}
            testID={`tally-${bird.name.toLowerCase()}`}
            title={bird.name}
            value={count(bird.name)}
          />
        ))}
        <StepperRow
          decrementLabel="One fewer unbanded"
          detail="Not banded or not sure"
          incrementLabel="One more unbanded"
          max={6}
          min={0}
          onChange={setCount('Unbanded')}
          title="Unbanded"
          value={count('Unbanded')}
        />
        <StepperRow
          decrementLabel="One fewer"
          disabled
          incrementLabel="One more"
          max={6}
          min={0}
          onChange={setCount('Closed nest')}
          title="Closed nest"
          value={0}
        />
      </ListGroup>
    </Stack>
  );
}
