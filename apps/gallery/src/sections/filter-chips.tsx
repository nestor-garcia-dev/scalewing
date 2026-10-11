import { Button, FilterChips, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function FilterChipsSection() {
  const [weather, setWeather] = useState('');
  const [selected, setSelected] = useState('all');
  const [sightings, setSightings] = useState(42);
  const [changes, setChanges] = useState(0);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [saved, setSaved] = useState('');
  const options = [
    { value: 'all', label: 'All sightings', count: sightings },
    { value: 'forest', label: 'Forest canopy records', count: 18 },
    { value: 'desert', label: 'Desert scrub', count: 0, disabled: true },
    { value: 'tundra', label: 'Tundra transects', count: 0 },
    {
      value: 'wetland',
      label: 'Wetland observations across the migration season',
      count: 12,
    },
    { value: 'selva', label: 'Observaciones de selva tropical', count: 8 },
  ];

  return (
    <Section
      id="filter-chips"
      purpose="FilterChips keeps long single-choice filter sets visible. Native radios supply arrow and Space behavior; options wrap on narrow screens. An optional count renders as a tabular chicklet after the label, and a zero count quiets the chip until it is selected: a muted label on no fill, never faded. value '' is nothing chosen yet; required marks the label and each radio, and error puts a message under the chips (a polite live region), marks the group invalid and edges every chip in danger; aria-describedby adds a hint. requiredMark hidden leaves out the label's mark while each radio stays required; the hint says it in words."
      title="FilterChips"
      usage={`<FilterChips
  label="Sighting filters"
  value={selected}
  onChange={setSelected}
  options={[{ value: 'all', label: 'All sightings', count: 42 }]}
/>`}
    >
      <Stack gap={3}>
        <FilterChips
          label="Sighting filters"
          onChange={(next) => {
            setSelected(next);
            setChanges((count) => count + 1);
          }}
          options={options}
          value={selected}
        />
        <Button
          onPress={() => setSightings((count) => count + 1)}
          variant="secondary"
        >
          Add sighting
        </Button>
        <Text color="muted" variant="caption">
          Selected filter: {selected}. Callbacks: {changes}.
        </Text>
        <Text id="reason-hint" color="muted" variant="caption">
          The reason goes on the census record.
        </Text>
        <FilterChips
          aria-describedby="reason-hint"
          error={reasonError}
          label="Why remove this sighting"
          onChange={(next) => {
            setReason(next);
            setReasonError('');
          }}
          options={[
            { value: 'duplicate', label: 'Counted twice' },
            { value: 'misidentified', label: 'Wrong species' },
            { value: 'other', label: 'Other' },
          ]}
          required
          value={reason}
        />
        <Button
          onPress={() => {
            if (!reason) {
              setReasonError('Pick a reason to remove the sighting.');
              setSaved('');
            } else setSaved(`Removed: ${reason}`);
          }}
          variant="secondary"
        >
          Remove sighting
        </Button>
        <Text color="muted" data-testid="filter-chips-saved" variant="caption">
          {saved || 'Nothing removed yet.'}
        </Text>
        <Text color="muted" id="weather-hint" variant="caption">
          Required: the weather goes on every survey.
        </Text>
        <FilterChips
          aria-describedby="weather-hint"
          label="Weather"
          onChange={setWeather}
          options={[
            { value: 'clear', label: 'Clear' },
            { value: 'rain', label: 'Rain' },
          ]}
          required
          requiredMark="hidden"
          value={weather}
        />
      </Stack>
    </Section>
  );
}
