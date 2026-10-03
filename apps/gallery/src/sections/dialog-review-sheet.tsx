import { Button, Dialog, Inline, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

const nightCount = [
  'Pipistrelle · 6 passes at the pond',
  'Noctule · 2 passes over the meadow',
  'Daubenton’s bat · 4 passes low over the water',
  'Brown long-eared bat · 1 pass at the hedgerow',
  'Tawny owl · heard twice from the oak copse',
  'Barn owl · 1 sighting over the hay meadow',
  'Hedgehog · 3 on the woodland ride',
  'Badger · 2 at the sett entrance',
  'Red fox · 1 crossing the stream bank',
  'Natterjack toad · chorus at the dune slack',
];

/** A phone review: a bottom sheet below md with a close button in its title row. */
export function ReviewSheet() {
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onPress={() => setOpen(true)} variant="secondary">
        Review night count
      </Button>
      <Dialog
        closeLabel="Close"
        onClose={close}
        open={open}
        sheetBelow="md"
        title="Review the night count"
      >
        <Text color="muted">
          Ten records from the pond transect. Check them before the count is
          sent to the survey.
        </Text>
        <Stack gap={2}>
          {nightCount.map((record) => (
            <Text key={record}>{record}</Text>
          ))}
        </Stack>
        <Inline gap={2} justify="end">
          <Button onPress={close} variant="secondary">
            Keep editing
          </Button>
          <Button onPress={close}>Send count</Button>
        </Inline>
      </Dialog>
    </>
  );
}
