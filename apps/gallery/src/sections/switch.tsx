import { Stack, Switch, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function SwitchSection() {
  const [activeOnly, setActiveOnly] = useState(false);
  const [saved, setSaved] = useState(true);
  const [toggleCount, setToggleCount] = useState(0);

  return (
    <Section
      id="switch"
      purpose="Switch is a persistent on/off setting or filter. The caller owns the state and localized text."
      title="Switch"
      usage={`<Switch
  label="Active habitats only"
  checked={activeOnly}
  onCheckedChange={setActiveOnly}
/>`}
    >
      <Stack gap={3}>
        <Switch
          checked={activeOnly}
          description="Hide archived habitats"
          label="Active habitats only"
          onCheckedChange={(next) => {
            setActiveOnly(next);
            setToggleCount((count) => count + 1);
          }}
        />
        <Switch
          checked={saved}
          label="Save sightings"
          onCheckedChange={setSaved}
        />
        <Switch
          checked={false}
          disabled
          label="Unavailable filter"
          onCheckedChange={() => undefined}
        />
        <Text color="muted" variant="caption">
          Active only: {activeOnly ? 'on' : 'off'}; saving:{' '}
          {saved ? 'on' : 'off'}. Active switch callbacks: {toggleCount}. Press
          Space to toggle a focused switch.
        </Text>
      </Stack>
    </Section>
  );
}
