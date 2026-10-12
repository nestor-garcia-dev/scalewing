import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from '@scalewing/react';

import { counts, totals } from './table-footer.js';

/** Last season's whole count, a row under the headings that pins with them. */
const lastSeason = { adults: 1184, young: 402 };

/**
 * A long census whose header, the column headings and last season's count
 * under them, pins to the page's top as one group while the page scrolls,
 * with no pinned footer: its total is the table's last row and scrolls
 * with it.
 */
export function TableStickyPageExample() {
  return (
    <Table
      aria-label="Site census with its total last"
      columnRules
      stickyHeader="page"
    >
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
        <TableRow>
          <TableCell as="th" scope="row">
            Last season
          </TableCell>
          <TableCell numeric>{lastSeason.adults}</TableCell>
          <TableCell numeric>{lastSeason.young}</TableCell>
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
