import {
  Button,
  Dialog,
  Field,
  Grid,
  Inline,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

const bills = ['$1', '$5', '$10', '$20', '$50', '$100'];

export function DialogSection() {
  const [open, setOpen] = useState(false);
  const [wideOpen, setWideOpen] = useState(false);

  return (
    <Section
      id="dialog"
      purpose="Dialog is a modal on the native top layer. It leaves document flow, dims the canvas, and closes on Escape or backdrop press. Card cannot do that. size md is the reading width for a message or a short form; size lg holds a row of six fields or a data grid without folding it, and both keep the viewport gutter on a phone."
      title="Dialog"
      usage={`<Dialog open={open} onClose={() => setOpen(false)} title="How we rank">
  <Text>Habitat loss is subtracted.</Text>
  <Button onPress={() => setOpen(false)}>Close</Button>
</Dialog>

<Dialog open={open} onClose={close} size="lg" title="Count the till">
  <Grid columns={6} columnsBelow={{ md: 2 }} gap={3}>
    <Field label="$1"><input inputMode="numeric" /></Field>
    …
  </Grid>
</Dialog>`}
    >
      <Stack gap={3}>
        <Inline gap={2} wrap>
          <Button
            onPress={() => {
              setOpen(true);
            }}
          >
            Open dialog
          </Button>
          <Button
            onPress={() => {
              setWideOpen(true);
            }}
            variant="secondary"
          >
            Open wide dialog
          </Button>
        </Inline>
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
        <Dialog
          onClose={() => {
            setWideOpen(false);
          }}
          open={wideOpen}
          size="lg"
          title="Count the till"
        >
          <Text color="muted">
            Enter how many of each bill are in the till. Six fields stay on one
            row at the large size.
          </Text>
          <Grid columns={6} columnsBelow={{ md: 2 }} gap={3}>
            {bills.map((bill) => (
              <Field key={bill} label={bill}>
                <input
                  autoComplete="off"
                  defaultValue="0"
                  inputMode="numeric"
                  name={`till-${bill.slice(1)}`}
                />
              </Field>
            ))}
          </Grid>
          <Inline gap={2} justify="end">
            <Button
              onPress={() => {
                setWideOpen(false);
              }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                setWideOpen(false);
              }}
            >
              Record count
            </Button>
          </Inline>
        </Dialog>
      </Stack>
    </Section>
  );
}
