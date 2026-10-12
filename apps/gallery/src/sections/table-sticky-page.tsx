import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from '@scalewing/react';

import { counts, totals } from './table-footer.js';

/**
 * A long census whose header pins to the page's top while the page
 * scrolls, with no pinned footer: its total is the table's last row and
 * scrolls with it.
 */
export function TableStickyPageExample() {
  return (
    <Table aria-label="Site census with its total last" stickyHeader="page">
      <TableHeader>
        <TableRow>
          <TableCell as="th">Site</TableCell>
          <TableCell as="th" numeric>
            Adults
          </TableCell>
          <TableCell as="th" numeric>
            Young
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {counts.map((row) => (
          <TableRow key={row.site}>
            <TableCell>{row.site}</TableCell>
            <TableCell numeric>{row.adults}</TableCell>
            <TableCell numeric>{row.young}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell as="th" scope="row">
            All {counts.length} sites
          </TableCell>
          <TableCell numeric>{totals.adults}</TableCell>
          <TableCell numeric>{totals.young}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
