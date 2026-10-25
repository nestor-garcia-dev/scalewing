import { Button, Inline, LiveRegion, Select, Stack } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';
import { sampleHabitats } from '../sample-copy.js';

export function SelectDisabledSection() {
  const [habitat, setHabitat] = useState('forest');
  const [locked, setLocked] = useState(true);

  return (
    <Section
      id="select-disabled"
      purpose="Select disabled turns the control off, as Button's disabled does: the trigger is a native disabled button, so it leaves the Tab order, is read as dimmed and fades; its list cannot open (an open one closes when it is turned off) and onChange is never called. Say why it is off in the page's words, here in a polite LiveRegion beside it. In forced colours its frame, words and chevron turn the system's grey."
      title="Select disabled"
      usage={`<Select
  label="Survey habitat"
  disabled={uploading}
  value={habitat}
  onChange={setHabitat}
  options={habitats}
/>
<LiveRegion color="muted" variant="caption">
  {uploading ? 'Locked while the census uploads' : ''}
</LiveRegion>`}
    >
      <Stack gap={3}>
        <Select
          disabled={locked}
          label="Survey habitat"
          onChange={setHabitat}
          options={sampleHabitats}
          value={habitat}
        />
        <Inline align="center" gap={3}>
          <Button
            onPress={() => setLocked((value) => !value)}
            variant="neutral"
          >
            {locked ? 'Finish the upload' : 'Start an upload'}
          </Button>
          <LiveRegion color="muted" variant="caption">
            {locked ? 'Locked while the census uploads' : ''}
          </LiveRegion>
        </Inline>
      </Stack>
    </Section>
  );
}
