import {
  Card,
  parsePastedRows,
  PasteRows,
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

const columns = [
  { id: 'bird', label: 'Bird' },
  { id: 'habitat', label: 'Habitat' },
  { id: 'skip', label: 'Don’t use' },
];

const sample = 'Bird\tHabitat\tCount\nMallard\tPond\t12\nGrey heron\tMarsh\t3';

/** The gallery's defaults: the first column is the bird, a second the habitat. */
function defaultMapping(count: number): string[] {
  return Array.from({ length: count }, (_, index) =>
    index === 0 ? 'bird' : index === 1 ? 'habitat' : 'skip',
  );
}

export function PasteRowsSection() {
  const [value, setValue] = useState(sample);
  const [chosen, setChosen] = useState<string[]>([]);
  const { rows, columnCount } = parsePastedRows(value, 'tab');
  const fallback = defaultMapping(columnCount);
  const mapping = fallback.map((id, index) => chosen[index] ?? id);
  const cellFor = (row: string[], id: string) => row[mapping.indexOf(id)] ?? '';
  // The gallery treats a first row of headings as no bird.
  const birds = rows.filter((row) => cellFor(row, 'bird') !== 'Bird');

  return (
    <Section
      id="paste-rows"
      purpose="Rows pasted from a spreadsheet: a text area split on tabs or commas, a polite count of the columns found and one small Select per column choosing what it means. Scalewing parses rows and cells only (parsePastedRows); the consumer keeps the mapping, checks the values and draws the preview."
      title="PasteRows"
      usage={`const { rows, columnCount } = parsePastedRows(value, 'tab');
<PasteRows
  label="Paste here"
  description="One bird per line. A second column sets the habitat."
  value={value}
  onValueChange={setValue}
  columns={[{ id: 'bird', label: 'Bird' }, { id: 'habitat', label: 'Habitat' }, { id: 'skip', label: 'Don’t use' }]}
  mapping={mapping}
  onMappingChange={setChosen}
  countLabel={(n) => \`Found \${n} columns\`}
  delimiter="tab"
/>`}
    >
      <Card data-testid="paste-rows-card" padding={5}>
        <Stack gap={4}>
          <PasteRows
            columns={columns}
            countLabel={(count) =>
              count === 1 ? 'Found 1 column' : `Found ${count} columns`
            }
            delimiter="tab"
            description="One bird per line. A second column sets the habitat."
            label="Paste here"
            mapping={mapping}
            onMappingChange={setChosen}
            onValueChange={setValue}
            value={value}
          />
          <Text role="status" variant="label">
            {birds.length === 1 ? '1 bird' : `${birds.length} birds`}
          </Text>
          {birds.length > 0 ? (
            <Table aria-label="Preview" density="compact">
              <TableHeader>
                <TableRow>
                  <TableCell as="th">Bird</TableCell>
                  <TableCell as="th">Habitat</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {birds.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{cellFor(row, 'bird')}</TableCell>
                    <TableCell>{cellFor(row, 'habitat') || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </Stack>
      </Card>
    </Section>
  );
}
