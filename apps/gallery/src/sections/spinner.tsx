import { Inline, Spinner, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function SpinnerSection() {
  return (
    <Section
      id="spinner"
      purpose="Spinner indicates indeterminate loading. Supply one localized status per loading region and make repeated visual indicators decorative."
      title="Spinner"
      usage={`<Spinner label="Loading sightings" />`}
    >
      <Stack gap={3}>
        <Spinner label="Loading sightings" />
        <Inline gap={3}>
          <Spinner decorative size="sm" />
          <Spinner decorative size="md" />
          <Spinner decorative size="lg" />
          <Text>Decorative sizes beside the announced status</Text>
        </Inline>
      </Stack>
    </Section>
  );
}
