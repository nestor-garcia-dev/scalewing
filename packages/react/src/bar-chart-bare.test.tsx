import { contrastRatio } from '@scalewing/tokens';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BarChart, barChartAppearances } from './components/BarChart.js';
import { barChartTones } from './css/css-bar-chart.js';
import { chartStrokeColors } from './css/chart-tones.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { forEveryTheme } from './every-theme.test-support.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const nights = [
  { label: 'Mon', value: 4, tone: 'neutral' as const },
  { label: 'Fri', value: 9 },
];

describe('BarChart neutral tone and bare appearance', () => {
  it('draws a neutral bar in the muted grey', () => {
    render(<BarChart aria-label="Owls heard" items={nights} />);
    const fill = screen
      .getByText('Mon')
      .parentElement!.querySelector('.sw-bar-chart-fill');
    expect(fill?.className).toBe('sw-bar-chart-fill sw-bar-chart-fill-neutral');
    expect(generateStylesheet()).toContain(
      '.sw-bar-chart-fill-neutral { background: var(--sw-color-muted); }',
    );
  });

  it('draws the track and the axis by default and neither when bare', () => {
    const { container, rerender } = render(
      <BarChart aria-label="Owls heard" items={nights} />,
    );
    expect(container.querySelector('.sw-bar-chart-axis')).not.toBeNull();
    rerender(
      <BarChart appearance="bare" aria-label="Owls heard" items={nights} />,
    );
    const chart = container.querySelector('.sw-bar-chart')!;
    expect(chart.className).toBe('sw-bar-chart sw-bar-chart-bare');
    expect(container.querySelector('.sw-bar-chart-axis')).toBeNull();
    // The figures stay in the list, read with their labels.
    expect(screen.getByRole('list', { name: 'Owls heard' }).textContent).toBe(
      'Mon4Fri9',
    );
    expect(barChartAppearances).toEqual(['track', 'bare']);
    expect(generateStylesheet()).toContain(
      '.sw-bar-chart-bare .sw-bar-chart-track {\n  background: transparent;\n  border-color: transparent;\n}',
    );
    expect(utilityClassCatalog()).toContain('sw-bar-chart-bare');
  });

  it('hides the edge in forced colours and keeps a diverging zero line', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '@media (forced-colors: active) {\n  .sw-bar-chart-bare .sw-bar-chart-track { border-color: Canvas; }\n}',
    );
    // Nothing under bare touches the zero hairline drawn before the track.
    expect(css).not.toMatch(/\.sw-bar-chart-bare[^{]*::before/);
    const { container } = render(
      <BarChart
        appearance="bare"
        aria-label="Owls against last year"
        diverging
        items={[
          { label: 'Fri', value: 3 },
          { label: 'Mon', value: -2 },
        ]}
      />,
    );
    expect(container.querySelector('.sw-bar-chart')?.className).toBe(
      'sw-bar-chart sw-bar-chart-diverging sw-bar-chart-bare',
    );
  });

  it('refuses an unknown appearance', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <BarChart
          appearance={'flat' as never}
          aria-label="Owls heard"
          items={nights}
        />,
      ),
    ).toThrow('Unknown BarChart appearance: flat');
  });

  it('keeps every bare bar at 3:1 on the surface it sits on', () => {
    forEveryTheme((colors, label) => {
      for (const tone of barChartTones)
        expect(
          contrastRatio(
            colors[chartStrokeColors[tone].semantic],
            colors.surface,
          ),
          `${label} ${tone}`,
        ).toBeGreaterThanOrEqual(3);
    });
  });
});
