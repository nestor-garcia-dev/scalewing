import { cleanup, render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ChartLegend,
  type ChartLegendItem,
  chartFillTones,
  chartLegendSwatches,
  chartStrokeTones,
} from './index.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const items: ChartLegendItem[] = [
  { label: 'Herons', swatch: 'bar', tone: 'blue' },
  { label: 'Came in', swatch: 'bar', tone: 'success' },
  { label: 'Running total', swatch: 'line', tone: 'accent' },
  { label: 'Ringing day', swatch: 'marker', tone: 'danger' },
  { label: 'This week', swatch: 'box', tone: 'accent' },
];

function refusal(item: ChartLegendItem): unknown {
  const consoleError = vi
    .spyOn(console, 'error')
    .mockImplementation(() => undefined);
  try {
    render(<ChartLegend items={[item]} />);
    return null;
  } catch (error) {
    return error;
  } finally {
    consoleError.mockRestore();
  }
}

describe('ChartLegend', () => {
  it('is a named list whose items read as their words', () => {
    render(<ChartLegend aria-label="Key" items={items} />);
    const list = screen.getByRole('list', { name: 'Key' });
    expect(list.tagName).toBe('UL');
    // Kept explicitly: a list without markers loses its role in Safari.
    expect(list.getAttribute('role')).toBe('list');
    const entries = within(list).getAllByRole('listitem');
    expect(entries.map((entry) => entry.textContent)).toEqual(
      items.map((item) => item.label),
    );
    expect(entries[0]).toHaveProperty(
      'className',
      'sw-chart-legend-item sw-chart-tone-blue',
    );
  });

  it('draws each swatch as a hidden mark of its kind in its tone', () => {
    render(<ChartLegend aria-label="Key" items={items} />);
    const swatches = screen
      .getAllByRole('listitem')
      .map((entry) => entry.firstElementChild as HTMLElement);
    for (const swatch of swatches)
      expect(swatch.getAttribute('aria-hidden')).toBe('true');
    expect(swatches.map((swatch) => swatch.className)).toEqual([
      'sw-chart-legend-swatch sw-chart-legend-bar',
      'sw-chart-legend-swatch sw-chart-legend-bar',
      'sw-chart-legend-swatch sw-chart-legend-line',
      'sw-chart-legend-swatch sw-chart-legend-marker',
      'sw-chart-legend-swatch sw-chart-legend-box',
    ]);
    expect(
      swatches.map((swatch) => swatch.parentElement?.className.split(' ')[1]),
    ).toEqual([
      'sw-chart-tone-blue',
      'sw-chart-tone-success',
      'sw-chart-tone-accent',
      'sw-chart-tone-danger',
      'sw-chart-tone-accent',
    ]);
  });

  it("passes a consumer's class, attributes and ref to the list", () => {
    const ref = createRef<HTMLUListElement>();
    render(
      <ChartLegend
        ref={ref}
        aria-label="Key"
        className="extra"
        data-testid="key"
        items={[]}
      />,
    );
    expect(ref.current).toBe(screen.getByTestId('key'));
    expect(ref.current?.className).toBe('sw-chart-legend extra');
    expect(ref.current?.children).toHaveLength(0);
  });

  it('refuses an item with no words', () => {
    expect(refusal({ label: '', swatch: 'bar', tone: 'blue' })).toBeInstanceOf(
      RangeError,
    );
    expect(
      refusal({ label: '  ', swatch: 'line', tone: 'accent' }),
    ).toBeInstanceOf(RangeError);
  });

  it('refuses a tone its swatch cannot draw, and an unknown swatch', () => {
    // A fill tone on a stroke, and a stroke tone on a bar.
    expect(
      refusal({
        label: 'Herons',
        swatch: 'line',
        tone: 'blue' as 'accent',
      }),
    ).toBeInstanceOf(RangeError);
    expect(
      refusal({
        label: 'Short',
        swatch: 'bar',
        tone: 'warning' as 'accent',
      }),
    ).toBeInstanceOf(RangeError);
    expect(
      refusal({
        label: 'Herons',
        swatch: 'dot' as 'bar',
        tone: 'blue',
      }),
    ).toBeInstanceOf(RangeError);
  });

  it('exports its swatches and the tones each takes', () => {
    expect(chartLegendSwatches).toEqual(['bar', 'line', 'marker', 'box']);
    expect(chartFillTones).toContain('purple');
    expect(chartStrokeTones).toContain('warning');
  });
});

describe('ChartLegend CSS', () => {
  const css = generateStylesheet();

  it('lays the items out in a wrapping row in the caption type', () => {
    expect(css).toContain('.sw-chart-legend {\n  color: var(--sw-color-text);');
    expect(css).toContain(
      '  flex-wrap: wrap;\n  font-family: var(--sw-font-sans);\n  font-size: 13px;',
    );
    for (const name of [
      'sw-chart-legend',
      'sw-chart-legend-item',
      'sw-chart-legend-swatch',
      ...chartLegendSwatches.map((swatch) => `sw-chart-legend-${swatch}`),
    ])
      expect(utilityClassCatalog()).toContain(name);
  });

  it('centres each swatch on the first line of its words', () => {
    expect(css).toContain(
      '.sw-chart-legend-item {\n  align-items: flex-start;',
    );
    // A 12 px swatch and the 2 px line on the caption's 18 px line.
    expect(css).toContain(
      '  flex: none;\n  /* Centred on the first line of the words, however many lines they wrap to. */\n  margin-block-start: calc((18px - var(--sw-space-3)) / 2);',
    );
    expect(css).toContain(
      '.sw-chart-legend-line {\n  margin-block-start: calc((18px - 2px) / 2);\n}',
    );
  });

  it('colours each swatch from its role, with no hex', () => {
    const rules = css.slice(
      css.indexOf('.sw-chart-legend {'),
      css.indexOf('@media (forced-colors: active) {\n  .sw-chart-legend-bar'),
    );
    expect(rules).not.toMatch(/#[0-9a-f]{3}/i);
    expect(css).toContain(
      '.sw-chart-legend-bar {\n  background: var(--sw-chart-fill);',
    );
    expect(css).toContain(
      '.sw-chart-legend-line {\n  background: var(--sw-chart-stroke);',
    );
    expect(css).toContain(
      '.sw-chart-legend-marker {\n  background: var(--sw-chart-stroke);\n  clip-path: polygon(0 0, 100% 0, 50% 100%);',
    );
    expect(css).toContain(
      '.sw-chart-legend-box {\n  border: 1px dashed var(--sw-chart-stroke);',
    );
  });

  it('draws every swatch in the system text colour in forced colours', () => {
    expect(css).toContain(
      '@media (forced-colors: active) {\n  .sw-chart-legend-bar,\n  .sw-chart-legend-line,\n  .sw-chart-legend-marker { background: CanvasText; }\n  .sw-chart-legend-box { border-color: CanvasText; }\n}',
    );
  });
});
