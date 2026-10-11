import {
  Button,
  Dialog,
  Stack,
  Text,
  type ActionBarSummaryTone,
  type DialogAppearance,
} from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';

const colonies = [
  'North reed bed',
  'Willow island',
  'East bank',
  'Old weir',
  'Boathouse',
  'Heronry oaks',
];

/**
 * A wide count sheet: an icon and a description in its header, its rows
 * scrolling under a pinned footer with the moved figure, Cancel and one
 * named primary. The banded one draws its header and footer as bands on
 * the solid surface, its close button on a round fill.
 */
export function CountSheet({
  appearance = 'glass',
}: {
  appearance?: DialogAppearance;
}) {
  const title =
    appearance === 'banded'
      ? 'Move herons to the pond'
      : 'Move herons to the lake';
  const [open, setOpen] = useState(false);
  const [counted, setCounted] = useState(12);
  const close = () => setOpen(false);
  const tone: ActionBarSummaryTone = counted === 14 ? 'success' : 'danger';

  return (
    <>
      <Button onPress={() => setOpen(true)} variant="secondary">
        {title}
      </Button>
      <Dialog
        appearance={appearance}
        closeLabel="Close"
        description="The same herons leave the river count."
        footer={
          <>
            <Button onPress={close} variant="secondary">
              Cancel
            </Button>
            <Button disabled={counted !== 14} onPress={close}>
              Move {counted} herons
            </Button>
          </>
        }
        icon={<Glyph grid={24} path="M5 12h14M13 6l6 6-6 6" size={24} />}
        onClose={close}
        open={open}
        sheetBelow="md"
        size="xl"
        summary={{
          label: 'Lake',
          value: `+${counted}`,
          detail: counted === 14 ? 'matches the river' : 'river says 14',
          tone,
        }}
        title={title}
      >
        <Stack gap={2}>
          {colonies.map((colony) => (
            <Text key={colony}>{colony}: two herons</Text>
          ))}
          <Button
            onPress={() => setCounted((n) => (n === 14 ? 12 : 14))}
            size="sm"
            variant="ghost"
          >
            {counted === 14 ? 'Count two fewer' : 'Count two more'}
          </Button>
        </Stack>
      </Dialog>
    </>
  );
}

/** A warning that interrupts: an alertdialog with one primary to stay. */
export function StillCountingAlert() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <Button onPress={() => setOpen(true)} variant="secondary">
        Pause the count
      </Button>
      <Dialog
        footer={
          <>
            <Button onPress={close} variant="secondary">
              Close the log
            </Button>
            {/* The safe choice takes the focus, not the first button. */}
            <Button autoFocus onPress={close}>
              Keep counting
            </Button>
          </>
        }
        onClose={close}
        open={open}
        role="alertdialog"
        title="Are you still counting?"
      >
        <Text>The log closes in 1:42. The heron count is not saved yet.</Text>
      </Dialog>
    </>
  );
}
