import {
  Button,
  Combobox,
  type ComboboxGroup,
  type ComboboxOption,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

const mine: ComboboxOption[] = [
  {
    value: 'lagoon',
    label: 'Blue Lagoon',
    description: '2 visits · last Sep 28',
    badge: { label: 'Busy', tone: 'warning' },
  },
  { value: 'delta', label: 'Delta hide', description: '1 visit · last Jul 3' },
];

const everyone: ComboboxOption[] = [
  ...mine,
  {
    value: 'quarry',
    label: 'Old quarry',
    description: 'closed for nesting',
    badge: { label: 'Closed', tone: 'danger' },
    disabled: true,
  },
  { value: 'weir', label: 'Weir pool', description: '14 visits · last Oct 2' },
];

function labelOf(value: string): string {
  return everyone.find((option) => option.value === value)!.label;
}

export function ComboboxSection() {
  const [text, setText] = useState('');
  const [chosen, setChosen] = useState('Nothing yet');
  const [error, setError] = useState('');
  const query = text.trim().toLowerCase();
  const groups: ComboboxGroup[] = query
    ? [
        {
          label: 'All stations',
          options: everyone.filter((option) =>
            option.label.toLowerCase().includes(query),
          ),
        },
      ]
    : [{ label: "Kim's stations", options: mine }];

  return (
    <Section
      id="combobox"
      purpose="Combobox is a text input with a list of suggestions (ARIA 1.2 combobox with list autocomplete). Typing, a press on the input or ArrowDown opens the list; the page filters the groups from the text. The arrow keys move the active option while focus stays in the input; Enter or a press chooses it, Escape closes the list and a second Escape empties the input. Options can carry a badge and a muted description; a disabled option is shown and read as unavailable but never chosen. An action, such as adding a new entry, ends the list, a note can follow it, and the empty text shows when nothing matches. A live region, always in the page, announces the empty text and, with countText, the number of options. The input is a Field, so its description, error, required mark and size work as on any field."
      title="Combobox"
      usage={`<Combobox
  label="Station"
  inputValue={text}
  onInputChange={setText}
  groups={[{ label: 'All stations', options: [{ value: 'weir', label: 'Weir pool', description: '14 visits', badge: { label: 'Busy', tone: 'warning' } }] }]}
  onSelect={(value) => setText(labelOf(value))}
  action={{ label: \`New station “\${text}”\`, onPress: addStation }}
  emptyText="No station matches."
  countText={(count) => \`\${count} stations\`}
  listLabel="Stations"
/>`}
    >
      <Stack gap={3}>
        <Combobox
          action={
            query
              ? {
                  label: `New station “${text.trim()}”`,
                  onPress: () => setChosen(`New station: ${text.trim()}`),
                  badge: { label: 'New station' },
                }
              : undefined
          }
          countText={(count) =>
            count === 1 ? '1 station' : `${count} stations`
          }
          emptyText="No station matches."
          error={error}
          groups={groups}
          inputValue={text}
          label="Station"
          listLabel="Stations"
          note={
            query
              ? undefined
              : 'Not here? Type the name to search every station.'
          }
          onInputChange={(next) => {
            setText(next);
            setError('');
          }}
          onSelect={(value) => {
            setText(labelOf(value));
            setChosen(labelOf(value));
          }}
          placeholder="Station on the form"
          required
        />
        <Text color="muted" data-testid="combobox-chosen" variant="caption">
          Chosen: {chosen}
        </Text>
        <Button
          onPress={() => setError(text ? '' : 'Pick a station.')}
          size="sm"
          variant="secondary"
        >
          Check the station
        </Button>
        <Combobox
          emptyText="No ring matches."
          groups={[]}
          inputValue="R-12"
          label="Ring number"
          labelVisuallyHidden
          onInputChange={() => undefined}
          onSelect={() => undefined}
          size="xs"
          disabled
        />
      </Stack>
    </Section>
  );
}
