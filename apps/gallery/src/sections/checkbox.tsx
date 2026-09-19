import { Checkbox, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function CheckboxSection() {
  const [confirmed, setConfirmed] = useState(false);
  const [includeTracks, setIncludeTracks] = useState(true);
  const [changeCount, setChangeCount] = useState(0);

  return (
    <Section
      id="checkbox"
      purpose="Checkbox is an independent form choice. The browser supplies native checkbox and keyboard semantics; the caller owns its value and validation copy."
      title="Checkbox"
      usage={`<Checkbox
  label="Source confirmed"
  checked={confirmed}
  onCheckedChange={setConfirmed}
  required
/>`}
    >
      <Stack gap={3}>
        <Checkbox
          checked={confirmed}
          description="Confirm the source before recording this sighting"
          error={confirmed ? undefined : 'Confirm the source'}
          label="Source confirmed"
          onCheckedChange={(next) => {
            setConfirmed(next);
            setChangeCount((count) => count + 1);
          }}
          required
        />
        <Checkbox
          checked={includeTracks}
          label="Include tracks"
          onCheckedChange={setIncludeTracks}
        />
        <Checkbox
          checked={false}
          disabled
          label="Archived habitat observations require curator access"
          onCheckedChange={() => undefined}
        />
        <Text color="muted" variant="caption">
          Source: {confirmed ? 'confirmed' : 'unconfirmed'}. Tracks:{' '}
          {includeTracks ? 'included' : 'excluded'}. Callbacks: {changeCount}.
        </Text>
      </Stack>
    </Section>
  );
}
