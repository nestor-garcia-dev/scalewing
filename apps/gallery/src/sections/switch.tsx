import { Card, Stack, Switch, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function SwitchSection() {
  const [activeOnly, setActiveOnly] = useState(false);
  const [saved, setSaved] = useState(true);
  const [toggleCount, setToggleCount] = useState(0);
  const [numbered, setNumbered] = useState(false);
  const [signed, setSigned] = useState(true);

  return (
    <Section
      id="switch"
      purpose="Switch is a persistent on/off setting or filter. The caller owns the state and localized text. layout trailing puts the label and description first and the control at the row's end, as a settings list draws it; checkedTone success fills the track in the success colour while on."
      title="Switch"
      usage={`<Switch
  label="Active habitats only"
  checked={activeOnly}
  onCheckedChange={setActiveOnly}
/>

<Switch
  label="Number the observers"
  description="Names stay out of the file"
  layout="trailing"
  checkedTone="success"
  checked={numbered}
  onCheckedChange={setNumbered}
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
        <Card padding={4}>
          <Stack gap={3}>
            <Switch
              checked={numbered}
              checkedTone="success"
              description="Names stay out of the file; each observer is a number"
              label="Number the observers"
              layout="trailing"
              onCheckedChange={setNumbered}
            />
            <Switch
              checked={signed}
              checkedTone="success"
              description="Every sighting keeps who logged it"
              label="Who logged it"
              layout="trailing"
              onCheckedChange={setSigned}
            />
          </Stack>
        </Card>
        <Text color="muted" variant="caption">
          Active only: {activeOnly ? 'on' : 'off'}; saving:{' '}
          {saved ? 'on' : 'off'}. Active switch callbacks: {toggleCount}. Press
          Space to toggle a focused switch.
        </Text>
      </Stack>
    </Section>
  );
}
