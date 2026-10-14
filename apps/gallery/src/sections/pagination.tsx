import {
  Pagination,
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
import { counts } from './table-footer.js';

const perPage = 10;
const pageCount = Math.ceil(counts.length / perPage);

/** Which sites a page shows, as the words under the list say it. */
function rangeWords(page: number): string {
  const first = (page - 1) * perPage + 1;
  const last = Math.min(page * perPage, counts.length);
  return `${first}–${last} of ${counts.length} sites · ${perPage} a page`;
}

/** The census without a total, ten sites a page. */
function PagedCensus() {
  const [page, setPage] = useState(1);
  const shown = counts.slice((page - 1) * perPage, page * perPage);
  return (
    <Stack gap={3}>
      <Table aria-label="Sites, a page at a time" layout="fixed">
        <TableHeader>
          <TableRow>
            <TableCell as="th">Site</TableCell>
            <TableCell as="th" numeric width="sm">
              Adults
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map((row) => (
            <TableRow key={row.site}>
              <TableCell>{row.site}</TableCell>
              <TableCell numeric>{row.adults}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        aria-label="Site pages"
        labels={{ previous: 'Previous page', next: 'Next page' }}
        onPageChange={setPage}
        page={page}
        pageCount={pageCount}
        rangeLabel={rangeWords(page)}
      />
    </Stack>
  );
}

export function PaginationSection() {
  return (
    <Section
      id="pagination"
      purpose="Pagination steps through a list shown a page at a time, for a list with no total to keep in view (a list that adds up scrolls inside itself instead, with Table maxHeight). It is a navigation landmark named by aria-label or aria-labelledby: the product's words for what the page shows at the start (rangeLabel, announced politely when it changes) and the previous and next steps at the end, icon-only neutral buttons named by labels. At either end a step looks disabled but stays a Tab stop, so focus is never dropped when the last page is reached, and a press there does nothing. Pages count from 1."
      title="Pagination"
      usage={`<Pagination
  aria-label="Sighting pages"
  page={page}
  pageCount={6}
  onPageChange={setPage}
  rangeLabel="1–25 of 130 sightings"
  labels={{ previous: 'Previous page', next: 'Next page' }}
/>`}
    >
      <Stack gap={4}>
        <Text variant="label">Thirty sites, ten a page</Text>
        <PagedCensus />
        <Text variant="label">A single page</Text>
        <Pagination
          aria-label="Heron pages"
          labels={{ previous: 'Previous page', next: 'Next page' }}
          onPageChange={() => {}}
          page={1}
          pageCount={1}
          rangeLabel="1–4 of 4 herons"
        />
      </Stack>
    </Section>
  );
}
