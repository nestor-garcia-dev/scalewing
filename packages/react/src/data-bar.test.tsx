import { contrastRatio, parseHexColor } from '@scalewing/tokens';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  DataBar,
  type DataBarTone,
  dataBarTones,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from './index.js';
import { chartFill, chartFillMixes } from './css/chart-tones.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { chartMixColor, forEveryTheme } from './every-theme.test-support.js';

afterEach(() => cleanup());

describe('DataBar', () => {
  it('is decorative, its range handed to the generated CSS', () => {
    const { container } = render(
      <DataBar from={20} max={200} min={0} to={70} tone="success" />,
    );
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.tagName).toBe('SPAN');
    expect(bar.getAttribute('aria-hidden')).toBe('true');
    expect(bar.className).toBe('sw-data-bar sw-data-bar-success');
    const fill = bar.firstElementChild as HTMLElement;
    expect(fill.className).toBe('sw-data-bar-fill');
    const share = (name: string) => Number(fill.style.getPropertyValue(name));
    expect(share('--sw-data-bar-start')).toBeCloseTo(0.1);
    expect(share('--sw-data-bar-size')).toBeCloseTo(0.25);
    expect(bar.style.getPropertyValue('--sw-data-bar-zero')).toBe('');
  });

  it('stays hidden whatever is spread onto it', () => {
    const { container } = render(
      <DataBar
        {...({ 'aria-hidden': false } as object)}
        from={0}
        max={1}
        min={0}
        to={1}
      />,
    );
    expect(container.firstElementChild!.getAttribute('aria-hidden')).toBe(
      'true',
    );
  });

  it('defaults to the neutral tone', () => {
    const { container } = render(<DataBar from={0} max={1} min={0} to={1} />);
    expect(container.firstElementChild!.className).toBe(
      'sw-data-bar sw-data-bar-neutral',
    );
  });

  it('draws a zero line on a diverging domain', () => {
    const { container } = render(
      <DataBar from={0} max={40} min={-40} to={-10} tone="muted" />,
    );
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.className).toBe(
      'sw-data-bar sw-data-bar-muted sw-data-bar-diverging sw-data-bar-zero-end',
    );
    expect(bar.style.getPropertyValue('--sw-data-bar-zero')).toBe('0.5');
  });

  it('keeps a consumer class, style and ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <DataBar
        ref={ref}
        className="statement-bar"
        data-testid="bar"
        from={0}
        max={10}
        min={0}
        style={{ opacity: 0.5 }}
        to={5}
      />,
    );
    const bar = screen.getByTestId('bar');
    expect(ref.current).toBe(bar);
    expect(bar.className).toContain('statement-bar');
    expect(bar.style.opacity).toBe('0.5');
  });

  it('leaves a cell named by its figure alone', () => {
    render(
      <Table aria-label="Days">
        <TableBody>
          <TableRow>
            <TableCell as="th" scope="row">
              Tue
            </TableCell>
            <TableCell numeric>
              <DataBar from={0} max={50} min={-50} to={41.53} tone="success" />
              +$41.53
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('cell', { name: '+$41.53' })).not.toBeNull();
    expect(screen.getByRole('row', { name: 'Tue +$41.53' })).not.toBeNull();
  });

  it('throws a RangeError for an unknown tone, such as warning', () => {
    expect(() =>
      render(
        <DataBar
          from={0}
          max={1}
          min={0}
          to={1}
          tone={'warning' as DataBarTone}
        />,
      ),
    ).toThrow(
      new RangeError(
        'DataBar tone must be one of neutral, success, muted, strong, accent, danger; received warning',
      ),
    );
  });

  it('throws for a domain that is not one', () => {
    expect(() => render(<DataBar from={0} max={0} min={0} to={0} />)).toThrow(
      RangeError,
    );
  });
});

