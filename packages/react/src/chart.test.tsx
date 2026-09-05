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
