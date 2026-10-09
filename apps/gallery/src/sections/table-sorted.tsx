import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  type TableSort,
} from '@scalewing/react';
import { useState } from 'react';

import { sampleCensusRows } from '../sample-copy.js';

type CensusColumn = 'species' | 'sightings';
type CensusRow = (typeof sampleCensusRows)[number];

const compare: Record<CensusColumn, (a: CensusRow, b: CensusRow) => number> = {
  species: (a, b) => a.species.localeCompare(b.species),
  sightings: (a, b) => a.sightings - b.sightings,
};

/**
 * The census sortable by species or sightings: a header press sorts by
 * that column, and a second press on it turns the order round.
 */
export function SortedCensus() {
  const [sort, setSort] = useState<{
    column: CensusColumn;
    direction: Exclude<TableSort, 'none'>;
  }>({ column: 'sightings', direction: 'descending' });
  const rows = [...sampleCensusRows].sort((a, b) => {
    const order = compare[sort.column](a, b);
    return sort.direction === 'ascending' ? order : -order;
  });
  const sortOf = (column: CensusColumn): TableSort =>
    sort.column === column ? sort.direction : 'none';
  const sortBy = (column: CensusColumn) =>
    setSort((current) => ({
      column,
      direction:
        current.column === column && current.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    }));

  return (
    <Table aria-label="Sorted census">
      <TableHeader>
        <TableRow>
          <TableCell
            as="th"
            onSort={() => sortBy('species')}
            sort={sortOf('species')}
          >
            Species
          </TableCell>
          <TableCell as="th">Habitat</TableCell>
          <TableCell
            as="th"
            numeric
            onSort={() => sortBy('sightings')}
            sort={sortOf('sightings')}
          >
            Sightings
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.species}>
            <TableCell>{row.species}</TableCell>
            <TableCell>{row.habitat}</TableCell>
            <TableCell numeric>{row.sightings}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