describe('DataBar CSS', () => {
  const css = generateStylesheet();

  it('lists its classes', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-data-bar',
        'sw-data-bar-fill',
        'sw-data-bar-diverging',
        'sw-data-bar-zero-start',
        'sw-data-bar-zero-end',
        ...dataBarTones.map((tone) => `sw-data-bar-${tone}`),
      ]),
    );
  });

  it('has a danger tone, last, for a shortage', () => {
    expect(dataBarTones).toEqual([
      'neutral',
      'success',
      'muted',
      'strong',
      'accent',
      'danger',
    ]);
    // The danger colour at 40 %, mixed into the surface like the others.
    expect(css).toContain(
      '.sw-data-bar-danger > .sw-data-bar-fill { background: color-mix(in srgb, var(--sw-color-danger) 40%, var(--sw-color-surface)); }',
    );
  });

  it('places the fill with logical insets from the shares', () => {
    expect(css).toContain(`.sw-data-bar-fill {
  border-radius: calc(var(--sw-radius-sm) / 2);
  inset-block: 0;
  inset-inline-start: calc(var(--sw-data-bar-start, 0) * 100%);
  position: absolute;
  width: calc(var(--sw-data-bar-size, 0) * 100%);
}`);
  });

  it('colours each tone from the semantic colours, no hex', () => {
    // Pinned as written, so a change to the shared chart tones that moved
    // a range bar's colour is caught here.
    expect(css).toContain(
      '.sw-data-bar-neutral > .sw-data-bar-fill { background: color-mix(in srgb, var(--sw-color-muted) 65%, var(--sw-color-surface)); }',
    );
    expect(css).toContain(
      '.sw-data-bar-accent > .sw-data-bar-fill { background: var(--sw-color-accent); }',
    );
    for (const tone of dataBarTones)
      expect(css).toContain(
        `.sw-data-bar-${tone} > .sw-data-bar-fill { background: ${chartFill(tone)}; }`,
      );
    const rules = css.slice(css.indexOf('.sw-data-bar {'));
    expect(rules.slice(0, rules.indexOf('@media'))).not.toMatch(
      /#[0-9a-f]{3}/i,
    );
  });

  it("squares the bar's end at zero, mirrored by logical corners", () => {
    expect(css).toContain(
      '.sw-data-bar-zero-start > .sw-data-bar-fill {\n  border-end-start-radius: 0;\n  border-start-start-radius: 0;\n}',
    );
    expect(css).toContain(
      '.sw-data-bar-zero-end > .sw-data-bar-fill {\n  border-end-end-radius: 0;\n  border-start-end-radius: 0;\n}',
    );
    expect(css).toContain('margin-inline-start: -0.5px;');
  });

  it('draws the zero line at its share, and the system colours in forced colors', () => {
    expect(css).toContain(
      'inset-inline-start: calc(var(--sw-data-bar-zero, 0) * 100%);',
    );
    expect(css).toContain(
      '@media (forced-colors: active) {\n  .sw-data-bar > .sw-data-bar-fill,\n  .sw-data-bar-diverging::before { background: CanvasText; }\n}',
    );
  });

  it('keeps every tone apart from the surface and the tones next to each other apart', () => {
    forEveryTheme((colors, label, theme) => {
      const fill = (tone: DataBarTone) =>
        chartMixColor(chartFillMixes[tone], colors, theme);
      for (const tone of dataBarTones)
        expect(
          contrastRatio(fill(tone), colors.surface),
          `${label} ${tone}`,
        ).toBeGreaterThanOrEqual(1.5);
      // Out against start and subtotal: three greys that read apart.
      expect(
        contrastRatio(fill('muted'), fill('neutral')),
        `${label} muted/neutral`,
      ).toBeGreaterThanOrEqual(1.5);
      expect(
        contrastRatio(fill('neutral'), fill('strong')),
        `${label} neutral/strong`,
      ).toBeGreaterThanOrEqual(1.5);
      // A shortage reads red beside money out's grey: its red channel
      // leads its green by more.
      const lean = (tone: DataBarTone) => {
        const [red, green] = parseHexColor(fill(tone));
        return red! - green!;
      };
      expect(lean('danger'), `${label} danger/muted`).toBeGreaterThan(
        lean('muted') + 30,
      );
      // And red on its own: its red channel leads both others.
      const [red, green, blue] = parseHexColor(fill('danger'));
      expect(
        red! - Math.max(green!, blue!),
        `${label} danger red`,
      ).toBeGreaterThan(5);
    });
  });
});
