import {
  LiveRegion,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@scalewing/react';
import { useState } from 'react';

import { sampleCensusRows } from '../sample-copy.js';

/**
 * Search results picked by a press anywhere on the row: each species is
 * its row's one action (a button in the cell's text), and the row passes
 * a press elsewhere on it to that action. The habitat is a muted detail,
 * which takes the text colour on the row's quiet fill.
 */
export function PressableCensus() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <Stack gap={2}>
      <Table aria-label="Pick a species">
        <TableHeader>
          <TableRow>
            <TableCell as="th">Species</TableCell>
            <TableCell as="th">Habitat</TableCell>
            <TableCell as="th" numeric>
              Sightings
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleCensusRows.map((row) => (
            <TableRow key={row.species} pressable>
              <TableCell onPress={() => setPicked(row.species)}>
                {row.species}
              </TableCell>
              <TableCell tone="muted">{row.habitat}</TableCell>
              <TableCell numeric>{row.sightings}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <LiveRegion color="muted" variant="caption">
        {picked === null ? 'No species picked' : `Picked ${picked}`}
      </LiveRegion>
    </Stack>
  );
}
