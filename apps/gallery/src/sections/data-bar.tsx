import {
  DataBar,
  type DataBarTone,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@scalewing/react';

import { Section } from '../layout/Section.js';

type StatementLine = {
  name: string;
  from: number;
  to: number;
  tone: DataBarTone;
  figure: string;
  total?: boolean;
};

/** A colony's day as a statement: each line's bar leaves the running total. */
const colonyDay: readonly StatementLine[] = [
  { name: 'Counted at dawn', from: 0, to: 120, tone: 'neutral', figure: '120' },
  { name: 'Flew in', from: 120, to: 154, tone: 'success', figure: '+34' },
  { name: 'Flew off', from: 154, to: 136, tone: 'muted', figure: '−18' },
  {
    name: 'Expected at dusk',
    from: 0,
    to: 136,
    tone: 'strong',
    figure: '136',
    total: true,
  },
  { name: 'Counted at dusk', from: 0, to: 133, tone: 'accent', figure: '133' },
];

/**
 * Each site's change since yesterday, on one domain either side of zero;
 * the old quarry's runs past it and is clamped to its end.
 */
const siteChanges = [
  { site: 'North reed bed', change: 9 },
  { site: 'East shore', change: -6 },
  { site: 'Island', change: 2 },
  { site: 'Weir', change: -1 },
  { site: 'Old quarry', change: 14 },
] as const;

function signed(value: number): string {
  if (value === 0) return '0';
  return `${value > 0 ? '+' : '−'}${Math.abs(value)}`;
}

function ColonyStatement() {
  return (
    <Table aria-label="How the colony moved" columnRules>
      <TableHeader>
        <TableRow>
          <TableCell as="th">The colony</TableCell>
          <TableCell />
          <TableCell as="th" numeric>
            Birds
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {colonyDay.map((line) => (
          <TableRow key={line.name} variant={line.total ? 'total' : 'default'}>
            <TableCell as="th" scope="row">
              {line.name}
            </TableCell>
            <TableCell>
              <DataBar
                from={line.from}
                max={160}
                min={0}
                to={line.to}
                tone={line.tone}
              />
            </TableCell>
            <TableCell numeric>{line.figure}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function SiteChanges() {
  return (
    <Table aria-label="Change since yesterday">
      <TableHeader>
        <TableRow>
          <TableCell as="th">Site</TableCell>
          <TableCell as="th" numeric>
            Change
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {siteChanges.map((row) => (
          <TableRow key={row.site}>
            <TableCell>{row.site}</TableCell>
            <TableCell numeric>
              <Grid align="center" columns={2} gap={2}>
                <DataBar
                  from={0}
                  max={10}
                  min={-10}
                  to={row.change}
                  tone={row.change >= 0 ? 'success' : 'muted'}
                />
                <span>{signed(row.change)}</span>
              </Grid>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function DataBarSection() {
  return (
    <Section
      id="data-bar"
      purpose="DataBar is a horizontal range bar for a table cell or a list row: a bar from from to to on a track whose domain runs from min to max, such as where a statement's line leaves the running total. It is decorative and hidden from assistive technology, so the figure stays the cell's text beside it. tone says what the bar is: neutral for where it started, success for what came in, muted for what went out (never danger: an outflow is not an error), strong for a subtotal and accent for what was counted. A domain from below zero to above it draws a zero line, so a column of differences diverges around it. The bar's ends follow the writing direction; forced colors draw it in the system text color."
      title="DataBar"
      usage={`<TableCell>
  <DataBar from={120} to={154} min={0} max={160} tone="success" />
</TableCell>
<TableCell numeric>+34</TableCell>

<DataBar from={0} to={-6} min={-10} max={10} tone="muted" />`}
    >
      <Stack gap={4}>
        <Text variant="label">
          A statement, each bar from the running total
        </Text>
        <ColonyStatement />
        <Text variant="label">A column either side of zero</Text>
        <SiteChanges />
        <Text variant="caption" color="muted">
          The bar never carries the figure: keep the value in the cell. Values
          past the domain are clamped to it.
        </Text>
      </Stack>
    </Section>
  );
}
