import {
  Badge,
  Button,
  Checkbox,
  Inline,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@scalewing/react';

import { useState } from 'react';

import { Section } from '../layout/Section.js';
import {
  sampleCensusRows,
  sampleCollarRows,
  sampleCollarRowsArabic,
  sampleWatchRows,
} from '../sample-copy.js';

export function TableSection() {
  const [collar, setCollar] = useState('');
  const [checkedCollars, setCheckedCollars] = useState<readonly string[]>([
    'c-221',
  ]);

  return (
    <Section
      id="table"
      purpose="Table aligns data in rows. stickyHeader keeps column labels visible. numeric cells use tabular numerals and end alignment. truncate clips overflowing cell copy. density compact densifies cells. selected marks the current row with an accent bar at its start that takes no space and no fill, so no column moves and no text loses contrast when a row is picked; the bar follows the writing direction and forced colors keep it."
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
        <Table aria-label="Tracking collars">
          <TableHeader>
            <TableRow>
              <TableCell as="th">Collar</TableCell>
              <TableCell as="th">Animal</TableCell>
              <TableCell as="th">Habitat</TableCell>
              <TableCell as="th" numeric>
                Battery
              </TableCell>
              <TableCell as="th">Choose</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleCollarRows.map((row) => (
              <TableRow key={row.id} selected={collar === row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.animal}</TableCell>
                <TableCell>{row.habitat}</TableCell>
                <TableCell numeric>{row.battery}</TableCell>
                <TableCell>
                  <Button
                    aria-label={`Select ${row.id}`}
                    aria-pressed={collar === row.id}
                    onPress={() => setCollar(row.id)}
                    size="xs"
                    variant="secondary"
                  >
                    Select
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table aria-label="أطواق التتبع" density="compact" dir="rtl">
          <TableHeader>
            <TableRow>
              <TableCell as="th">الطوق</TableCell>
              <TableCell as="th">الحيوان</TableCell>
              <TableCell as="th">الموطن</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleCollarRowsArabic.map((row) => {
              const checked = checkedCollars.includes(row.id);
              return (
                <TableRow key={row.id} selected={checked}>
                  <TableCell>
                    <Checkbox
                      checked={checked}
                      label={row.id}
                      onCheckedChange={(next) =>
                        setCheckedCollars((current) =>
                          next
                            ? [...current, row.id]
                            : current.filter((id) => id !== row.id),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{row.animal}</TableCell>
                  <TableCell>{row.habitat}</TableCell>
                </TableRow>
              );
            })}
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
