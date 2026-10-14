import { cleanup, render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ColumnChart,
  type ColumnChartProps,
  type ColumnChartSeries,
  columnChartModes,
} from './index.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const weeks = ['Jul 14', 'Jul 21', 'Jul 28'];
const series: ColumnChartSeries[] = [
  { id: 'herons', label: 'Herons', tone: 'blue', values: [3, -5, 52] },
  { id: 'egrets', label: 'Egrets', tone: 'purple', values: [0, 3, -8] },
];
const signed = (value: number) =>
  value === 0 ? '0' : `${value > 0 ? '+' : '−'}${Math.abs(value)}`;

function chart(props: Partial<ColumnChartProps> = {}) {
  return render(
    <ColumnChart
      callouts={[{ index: 2, text: 'Colony arrived +52', tone: 'blue' }]}
      categories={weeks}
      formatValue={signed}
      highlight={2}
      label="Change in birds"
      line={{ label: 'Running total', values: [3, 1, 45] }}
      series={series}
      {...props}
    />,
  );
}

function refusal(props: Partial<ColumnChartProps>): unknown {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  try {
    chart(props);
    return null;
  } catch (error) {
    return error;
  }
}

describe('ColumnChart', () => {
  it('carries every figure in a hidden table named by its label', () => {
    chart();
    const table = screen.getByRole('table', { name: 'Change in birds' });
    // Hidden in a box: a table is never narrower than its contents.
    expect(table.parentElement?.className).toBe('sw-sr-only');
    expect(table.getAttribute('class')).toBeNull();
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Herons', 'Egrets', 'Running total']);
    const rows = within(table).getAllByRole('row').slice(1);
    expect(rows.map((row) => row.textContent)).toEqual([
      'Jul 14+30+3',
      'Jul 21−5+3+1',
      'Jul 28+52−8+45',
    ]);
    expect(within(rows[0]!).getByRole('rowheader').textContent).toBe('Jul 14');
    // The boxed period's row is the current one.
    expect(rows[2]!.getAttribute('aria-current')).toBe('true');
    expect(rows[1]!.hasAttribute('aria-current')).toBe(false);
  });

  it('hides its drawing, and keeps the callouts a list', () => {
    const { container } = chart();
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(svg.getAttribute('class')).toBe('sw-chart-svg');
    const list = screen.getByRole('list');
    // Drawn above the plot on a wide chart, so the list is for screen readers.
    expect(list.className).toBe('sw-chart-callouts sw-sr-only');
    expect(within(list).getByRole('listitem').textContent).toBe(
      'Colony arrived +52',
    );
    expect(container.querySelector('.sw-chart-callout-text')?.textContent).toBe(
      'Colony arrived +52',
    );
  });

  it('draws each column in its series tone and the line, box and last value', () => {
    const { container } = chart();
    const columns = [...container.querySelectorAll('rect.sw-chart-column')];
    expect(columns.map((c) => c.getAttribute('class'))).toEqual([
      'sw-chart-column sw-chart-tone-blue',
      'sw-chart-column sw-chart-tone-blue',
      'sw-chart-column sw-chart-tone-purple',
      'sw-chart-column sw-chart-tone-blue',
      'sw-chart-column sw-chart-tone-purple',
    ]);
    expect(container.querySelector('.sw-chart-highlight')).not.toBeNull();
    expect(container.querySelector('.sw-chart-line')).not.toBeNull();
    expect(container.querySelector('.sw-chart-end-label')?.textContent).toBe(
      '+45',
    );
    expect(
      container
        .querySelector('.sw-chart-line')
        ?.parentElement?.getAttribute('class'),
    ).toBe('sw-chart-tone-accent');
  });

  it('leaves the last value out when the line asks', () => {
    const { container } = chart({
      line: { label: 'Running total', values: [3, 1, 45], endLabel: false },
    });
    expect(container.querySelector('.sw-chart-end-label')).toBeNull();
    expect(container.querySelector('.sw-chart-dot')).toBeNull();
  });

  it('draws a line of one point as its dot', () => {
    const { container } = render(
      <ColumnChart
        categories={['Jul 14']}
        label="One week"
        line={{ label: 'Total', values: [4], endLabel: false }}
        series={[{ id: 'a', label: 'A', tone: 'blue', values: [4] }]}
      />,
    );
    expect(container.querySelector('.sw-chart-dot')).not.toBeNull();
    expect(container.querySelector('.sw-chart-end-label')).toBeNull();
  });

  it('shows the callouts under a compact chart', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 330,
    } as DOMRect);
    const { container } = chart();
    expect(screen.getByRole('list').className).toBe('sw-chart-callouts');
    expect(container.querySelector('.sw-chart-callout-text')).toBeNull();
    const item = screen.getByRole('listitem');
    expect(item.className).toBe('sw-chart-callout sw-chart-tone-blue');
    expect(item.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('svg')?.getAttribute('width')).toBe('330');
  });

  it('writes plain numbers by default and the axes with formatTick', () => {
    const { container } = render(
      <ColumnChart
        categories={weeks}
        formatTick={(value) => `${value} b`}
        label="Plain"
        series={[{ id: 'a', label: 'A', tone: 'green', values: [1.25, 2, 3] }]}
      />,
    );
    expect(screen.getByRole('table').textContent).toContain('1.3');
    const ticks = [...container.querySelectorAll('.sw-chart-tick')].map(
      (t) => t.textContent,
    );
    expect(ticks.at(-1)).toMatch(/ b$/);
    expect(screen.queryByRole('list')).toBeNull();
  });

  it("passes a consumer's class, attributes and ref to its box", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <ColumnChart
        ref={ref}
        categories={[]}
        className="extra"
        data-testid="chart"
        label="Empty"
        series={[]}
      />,
    );
    expect(ref.current).toBe(screen.getByTestId('chart'));
    expect(ref.current?.className).toBe('sw-chart extra');
    expect(container.querySelectorAll('.sw-chart-column')).toHaveLength(0);
    // Nothing to head: no header row of empty cells.
    const table = screen.getByRole('table', { name: 'Empty' });
    expect(table.querySelector('thead')).toBeNull();
  });

  it('refuses what it cannot draw', () => {
    const one = series[0]!;
    for (const props of [
      { label: ' ' },
      { categories: ['Jul 14', '', 'Jul 28'] },
      { mode: 'side' as 'stacked' },
      { series: [{ ...one, values: [1, 2] }] },
      { series: [{ ...one, values: [1, Number.NaN, 2] }] },
      { series: [one, { ...one, label: 'Again' }] },
      { series: [{ ...one, tone: 'red' as 'blue' }] },
      { series: [{ ...one, id: '' }] },
      { line: { label: 'Total', values: [1, 2] } },
      { line: { label: '', values: [1, 2, 3] } },
      { highlight: 3 },
      { highlight: 1.5 },
      { callouts: [{ index: -1, text: 'Before' }] },
      { callouts: [{ index: 0, text: '' }] },
      { callouts: [{ index: 0, text: 'Hue', tone: 'accent' as 'blue' }] },
    ] satisfies Partial<ColumnChartProps>[])
      expect(refusal(props), JSON.stringify(props)).toBeInstanceOf(RangeError);
  });

  it('exports its modes', () => {
    expect(columnChartModes).toEqual(['stacked', 'grouped']);
  });
});
