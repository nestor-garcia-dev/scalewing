import {
  Button,
  Dialog,
  Field,
  Inline,
  Stack,
  Text,
  type DialogAppearance,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

function SidePanel({ appearance }: { appearance: DialogAppearance }) {
  const title =
    appearance === 'banded' ? 'Log a sighting (banded)' : 'Log a sighting';
  const [open, setOpen] = useState(false);
  const [species, setSpecies] = useState('');
  const close = () => setOpen(false);
  return (
    <>
      <Button onPress={() => setOpen(true)} variant="neutral">
        {title}
      </Button>
      <Dialog
        appearance={appearance}
        closeLabel="Close"
        description="Note what you saw. You can edit it later."
        footer={
          <>
            <Button onPress={close} variant="neutral">
              Cancel
            </Button>
            <Button disabled={!species.trim()} onPress={close}>
              Save sighting
            </Button>
          </>
        }
        onClose={close}
        open={open}
        placement="end"
        sheetBelow="md"
        title={title}
      >
        <Stack gap={4}>
          <Field label="Species">
            <input
              onChange={(event) => setSpecies(event.currentTarget.value)}
              value={species}
            />
          </Field>
          <Field label="Where">
            <input defaultValue="North marsh" />
          </Field>
          <Text color="muted">
            Herons nest in tall reeds; count from the boardwalk.
          </Text>
        </Stack>
      </Dialog>
    </>
  );
}

export function DialogEndSection() {
  return (
    <Section
      id="dialog-end"
      purpose="Dialog placement=&quot;end&quot;: from md up a side panel, the window's full height at the inline end with Dialog's title, close button, scrolling content and pinned footer. Below md it is the centred dialog, or the bottom sheet with sheetBelow. Focus stays inside; Escape and the backdrop ask onClose."
      title="Dialog side panel"
      usage={`<Dialog
  open={open}
  onClose={close}
  placement="end"
  sheetBelow="md"
  title="Log a sighting"
  closeLabel="Close"
  footer={<><Button variant="neutral">Cancel</Button><Button>Save</Button></>}
>
  …
</Dialog>`}
    >
      <Inline gap={3} wrap>
        <SidePanel appearance="glass" />
        <SidePanel appearance="banded" />
      </Inline>
    </Section>
  );
}
