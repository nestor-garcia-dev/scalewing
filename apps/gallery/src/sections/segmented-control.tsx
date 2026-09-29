import {
  Button,
  Inline,
  SegmentedControl,
  Stack,
  Text,
} from '@scalewing/react';
import { useId, useState } from 'react';

import { Section } from '../layout/Section.js';

export function SegmentedControlSection() {
  const [animalClass, setAnimalClass] = useState('mammals');
  const [range, setRange] = useState('forest');
  const [period, setPeriod] = useState('day');
  const [naming, setNaming] = useState('common');
  const [movement, setMovement] = useState('');
  const [checked, setChecked] = useState(false);
  const [groupSize, setGroupSize] = useState('');
  const movementLabel = useId();
  const groupSizeLabel = useId();
  const groupSizeError =
    checked && !groupSize ? 'Choose the group size.' : undefined;
  const movementError =
    checked && !movement ? 'Choose arriving or leaving.' : undefined;

  return (
    <Section
      id="segmented-control"
      purpose="SegmentedControl is one exclusive choice. Use it instead of a row of independent Buttons. The compact variant is a quiet section switch; variant filled gives every segment the same width and an accent-filled selection, for a choice that decides what a form does; it takes the full width in a Stack and its labels' width in an Inline. disabled keeps the recorded choice visible but inert. error puts a message under the track, as Field does: described on the group, aria-invalid, a danger outline, and announced politely, never as an alert; required sets aria-required, and the element that labels the group shows the mark. error is for a control in a Stack or block layout, as the compact Group size is; in an Inline the field grows to fit the message (at least 24ch), so the row moves."
      title="SegmentedControl"
      usage={`<SegmentedControl
  aria-label="Class"
  value={animalClass}
  onChange={setAnimalClass}
  items={[
    { id: 'mammals', label: 'Mammals' },
    { id: 'birds', label: 'Birds' },
  ]}
/>

<SegmentedControl
  aria-label="Survey period"
  variant="filled"
  value={period}
  onChange={setPeriod}
  items={[
    { id: 'day', label: 'Daytime' },
    { id: 'night', label: 'Nighttime' },
  ]}
/>

<SegmentedControl
  aria-labelledby={movementLabel}
  error={movementError}
  required
  variant="filled"
  value={movement}
  onChange={setMovement}
  items={[
    { id: 'arriving', label: 'Arriving' },
    { id: 'leaving', label: 'Leaving' },
  ]}
/>`}
    >
      <Stack gap={4}>
        <SegmentedControl
          aria-label="Class"
          items={[
            { id: 'mammals', label: 'Mammals' },
            { id: 'birds', label: 'Birds' },
            { id: 'reptiles', label: 'Reptiles' },
          ]}
          onChange={setAnimalClass}
          value={animalClass}
        />
        <SegmentedControl
          aria-label="Range"
          items={[
            { id: 'forest', label: 'Forest' },
            { id: 'savanna', label: 'Savanna' },
            { id: 'ocean', label: 'Ocean' },
          ]}
          onChange={setRange}
          value={range}
        />
        <SegmentedControl
          aria-label="Survey period"
          items={[
            { id: 'day', label: 'Daytime' },
            { id: 'night', label: 'Nighttime' },
          ]}
          onChange={setPeriod}
          value={period}
          variant="filled"
        />
        <Inline gap={3} align="center" wrap>
          <Text variant="caption">Species names</Text>
          <SegmentedControl
            aria-label="Species names"
            items={[
              { id: 'common', label: 'Common' },
              { id: 'scientific', label: 'Scientific' },
            ]}
            onChange={setNaming}
            value={naming}
            variant="filled"
          />
        </Inline>
        <SegmentedControl
          aria-label="Recorded sighting"
          disabled
          items={[
            { id: 'wild', label: 'In the wild' },
            { id: 'captive', label: 'In captivity' },
          ]}
          value="wild"
          variant="filled"
        />
        <Stack gap={1}>
          <Text id={movementLabel} variant="label">
            Herd movement{' '}
            <Text as="span" aria-hidden="true" color="danger" variant="label">
              *
            </Text>
          </Text>
          <SegmentedControl
            aria-labelledby={movementLabel}
            error={movementError}
            items={[
              { id: 'arriving', label: 'Arriving' },
              { id: 'leaving', label: 'Leaving' },
            ]}
            onChange={setMovement}
            required
            value={movement}
            variant="filled"
          />
        </Stack>
        <Stack gap={1}>
          <Text id={groupSizeLabel} variant="label">
            Group size
          </Text>
          <SegmentedControl
            aria-labelledby={groupSizeLabel}
            error={groupSizeError}
            items={[
              { id: 'solo', label: 'Solo' },
              { id: 'pair', label: 'Pair' },
              { id: 'herd', label: 'Herd' },
            ]}
            onChange={setGroupSize}
            value={groupSize}
          />
        </Stack>
        <Button onPress={() => setChecked(true)} variant="secondary">
          Log movement
        </Button>
        <Text variant="caption">
          Selected: {animalClass} · {range} · {period} · {naming}
        </Text>
      </Stack>
    </Section>
  );
}
