import { DateField, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function DateFieldSection() {
  const [sightingDate, setSightingDate] = useState('2024-03-10');
  const [reviewDate, setReviewDate] = useState('2024-02-29');

  return (
    <Section
      id="date-field"
      purpose="DateField keeps a date-only value. The browser provides localized calendar and keyboard entry; callbacks receive YYYY-MM-DD or an empty value."
      title="DateField"
      usage={`<DateField
  label="Sighting date"
  value={sightingDate}
  onChange={setSightingDate}
  min="2024-01-01"
  max="2024-12-31"
/>`}
    >
      <Stack gap={3}>
        <Stack gap={3}>
          <DateField
            description="Native calendar, date-only value"
            label="Sighting date"
            max="2024-12-31"
            min="2024-01-01"
            onChange={setSightingDate}
            value={sightingDate}
          />
          <DateField
            error="Choose a date on or after March 1"
            label="Review date"
            min="2024-03-01"
            onChange={setReviewDate}
            value={reviewDate}
          />
          <DateField
            disabled
            label="Archived date"
            onChange={() => undefined}
            value="2024-11-03"
          />
        </Stack>
        <Text color="muted" variant="caption">
          Serialized sighting date: {sightingDate || 'empty'}.
        </Text>
        <Text color="muted" variant="caption">
          Serialized review date: {reviewDate || 'empty'}.
        </Text>
      </Stack>
    </Section>
  );
}
