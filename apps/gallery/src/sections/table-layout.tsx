import {
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@scalewing/react';
import { useState } from 'react';

const fieldLog = [
  {
    id: 'f-1',
    when: 'Sep 1, 2026 6:10 AM',
    kind: 'Count',
    notes:
      'Grey heron pair on the north reed bed, both adults, one carrying nesting material.',
    observer: 'Field team A',
    verified: true,
  },
  {
    id: 'f-2',
    when: 'Sep 1, 2026 7:45 AM',
    kind: 'Ringing recapture and full biometrics',
    notes: 'Kingfisher.',
    observer: 'Ringing group with a very long name',
    verified: false,
  },
  {
    id: 'f-3',
    when: 'Sep 2, 2026 5:55 AM',
    kind: 'Count',
    notes: 'Otter spraint at the river mouth.',
    observer: 'Field team B',
    verified: true,
  },
] as const;

const feeding = [
  {
    date: 'Sep 25, 2026',
    entry: 'Seed delivered to the north hide',
    amount: '+12 kg',
  },
  { date: 'Sep 28, 2026', entry: 'Feeders topped up', amount: '−3 kg' },
] as const;

/**
 * A fixed table whose columns stay put when a filter hides a row, its tall
 * rows aligned to the top; and an auto table with a date column only as
 * wide as its dates.
 */
export function TableLayoutExamples() {
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const rows = verifiedOnly ? fieldLog.filter((row) => row.verified) : fieldLog;

  return (
    <Stack gap={3}>
      <Checkbox
        checked={verifiedOnly}
        label="Verified entries only"
        onCheckedChange={setVerifiedOnly}
      />
      <Table aria-label="Field log" layout="fixed" verticalAlign="top">
        <TableHeader>
          <TableRow>
            <TableCell as="th" width="lg">
              When
            </TableCell>
            <TableCell as="th" width="md">
              Kind
            </TableCell>
            <TableCell as="th" width="xl">
              Notes
            </TableCell>
            <TableCell as="th" width="md">
              Observer
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.when}</TableCell>
              <TableCell>{row.kind}</TableCell>
              <TableCell>{row.notes}</TableCell>
              <TableCell>{row.observer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table aria-label="Feeding log" density="compact">
        <TableHeader>
          <TableRow>
            <TableCell as="th" width="min">
              Date
            </TableCell>
            <TableCell as="th">Entry</TableCell>
            <TableCell as="th" numeric>
              Amount
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feeding.map((row) => (
            <TableRow key={row.date}>
              <TableCell width="min">{row.date}</TableCell>
              <TableCell>{row.entry}</TableCell>
              <TableCell numeric>{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}
