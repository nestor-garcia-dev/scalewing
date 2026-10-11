import {
  Badge,
  GlyphTile,
  Inline,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@scalewing/react';

import { Glyph } from '../glyph.js';

const feather =
  'M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z M16 8 2 22 M17.5 15H9';

const kinds = ['Adults', 'Young', 'Eggs'] as const;

type LedgerRow = {
  id: string;
  time: string;
  name: string;
  change: string;
  tone?: 'success' | 'danger' | 'accent';
  counts: readonly string[];
  sub?: boolean;
  struck?: string;
};

const rows: readonly LedgerRow[] = [
  {
    id: 'l-1',
    time: '6:10',
    name: 'Heron colony count',
    change: '+14',
    tone: 'success',
    counts: ['+8', '+4', '+2'],
  },
  {
    id: 'l-2',
    time: '',
    name: 'North reed bed',
    change: '+9',
    counts: ['+5', '+3', '+1'],
    sub: true,
  },
  {
    id: 'l-3',
    time: '',
    name: 'South reed bed',
    change: '+5',
    counts: ['+3', '+1', '+1'],
    sub: true,
  },
  {
    id: 'l-3b',
    time: '',
    name: 'East reed bed',
    change: '−1',
    counts: ['−1', '', ''],
    sub: true,
    struck: 'Seen twice',
  },
  {
    id: 'l-3c',
    time: '7:05',
    name: 'Pair to confirm',
    change: '+2',
    tone: 'accent',
    counts: ['+2', '', ''],
  },
  {
    id: 'l-4',
    time: '7:45',
    name: 'Nest lost to the storm',
    change: '−3',
    counts: ['', '−1', '−2'],
  },
  {
    id: 'l-5',
    time: '8:20',
    name: 'Double-counted pair',
    change: '−2',
    tone: 'danger',
    counts: ['−2', '', ''],
    struck: 'Removed by the warden',
  },
];

/**
 * A ledger read across as well as down: column rules between the counts,
 * a signed change toned by sign, sub rows under a count (one of them
 * struck), a change to act on in the accent, and a struck row kept on the
 * record with a Badge that says why.
 */
export function TableLedgerExample({
  density = 'comfortable',
  label = 'Colony ledger',
}: {
  density?: 'comfortable' | 'compact';
  label?: string;
}) {
  return (
    <Table aria-label={label} columnRules density={density} layout="fixed">
      <TableHeader>
        <TableRow>
          <TableCell as="th" width="xs">
            Time
          </TableCell>
          <TableCell as="th">Entry</TableCell>
          <TableCell as="th" numeric width="sm">
            Change
          </TableCell>
          {kinds.map((kind) => (
            <TableCell as="th" key={kind} numeric width="sm">
              {kind}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.id}
            struck={Boolean(row.struck)}
            variant={row.sub ? 'sub' : 'default'}
          >
            <TableCell>
              <Text color="muted" variant="caption">
                {row.time}
              </Text>
            </TableCell>
            <TableCell as="th" scope="row">
              {row.sub ? (
                <>
                  {row.name}
                  {row.struck ? (
                    <>
                      {' '}
                      <Badge size="sm" tone="danger">
                        Struck · {row.struck}
                      </Badge>
                    </>
                  ) : null}
                </>
              ) : (
                <Inline align="center" gap={2} wrap={false}>
                  <GlyphTile hue={row.struck ? 'neutral' : 'teal'} size="sm">
                    <Glyph grid={24} path={feather} size={24} />
                  </GlyphTile>
                  {/* The Badge sits in the span's line of text, so the
                      row's line-through leaves it plain. */}
                  <span>
                    {row.name}
                    {row.struck ? (
                      <>
                        {' '}
                        <Badge size="sm" tone="danger">
                          Struck · {row.struck}
                        </Badge>
                      </>
                    ) : null}
                  </span>
                </Inline>
              )}
            </TableCell>
            <TableCell numeric tone={row.tone}>
              {row.change}
            </TableCell>
            {row.counts.map((count, index) => (
              <TableCell
                key={kinds[index]}
                numeric
                tone={count ? undefined : 'muted'}
              >
                {count || '·'}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
