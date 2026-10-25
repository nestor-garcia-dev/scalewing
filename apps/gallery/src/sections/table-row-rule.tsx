import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@scalewing/react';

const sites = [
  { site: 'Reed bed', nests: 41 },
  { site: 'Salt marsh', nests: 38 },
  { site: 'Willow carr', nests: 33 },
  { site: 'Shingle spit', nests: 27 },
  { site: 'Heath pond', nests: 19 },
  { site: 'Old quarry', nests: 12 },
] as const;

/** The sites that get a ranger this spring. */
const cut = 3;

/**
 * Nesting sites ranked by nests, with a cut under the last site that gets
 * a ranger: `TableRow rule="after"`, said in words under the table.
 */
export function TableRowRuleExample({
  density = 'comfortable',
  label = 'Nesting sites by nests',
}: {
  density?: 'comfortable' | 'compact';
  label?: string;
}) {
  return (
    <Stack gap={2}>
      <Table aria-label={label} density={density}>
        <TableHeader>
          <TableRow>
            <TableCell as="th" numeric>
              #
            </TableCell>
            <TableCell as="th">Site</TableCell>
            <TableCell as="th" numeric>
              Nests
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((row, index) => (
            <TableRow
              key={row.site}
              rule={index + 1 === cut ? 'after' : undefined}
            >
              <TableCell numeric>{index + 1}</TableCell>
              <TableCell as="th" scope="row">
                {row.site}
              </TableCell>
              <TableCell numeric>{row.nests}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Text color="muted" variant="caption">
        The line under 3rd place marks the sites that get a ranger.
      </Text>
    </Stack>
  );
}
