import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@scalewing/react';

/**
 * A day's wader count read as a statement: the dawn count and what came
 * and went add up to a subtotal mid-table, a total row, before the dusk
 * count and the difference go on under it. Its figure is toned accent,
 * which keeps its colour at weight 600.
 */
export function TableTotalRowExample({
  density = 'comfortable',
  label = 'Waders through the day',
}: {
  density?: 'comfortable' | 'compact';
  label?: string;
}) {
  return (
    <Table aria-label={label} columnRules density={density}>
      <TableHeader>
        <TableRow>
          <TableCell as="th">Waders</TableCell>
          <TableCell as="th" numeric>
            Birds
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell as="th" scope="row">
            Counted at dawn
          </TableCell>
          <TableCell numeric>120</TableCell>
        </TableRow>
        <TableRow>
          <TableCell as="th" scope="row">
            Flew in
          </TableCell>
          <TableCell numeric tone="success">
            +34
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell as="th" scope="row">
            Flew off
          </TableCell>
          <TableCell numeric tone="muted">
            −18
          </TableCell>
        </TableRow>
        <TableRow variant="total">
          <TableCell as="th" scope="row">
            Expected at dusk
          </TableCell>
          <TableCell numeric tone="accent">
            136
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell as="th" scope="row">
            Counted at dusk
          </TableCell>
          <TableCell numeric>133</TableCell>
        </TableRow>
        <TableRow>
          <TableCell as="th" scope="row">
            Not seen again
          </TableCell>
          <TableCell numeric tone="danger">
            −3
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
