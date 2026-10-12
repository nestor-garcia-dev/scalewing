import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from '@scalewing/react';

const sites = [
  'North reed bed',
  'South reed bed',
  'East shore',
  'West shore',
  'Island',
  'River mouth',
  'Willow bank',
  'Old quarry',
  'Meadow pond',
  'Alder carr',
  'Sand spit',
  'Heron wood',
  'Boathouse',
  'Weir',
  'Lagoon',
  'Footbridge',
  'Hide one',
  'Hide two',
  'Hide three',
  'Car park pond',
  'Orchard',
  'Long ditch',
  'Kingfisher bank',
  'Tern raft',
  'Reed cut',
  'Fen edge',
  'Pump house',
  'Stile',
  'Wet woodland',
  'Scrape',
] as const;

export const counts = sites.map((site, index) => ({
  site,
  adults: 3 + ((index * 7) % 11),
  young: (index * 5) % 6,
}));

export const totals = counts.reduce(
  (sum, row) => ({
    adults: sum.adults + row.adults,
    young: sum.young + row.young,
  }),
  { adults: 0, young: 0 },
);

/**
 * A long census whose total row stays pinned to the bottom edge while the
 * sites scroll under it, the header pinned to the top.
 */
export function TableFooterExample() {
  return (
    <Table aria-label="Census by site">
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
