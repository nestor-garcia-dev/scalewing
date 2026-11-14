import { Checkbox, Grid, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

const reserveHabitats = ['Wetland', 'Meadow', 'Woodland'] as const;

/** A set of tile checkboxes: each tile is one press target. */
function HabitatTiles() {
  const [chosen, setChosen] = useState<string[]>(['Wetland']);
  const [hides, setHides] = useState(true);
  return (
    <Stack gap={2} data-testid="checkbox-tiles">
      <Grid columns={3} columnsBelow={{ md: 1 }} gap={2}>
        {reserveHabitats.map((habitat) => (
          <Checkbox
            appearance="tile"
            checked={chosen.includes(habitat)}
            key={habitat}
            label={habitat}
            onCheckedChange={(on) =>
              setChosen((was) =>
                on ? [...was, habitat] : was.filter((each) => each !== habitat),
              )
            }
          />
        ))}
      </Grid>
      <Grid columns={3} columnsBelow={{ md: 1 }} gap={2}>
        <Checkbox
          appearance="tile"
          checked={hides}
          description="Count the birds from each hide at dawn."
          label="Bird hides"
          onCheckedChange={setHides}
        />
        <Checkbox
          appearance="tile"
          checked={false}
          disabled
          label="Night survey"
          onCheckedChange={() => undefined}
        />
      </Grid>
    </Stack>
  );
}

export function CheckboxSection() {
  const [confirmed, setConfirmed] = useState(false);
  const [includeTracks, setIncludeTracks] = useState(true);
  const [changeCount, setChangeCount] = useState(0);

  return (
    <Section
      id="checkbox"
      purpose="Checkbox is an independent form choice. The browser supplies native checkbox and keyboard semantics; the caller owns its value and validation copy. Its error is described, marks it invalid, and is announced politely, as Field's is. With appearance tile, the box, its label and its description sit in a bordered tile as wide as its column, the whole tile one press target, edged in the accent while chosen."
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
        <HabitatTiles />
      </Stack>
    </Section>
  );
}
