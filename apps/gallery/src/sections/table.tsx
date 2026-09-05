import {
  Badge,
  Button,
  Inline,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@scalewing/react';

import { Section } from '../layout/Section.js';
import { sampleCensusRows, sampleWatchRows } from '../sample-copy.js';

export function TableSection() {
  return (
    <Section
      id="table"
      purpose="Table aligns data in rows. stickyHeader keeps column labels visible. numeric cells use tabular numerals and end alignment. truncate clips overflowing cell copy. density compact densifies cells. selected marks the current row."
      title="Table"
      usage={`<Table aria-label="Census" density="compact">
  <TableBody>
    <TableRow selected>
      <TableCell>Common</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
    >
      <Stack gap={5}>
        <Table aria-label="Example census">
          <TableHeader>
            <TableRow>
              <TableCell as="th">Species</TableCell>
              <TableCell as="th">Habitat</TableCell>
              <TableCell as="th" numeric>
                Sightings
              </TableCell>
              <TableCell as="th" numeric>
                Δ
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleCensusRows.map((row) => (
              <TableRow key={row.species}>
                <TableCell>{row.species}</TableCell>
                <TableCell>{row.habitat}</TableCell>
                <TableCell numeric>{row.sightings}</TableCell>
                <TableCell numeric>{row.delta}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table aria-label="Watch list" density="compact">
          <TableHeader>
            <TableRow>
              <TableCell as="th">Slot</TableCell>
              <TableCell as="th">Animal</TableCell>
              <TableCell as="th" numeric>
                Sightings
              </TableCell>
              <TableCell as="th" numeric>
                Δ
              </TableCell>
              <TableCell as="th">Why</TableCell>
              <TableCell as="th">Log</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleWatchRows.map((row) => (
              <TableRow key={row.slot} selected={row.selected}>
                <TableCell>{row.slot}</TableCell>
                <TableCell>{row.animal}</TableCell>
                <TableCell numeric>{row.sightings}</TableCell>
                <TableCell numeric>{row.delta}</TableCell>
                <TableCell>
                  <Inline gap={1} wrap>
                    {row.chips.map((chip) => (
                      <Badge key={chip} size="sm">
                        {chip}
                      </Badge>
                    ))}
                  </Inline>
                </TableCell>
                <TableCell>
                  <Inline gap={1} wrap>
                    <Button
                      onPress={() => undefined}
                      size="xs"
                      variant="primary"
                    >
                      Log
                    </Button>
                    <Button onPress={() => undefined} size="xs" variant="ghost">
                      Skip
                    </Button>
                  </Inline>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Text variant="caption" color="muted">
          Pass stickyHeader false when the header should scroll away. density
          compact and selected are for ranked lists. Why chips are Badge sm, not
          a second chip control.
        </Text>
      </Stack>
    </Section>
  );
}
