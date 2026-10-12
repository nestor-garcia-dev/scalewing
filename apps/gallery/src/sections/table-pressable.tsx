import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { sampleCensusRows } from '../sample-copy.js';

/**
 * Search results picked by a press anywhere on the row: each species is
 * its row's one action (a button in the cell's text), and the row passes
 * a press elsewhere on it to that action.
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
              <TableCell>{row.habitat}</TableCell>
              <TableCell numeric>{row.sightings}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Text aria-live="polite" color="muted" variant="caption">
        {picked === null ? 'No species picked' : `Picked ${picked}`}
      </Text>
    </Stack>
  );
}
