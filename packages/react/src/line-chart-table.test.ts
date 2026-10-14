import { describe, expect, it } from 'vitest';

import { closingIndexes } from './line-chart-points.js';
import { lineChartRows } from './line-chart-table.js';

const points = [
  { x: '2026-10-06', y: 6100 },
  { x: '2026-10-07', y: 2300 },
  { x: '2026-10-07', y: 2100 },
  { x: '2026-10-08', y: 3000 },
];

describe('line chart table rows', () => {
  it("finds each date's closing point", () => {
    expect(closingIndexes(points.map((p) => p.x))).toEqual(
      new Map([
        ['2026-10-06', 0],
        ['2026-10-07', 2],
        ['2026-10-08', 3],
      ]),
    );
  });

  it("puts a date's markers in its closing row and marks the boxed rows current", () => {
    const rows = lineChartRows({
      points,
      markers: [
        { x: '2026-10-07', label: 'Flock of 3800', tone: 'warning' },
        { x: '2026-10-07', label: 'Ringing', tone: 'accent' },
      ],
      highlight: { from: '2026-10-07', to: '2026-10-07' },
      formatDate: (date) => date.slice(5),
      formatValue: String,
    });
    expect(rows.map((row) => [row.header, ...row.cells, row.current])).toEqual([
      ['10-06', '6100', '', false],
      ['10-07', '2300', '', true],
      ['10-07', '2100', 'Flock of 3800, Ringing', true],
      ['10-08', '3000', '', false],
    ]);
    expect(new Set(rows.map((row) => row.key)).size).toBe(4);
  });

  it('has no marker column without markers', () => {
    const rows = lineChartRows({
      points,
      markers: [],
      highlight: undefined,
      formatDate: (date) => date,
      formatValue: String,
    });
    expect(rows[0]!.cells).toEqual(['6100']);
    expect(rows.every((row) => !row.current)).toBe(true);
  });
});
