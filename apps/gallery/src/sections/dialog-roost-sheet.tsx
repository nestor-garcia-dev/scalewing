import {
  Badge,
  Button,
  Card,
  Dialog,
  Stack,
  Text,
  type DialogAppearance,
} from '@scalewing/react';
import { useState } from 'react';

const roosts = ['Church loft', 'Barn eaves', 'Bridge arch'];

/**
 * A phone tally sheet: a grabber at its top edge, its cards on the grouped
 * canvas, and a footer whose figure stays out until the first roost is
 * counted, with a status line beside the actions.
 */
export function RoostSheet({
  appearance = 'glass',
}: {
  appearance?: DialogAppearance;
}) {
  const title =
    appearance === 'banded' ? 'Tally the bridge roosts' : 'Tally the roosts';
  const [open, setOpen] = useState(false);
  const [counted, setCounted] = useState(0);
  const close = () => setOpen(false);

  return (
    <>
      <Button
        onPress={() => {
          setCounted(0);
          setOpen(true);
        }}
        variant="secondary"
      >
        {title}
      </Button>
      <Dialog
        appearance={appearance}
        canvas="grouped"
        closeLabel="Close"
        footer={
          <>
            <Button onPress={close} variant="secondary">
              Cancel
            </Button>
            <Button disabled={counted === 0} onPress={close}>
              Save tally
            </Button>
          </>
        }
        onClose={close}
        open={open}
        sheetBelow="md"
        sheetGrabber
        status={
          counted === 0 ? (
            'Nothing counted yet'
          ) : (
            <span>
              <Badge tone="success">Saved</Badge> on this device
            </span>
          )
        }
        summary={{
          label: 'Bats',
          // No figure until the first roost is counted.
          value: counted === 0 ? '' : String(counted),
          detail: 'in all roosts',
        }}
        title={title}
      >
        <Stack gap={3}>
          {roosts.map((roost) => (
            <Card key={roost} padding={4}>
              <Stack gap={2}>
                <Text variant="label">{roost}</Text>
                <Text color="muted">Count the bats leaving at dusk.</Text>
                <Button
                  onPress={() => setCounted((n) => n + 4)}
                  size="sm"
                  variant="secondary"
                >
                  Add four at {roost.toLowerCase()}
                </Button>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Dialog>
    </>
  );
}
