import {
  Button,
  Checkbox,
  Inline,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableSelectCell,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

const birds = [
  { id: 'mallard', name: 'Mallard', habitat: 'Pond' },
  { id: 'heron', name: 'Grey heron', habitat: 'Marsh' },
  { id: 'teal', name: 'Teal', habitat: 'Reed bed' },
  { id: 'kingfisher', name: 'Kingfisher', habitat: 'River bank' },
];

export function TableSelectionSection() {
  const [chosen, setChosen] = useState<ReadonlySet<string>>(
    () => new Set(['heron']),
  );
  const [ringed, setRinged] = useState(false);
  const all = chosen.size === birds.length;
  const some = chosen.size > 0 && !all;
  const toggle = (id: string, next: boolean) =>
    setChosen((current) => {
      const copy = new Set(current);
      if (next) copy.add(id);
      else copy.delete(id);
      return copy;
    });

  return (
    <Section
      id="table-selection"
      purpose="A select column for a table: TableSelectCell holds a Checkbox whose label is visually hidden, the box its own target (44 px on a coarse pointer). The header's Select all is mixed while only some rows are chosen. Checkbox labelVisuallyHidden and indeterminate work outside a table too."
      title="Table selection"
      usage={`<TableSelectCell
  as="th"
  label="Select all"
  checked={all}
  indeterminate={some}
  onCheckedChange={(next) => setChosen(new Set(next ? birds.map((bird) => bird.id) : []))}
/>
<TableRow selected={chosen.has(bird.id)}>
  <TableSelectCell
    label={\`Select \${bird.name}\`}
    checked={chosen.has(bird.id)}
    onCheckedChange={(next) => toggle(bird.id, next)}
  />
  <TableCell>{bird.name}</TableCell>
</TableRow>`}
    >
      <Stack gap={3} data-testid="table-selection-card">
        <Table aria-label="Wetland birds" density="compact">
          <TableHeader>
            <TableRow>
              <TableSelectCell
                as="th"
                checked={all}
                indeterminate={some}
                label="Select all"
                onCheckedChange={(next) =>
                  setChosen(new Set(next ? birds.map((bird) => bird.id) : []))
                }
              />
              <TableCell as="th">Bird</TableCell>
              <TableCell as="th">Habitat</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {birds.map((bird) => (
              <TableRow key={bird.id} selected={chosen.has(bird.id)}>
                <TableSelectCell
                  checked={chosen.has(bird.id)}
                  label={`Select ${bird.name}`}
                  onCheckedChange={(next) => toggle(bird.id, next)}
                />
                <TableCell>{bird.name}</TableCell>
                <TableCell>{bird.habitat}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Inline align="center" gap={3} wrap>
          <Text color="muted" role="status" variant="caption">
            {chosen.size === 1 ? '1 selected' : `${chosen.size} selected`}
          </Text>
          <Button
            disabled={chosen.size === 0}
            onPress={() => setChosen(new Set())}
            size="sm"
            variant="neutral"
          >
            Clear
          </Button>
        </Inline>
        <Inline align="center" gap={4} wrap>
          <Checkbox
            checked={false}
            indeterminate
            label="Some nests checked"
            onCheckedChange={() => {}}
          />
          <Checkbox
            checked={ringed}
            label="Ringed"
            labelVisuallyHidden
            onCheckedChange={setRinged}
          />
          <Text color="muted" variant="caption">
            A box named “Ringed”, its label hidden
          </Text>
        </Inline>
      </Stack>
    </Section>
  );
}
