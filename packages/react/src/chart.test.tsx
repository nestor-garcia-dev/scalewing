import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { BarChart } from './components/BarChart.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

afterEach(() => {
  cleanup();
});

describe('BarChart', () => {
  it('renders labeled horizontal bars, values, and a 0-max axis', () => {
    render(
      <ThemeProvider colorScheme="light">
        <BarChart
          aria-label="Factor contributions"
          items={[
            { label: 'Strength of schedule', value: 1 },
            { label: 'Injury', value: -1.5 },
          ]}
          max={6}
        />
      </ThemeProvider>,
    );

    const list = screen.getByRole('list', { name: 'Factor contributions' });
    expect(list.className).toContain('sw-bar-chart-plot');
    expect(list.parentElement?.className).toContain('sw-bar-chart');

    const schedule = screen.getByText('Strength of schedule');
    const scheduleFill = schedule.nextElementSibling?.firstElementChild;
    expect(scheduleFill?.className).toContain('sw-bar-chart-fill');
    expect(scheduleFill).not.toBeNull();
    expect(
      (scheduleFill as HTMLElement).style.getPropertyValue('--sw-bar-fill'),
    ).toBe(String(1 / 6));

    const injuryFill = screen.getByText('Injury').nextElementSibling
      ?.firstElementChild as HTMLElement;
    expect(injuryFill.className).toContain('sw-bar-chart-fill-negative');
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('-1.5')).toBeTruthy();
    expect(screen.getByText('6')).toBeTruthy();
  });
});

describe('BarChart formatValue and diverging', () => {
  const money = (value: number) =>
    `${value < 0 ? '−' : ''}$${Math.abs(value).toFixed(2)}`;

  it('writes the axis and the unlabelled values with formatValue', () => {
    render(
      <BarChart
        aria-label="Feed bought"
        formatValue={money}
        items={[
          { label: 'Mon', value: 0.25 },
          { label: 'Tue', value: 0.15, valueLabel: 'fifteen cents' },
        ]}
      />,
    );
    // The value without a label, and the axis from 0 to the scale's top.
    expect(
      screen.getByText('$0.25', { selector: '.sw-bar-chart-value' }),
    ).toBeTruthy();
    expect(screen.getByText('fifteen cents')).toBeTruthy();
    const axis = document.querySelector('.sw-bar-chart-axis-track');
    expect([...(axis?.children ?? [])].map((tick) => tick.textContent)).toEqual(
      ['$0.00', '$0.25'],
    );
    expect(document.querySelector('.sw-bar-chart')?.className).toBe(
      'sw-bar-chart',
    );
  });

  it('puts zero in the middle and reads the axis from minus max to max', () => {
    render(
      <BarChart
        aria-label="Drawer variance"
        diverging
        formatValue={money}
        items={[
          { label: 'Oct 1', value: 0.15 },
          { label: 'Oct 2', value: -0.25 },
        ]}
      />,
    );
    const chart = screen.getByRole('list', { name: 'Drawer variance' })
      .parentElement as HTMLElement;
    expect(chart.className).toBe('sw-bar-chart sw-bar-chart-diverging');
    const axis = chart.querySelector('.sw-bar-chart-axis-track');
    expect([...(axis?.children ?? [])].map((tick) => tick.textContent)).toEqual(
      ['−$0.25', '$0.00', '$0.25'],
    );
    const short = screen.getByText('Oct 2').nextElementSibling
      ?.firstElementChild as HTMLElement;
    expect(short.className).toBe(
      'sw-bar-chart-fill sw-bar-chart-fill-negative',
    );
    expect(short.style.getPropertyValue('--sw-bar-fill')).toBe('1');
    const over = screen.getByText('Oct 1').nextElementSibling
      ?.firstElementChild as HTMLElement;
    expect(Number(over.style.getPropertyValue('--sw-bar-fill'))).toBeCloseTo(
      0.6,
    );
  });

  it('generates the centre hairline and the half-track bars', async () => {
    const { generateStylesheet, utilityClassCatalog } =
      await import('./css/stylesheet.js');
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-bar-chart-diverging .sw-bar-chart-track::before {\n  background: var(--sw-color-border);',
    );
    expect(css).toContain(
      '  margin-inline-start: 50%;\n  width: calc(var(--sw-bar-fill, 0) * 50%);',
    );
    expect(css).toContain(
      'margin-inline-start: calc(50% - var(--sw-bar-fill, 0) * 50%);',
    );
    expect(utilityClassCatalog()).toContain('sw-bar-chart-diverging');
  });
});
