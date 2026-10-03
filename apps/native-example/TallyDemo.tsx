import { ListGroup, Stack, StepperRow, Text } from '@scalewing/react-native';
import { useState } from 'react';

const birds = [
  { band: '#4', name: 'Avocet' },
  { band: '#12', name: 'Heron' },
  { band: undefined, name: 'Kingfisher' },
  { band: '#9', name: 'Plover' },
] as const;

/** A list of counted rows. */
export function TallyDemo() {
  const [counts, setCounts] = useState<Record<string, number>>({ Heron: 2 });
  const count = (name: string) => counts[name] ?? 0;
  const setCount = (name: string) => (value: number) =>
    setCounts((current) => ({ ...current, [name]: value }));

  return (
    <Stack gap={3}>
      <Text variant="label">Nest tally</Text>
      <ListGroup accessibilityLabel="Hatchlings per bird">
        {birds.map((bird) => (
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
