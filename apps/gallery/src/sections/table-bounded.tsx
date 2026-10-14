import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
  type TableSort,
} from '@scalewing/react';
import { useState } from 'react';

import { counts, totals } from './table-footer.js';

type SiteColumn = 'site' | 'adults' | 'young';
type SiteCount = (typeof counts)[number];

const compare: Record<SiteColumn, (a: SiteCount, b: SiteCount) => number> = {
  site: (a, b) => a.site.localeCompare(b.site),
  adults: (a, b) => a.adults - b.adults,
  young: (a, b) => a.young - b.young,
};

/**
 * The census bounded to eight rows and sortable by any column: the sites
 * scroll inside the table's own region, the header pinned to its top and
 * the total of every site pinned to its bottom, each casting the scroll
 * shade while rows are hidden past it.
 */
export function TableBoundedExample() {
  const [sort, setSort] = useState<{
    column: SiteColumn;
    direction: Exclude<TableSort, 'none'>;
  } | null>(null);
  const rows =
    sort === null
      ? counts
      : [...counts].sort((a, b) => {
          const order = compare[sort.column](a, b);
          return sort.direction === 'ascending' ? order : -order;
        });
  const sortOf = (column: SiteColumn): TableSort =>
    sort?.column === column ? sort.direction : 'none';
  const sortBy = (column: SiteColumn) =>
    setSort((current) => ({
      column,
      direction:
        current?.column === column && current.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    }));

  return (
    <Table aria-label="Census in its own scroll" maxHeight={{ rows: 8 }}>
      <TableHeader>
        <TableRow>
          <TableCell
            as="th"
            onSort={() => sortBy('site')}
            sort={sortOf('site')}
          >
            Site
          </TableCell>
          <TableCell
            as="th"
            numeric
            onSort={() => sortBy('adults')}
            sort={sortOf('adults')}
          >
            Adults
          </TableCell>
          <TableCell
            as="th"
            numeric
            onSort={() => sortBy('young')}
            sort={sortOf('young')}
          >
            Young
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.site}>
            <TableCell>{row.site}</TableCell>
            <TableCell numeric>{row.adults}</TableCell>
            <TableCell numeric>{row.young}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter sticky>
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

/**
 * A compact list bounded to six rows with no total: the region's own
 * bottom edge shades while sites are hidden under it.
 */
export function TableBoundedListExample() {
  return (
    <Table
      aria-label="Sites in their own scroll"
      density="compact"
      maxHeight={{ rows: 6 }}
    >
      <TableHeader>
        <TableRow>
          <TableCell as="th">Site</TableCell>
          <TableCell as="th" numeric>
            Adults
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {counts.map((row) => (
          <TableRow key={row.site}>
            <TableCell>{row.site}</TableCell>
            <TableCell numeric>{row.adults}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
