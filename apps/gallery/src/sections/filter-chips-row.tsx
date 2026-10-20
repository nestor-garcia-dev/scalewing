import { FilterChips, FilterChipsRow, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

const kinds = [
  { value: 'all', label: 'All', count: 14 },
  { value: 'birds', label: 'Birds', count: 6 },
  { value: 'mammals', label: 'Mammals', count: 4 },
  { value: 'amphibians', label: 'Amphibians', count: 2 },
  { value: 'insects', label: 'Insects', count: 2 },
];

/** Two groups on one row: the kinds, then a toggle of another kind at the end. */
function GuideChips({
  overflow,
  name,
  labelled = false,
}: {
  overflow: 'wrap' | 'scroll';
  name: string;
  /** Draws each group's label, and an error under the kinds. */
  labelled?: boolean;
}) {
  const [kind, setKind] = useState('all');
  const [untranslated, setUntranslated] = useState<string[]>([]);
  return (
    <Stack gap={2}>
      <FilterChipsRow
        end={
          <FilterChips
            countAppearance="inline"
            label={`${name} not translated`}
            labelVisuallyHidden={!labelled}
            multiple
            onChange={setUntranslated}
            options={[
              {
                value: 'untranslated',
                label: 'Not translated',
                count: 2,
                tone: 'warning',
              },
            ]}
            value={untranslated}
          />
        }
        overflow={overflow}
      >
        <FilterChips
          countAppearance="inline"
          error={
            labelled
              ? 'Pick one kind of animal before you export these field guides to the ranger station, so each ranger gets only the guides for the animals they count.'
              : undefined
          }
          label={`${name} by kind`}
          labelVisuallyHidden={!labelled}
          onChange={setKind}
          options={kinds}
          overflow="scroll"
          value={kind}
        />
      </FilterChipsRow>
      <Text color="muted" variant="caption">
        Showing {kinds.find((each) => each.value === kind)?.label}
        {untranslated.length > 0 ? ', not translated only' : ''}.
      </Text>
    </Stack>
  );
}

export function FilterChipsRowSection() {
  return (
    <Section
      id="filter-chips-row"
      purpose="FilterChipsRow lays several FilterChips groups on one row: each group keeps its own name and choices (radios, or checkboxes), and the row wraps or scrolls them as one. end sets a group apart at the row's end, such as one toggle of another kind after the filters, at its own line's end when the row wraps. overflow scroll keeps every group's chips on one row that scrolls sideways together inside the row's own box, never the page; a group's own overflow gives way, and a group is as wide as its chips, so a drawn label or an error wraps under them."
      title="FilterChipsRow"
      usage={`<FilterChipsRow
  overflow="scroll"
  end={
    <FilterChips
      label="Not translated"
      labelVisuallyHidden
      multiple
      countAppearance="inline"
      value={untranslated}
      onChange={setUntranslated}
      options={[{ value: 'untranslated', label: 'Not translated', count: 2, tone: 'warning' }]}
    />
  }
>
  <FilterChips
    label="Kinds"
    labelVisuallyHidden
    countAppearance="inline"
    value={kind}
    onChange={setKind}
    options={kinds}
  />
</FilterChipsRow>`}
    >
      <Stack gap={5}>
        <GuideChips name="Scrolling guides" overflow="scroll" />
        <GuideChips name="Wrapping guides" overflow="wrap" />
        <GuideChips labelled name="Labelled guides" overflow="scroll" />
      </Stack>
    </Section>
  );
}
