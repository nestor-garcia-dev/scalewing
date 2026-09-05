import { Button, Dialog, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function DialogSection() {
  const [open, setOpen] = useState(false);

  return (
    <Section
      id="dialog"
      purpose="Dialog is a modal on the native top layer. It leaves document flow, dims the canvas, and closes on Escape or backdrop press. Card cannot do that."
      title="Dialog"
      usage={`<Dialog open={open} onClose={() => setOpen(false)} title="How we rank">
  <Text>Habitat loss is subtracted.</Text>
  <Button onPress={() => setOpen(false)}>Close</Button>
</Dialog>`}
    >
      <Stack gap={3}>
        <Button
          onPress={() => {
            setOpen(true);
          }}
        >
          Open dialog
        </Button>
        <Dialog
          onClose={() => {
            setOpen(false);
          }}
          open={open}
          title="How we rank"
        >
          <Text>
            Higher range raises the watch score. Habitat loss is subtracted.
            Sightings stay a census column.
          </Text>
          <Button
            onPress={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        </Dialog>
      </Stack>
    </Section>
  );
}
