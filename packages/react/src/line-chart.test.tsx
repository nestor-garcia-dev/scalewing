import { cleanup, render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LineChart, type LineChartProps, lineChartCurves } from './index.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const points = [
  { x: '2026-10-05', y: 4200 },
  { x: '2026-10-06', y: 6100 },
  { x: '2026-10-07', y: 2300 },
  { x: '2026-10-07', y: 2100 },
  { x: '2026-10-08', y: 3000 },
];
const short = (date: string) => `Oct ${Number(date.slice(8))}`;

function chart(props: Partial<LineChartProps> = {}) {
  return render(
    <LineChart
      formatDate={short}
      highlight={{ from: '2026-10-07', to: '2026-10-08' }}
      label="Birds roosting"
      markers={[{ x: '2026-10-07', label: 'Flock of 3800', tone: 'warning' }]}
      markersLabel="A flock left"
      points={points}
      valueLabel="Roosting"
      {...props}
    />,
  );
}

function refusal(props: Partial<LineChartProps>): unknown {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  try {
    chart(props);
    return null;
  } catch (error) {
    return error;
  }
}

describe('LineChart', () => {
  it('carries every date, value and marker in a hidden table', () => {
    chart();
    const table = screen.getByRole('table', { name: 'Birds roosting' });
    // Hidden in a box: a table is never narrower than its contents.
    expect(table.parentElement?.className).toBe('sw-sr-only');
    expect(table.getAttribute('class')).toBeNull();
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Roosting', 'A flock left']);
    const rows = within(table).getAllByRole('row').slice(1);
    expect(rows.map((row) => row.textContent)).toEqual([
      'Oct 54200',
      'Oct 66100',
      'Oct 72300',
      // The day's markers belong to its last point.
      'Oct 72100Flock of 3800',
      'Oct 83000',
    ]);
    expect(rows.map((row) => row.getAttribute('aria-current'))).toEqual([
      null,
      null,
      'true',
      'true',
      'true',
    ]);
  });

  it('hides its drawing and draws the line, area, marker and last value in their tones', () => {
    const { container } = chart({ area: true, tone: 'success', curve: 'step' });
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    const line = container.querySelector('.sw-chart-line')!;
    expect(line.parentElement?.getAttribute('class')).toBe(
      'sw-chart-tone-success',
    );
    expect(container.querySelector('.sw-chart-area')).not.toBeNull();
    expect(container.querySelector('.sw-chart-end-label')?.textContent).toBe(
      '3000',
    );
    const marker = container.querySelector('.sw-chart-marker')!;
    expect(marker.parentElement?.getAttribute('class')).toBe(
      'sw-chart-tone-warning',
    );
    expect(container.querySelector('.sw-chart-marker-label')?.textContent).toBe(
      'Flock of 3800',
    );
    expect(container.querySelector('.sw-chart-highlight')).not.toBeNull();
    // A step line's every segment is level or upright.
    const vertices = line
      .getAttribute('points')!
      .split(' ')
      .map((pair) => pair.split(',').map(Number));
    expect(vertices).toHaveLength(points.length * 2 - 1);
  });

  it('labels the first and last dates by default, and writes plain values', () => {
    const { container } = render(
      <LineChart
        label="Plain"
        points={[
          { x: '2026-10-01', y: 1.25 },
          { x: '2026-10-09', y: 2 },
        ]}
      />,
    );
    expect(
      [...container.querySelectorAll('.sw-chart-category')].map(
        (label) => label.textContent,
      ),
    ).toEqual(['2026-10-01', '2026-10-09']);
    expect(screen.getByRole('table').textContent).toContain('1.3');
    expect(
      within(screen.getByRole('table')).getAllByRole('columnheader')[0]!
        .textContent,
    ).toBe('Plain');
  });

  it('leaves the last value out when asked, and keeps a lone point as its dot', () => {
    const { container } = render(
      <LineChart endLabel={false} label="One" points={[points[0]!]} />,
    );
    expect(container.querySelector('.sw-chart-end-label')).toBeNull();
    expect(container.querySelector('.sw-chart-dot')).not.toBeNull();
  });

  it("passes a consumer's class, attributes and ref to its box", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <LineChart
        ref={ref}
        className="extra"
        data-testid="chart"
        label="Empty"
        points={[]}
      />,
    );
    expect(ref.current).toBe(screen.getByTestId('chart'));
    expect(ref.current?.className).toBe('sw-chart extra');
  });

  it('refuses what it cannot draw, saying what', () => {
    const cases: [Partial<LineChartProps>, RegExp][] = [
      [{ label: '' }, /^LineChart label must not be empty/],
      [{ valueLabel: ' ' }, /valueLabel must not be empty/],
      [{ points: [{ x: '2026-10-32', y: 1 }] }, /point x must be a YYYY-MM-DD/],
      [
        { points: [{ x: '2026-10-05', y: Number.POSITIVE_INFINITY }] },
        /point y must be a finite number/,
      ],
      [
        {
          points: [
            { x: '2026-10-06', y: 1 },
            { x: '2026-10-05', y: 1 },
          ],
        },
        /points must be in date order/,
      ],
      [{ curve: 'smooth' as 'linear' }, /curve must be one of linear, step/],
      [{ tone: 'blue' as 'accent' }, /^LineChart tone must be one of/],
      [
        { markers: [{ x: '2026-10-09', label: 'Late', tone: 'danger' }] },
        /marker x must be one of the points' dates/,
      ],
      [
        { markers: [{ x: '2026-10-05', label: '', tone: 'danger' }] },
        /marker label must not be empty/,
      ],
      [
        {
          markers: [
            { x: '2026-10-05', label: 'Hue', tone: 'rose' as 'danger' },
          ],
        },
        /marker tone must be one of/,
      ],
      [{ markersLabel: undefined }, /markersLabel must not be empty/],
      [{ ticks: ['2026-10-01'] }, /tick must fall within the points' dates/],
      [
        { highlight: { from: '2026-10-08', to: '2026-10-05' } },
        /highlight must not end before it starts/,
      ],
    ];
    for (const [props, message] of cases) {
      const error = refusal(props);
      expect(error, JSON.stringify(props)).toBeInstanceOf(RangeError);
      expect((error as Error).message).toMatch(message);
    }
  });

  it('exports its curves', () => {
    expect(lineChartCurves).toEqual(['linear', 'step']);
  });
});

describe('LineChart CSS', () => {
  const css = generateStylesheet();

  it('tints the area from the stroke and draws markers from their tone', () => {
    expect(css).toContain(
      '.sw-chart-area {\n  fill: color-mix(in srgb, var(--sw-chart-stroke) 12%, transparent);\n}',
    );
    expect(css).toContain('.sw-chart-marker { fill: var(--sw-chart-stroke); }');
    expect(css).toContain(
      '.sw-chart-marker-label {\n  fill: var(--sw-chart-ink);',
    );
    expect(css).toContain(
      '@media (forced-colors: active) {\n  .sw-chart-area { fill: none; }\n  .sw-chart-marker,\n  .sw-chart-marker-label { fill: CanvasText; }\n}',
    );
    for (const name of [
      'sw-chart-area',
      'sw-chart-marker',
      'sw-chart-marker-label',
    ])
      expect(utilityClassCatalog()).toContain(name);
  });
});
