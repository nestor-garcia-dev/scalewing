import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { contrastRatio, parseHexColor } from '@scalewing/tokens';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TabPanel, Tabs } from './components/Tabs.js';
import { stuckCanvasShare } from './css/css-tabs.js';
import { stackingOrder } from './css/stacking.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { forEveryTheme } from './every-theme.test-support.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

afterEach(() => {
  cleanup();
});

const habitats = [
  { id: 'forest', label: 'Forest' },
  { id: 'ocean', label: 'Ocean' },
];

/** The CSS `saturate()` filter matrix on one sRGB color, clamped. */
function saturate([red, green, blue]: number[], amount: number): number[] {
  const clamp = (value: number) => Math.max(0, Math.min(255, value));
  return [
    clamp(
      (0.213 + 0.787 * amount) * red +
        (0.715 - 0.715 * amount) * green +
        (0.072 - 0.072 * amount) * blue,
    ),
    clamp(
      (0.213 - 0.213 * amount) * red +
        (0.715 + 0.285 * amount) * green +
        (0.072 - 0.072 * amount) * blue,
    ),
    clamp(
      (0.213 - 0.213 * amount) * red +
        (0.715 - 0.715 * amount) * green +
        (0.072 + 0.928 * amount) * blue,
    ),
  ];
}

/** The canvas at `share` over a solid block of `under`, as the stuck strip paints it. */
function stripOver(
  canvas: string,
  under: string,
  share: number,
  saturation: number,
): string {
  const behind = saturate([...parseHexColor(under)], saturation);
  return `#${[...parseHexColor(canvas)]
    .map((channel, index) =>
      Math.round(channel * share + (behind[index] ?? 0) * (1 - share))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

/** The body of the first rule for `selector` after `from` in the stylesheet. */
function ruleBody(css: string, selector: string, from = 0): string {
  const start = css.indexOf(`${selector} {`, from);
  expect(start).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf('}', start));
}

describe('Tabs', () => {
  it('exposes a tablist whose panels point at their tabs and hide when not current', () => {
    const onChange = vi.fn();

    render(
      <ThemeProvider colorScheme="light">
        <Tabs
          aria-label="Habitats"
          id="habitats"
          items={[
            { id: 'forest', label: 'Forest' },
            { id: 'ocean', label: 'Ocean' },
          ]}
          onChange={onChange}
          value="forest"
        />
        <TabPanel id="forest" tabsId="habitats" value="forest">
          Red fox
        </TabPanel>
        <TabPanel id="ocean" tabsId="habitats" value="forest">
          Sea turtle
        </TabPanel>
      </ThemeProvider>,
    );

    const list = screen.getByRole('tablist', { name: 'Habitats' });
    expect(list.className).toContain('sw-tabs');
    const forest = screen.getByRole('tab', { name: 'Forest' });
    const ocean = screen.getByRole('tab', { name: 'Ocean' });
    expect(forest.getAttribute('aria-selected')).toBe('true');
    expect(forest.className).toContain('sw-tab-selected');
    expect(forest.tabIndex).toBe(0);
    expect(ocean.tabIndex).toBe(-1);
    expect(forest.getAttribute('aria-controls')).toBe('habitats-panel-forest');

    const panel = screen.getByRole('tabpanel');
    expect(panel.id).toBe('habitats-panel-forest');
    expect(panel.getAttribute('aria-labelledby')).toBe('habitats-tab-forest');
    expect(panel.textContent).toBe('Red fox');
    expect(screen.getByText('Sea turtle').hidden).toBe(true);

    ocean.click();
    expect(onChange).toHaveBeenCalledWith('ocean');
    forest.click();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('moves and selects with the arrow keys, Home and End', () => {
    const onChange = vi.fn();
    const items = [
      { id: 'forest', label: 'Forest' },
      { id: 'ocean', label: 'Ocean' },
      { id: 'desert', label: 'Desert' },
    ];

    render(
      <ThemeProvider colorScheme="light">
        <Tabs
          aria-label="Habitats"
          id="habitats"
          items={items}
          onChange={onChange}
          value="ocean"
        />
      </ThemeProvider>,
    );

    const list = screen.getByRole('tablist', { name: 'Habitats' });
    fireEvent.keyDown(list, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('desert');
    fireEvent.keyDown(list, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith('forest');
    fireEvent.keyDown(list, { key: 'Home' });
    expect(onChange).toHaveBeenLastCalledWith('forest');
    fireEvent.keyDown(list, { key: 'End' });
    expect(onChange).toHaveBeenLastCalledWith('desert');
    fireEvent.keyDown(list, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledTimes(4);
  });
});

describe('sticky Tabs', () => {
  it('sticks the strip only when asked, with the same tablist inside', () => {
    const { rerender } = render(
      <Tabs
        aria-label="Habitats"
        id="habitats"
        items={habitats}
        onChange={() => undefined}
        value="forest"
      />,
    );
    const list = screen.getByRole('tablist', { name: 'Habitats' });
    expect(list.className).toBe('sw-tabs');

    rerender(
      <Tabs
        aria-label="Habitats"
        id="habitats"
        items={habitats}
        onChange={() => undefined}
        sticky
        value="forest"
      />,
    );
    expect(screen.getByRole('tablist', { name: 'Habitats' })).toBe(list);
    expect(list.className).toBe('sw-tabs sw-tabs-sticky');
    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  it('generates a canvas strip stuck under the top safe area on the top chrome layer', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toContain('sw-tabs-sticky');

    const stuck = ruleBody(css, '.sw-tabs-sticky');
    expect(stuck).toContain('position: sticky;');
    expect(stuck).toContain('top: env(safe-area-inset-top, 0px);');
    expect(stuck).toContain(`z-index: ${stackingOrder.topChrome};`);
    // The page canvas, a little see-through, over the glass blur: not the
    // glass fill, no border or radius of a card, no hex of its own.
    expect(stuck).toContain(
      'background: color-mix(in srgb, var(--sw-color-background) 90%, transparent);',
    );
    expect(stuck).toContain(
      'backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));',
    );
    expect(stuck).not.toMatch(/glass-fill|border|radius|#[0-9a-f]{3,8}\b/i);
    // The strip keeps the hairline under it and adds no padding: the first
    // tab's md inline padding is the space-4 gutter.
    const strip = ruleBody(css, '.sw-tabs');
    expect(strip).toContain('border-bottom: 1px solid var(--sw-color-border);');
    expect(strip).toContain('padding: 0;');
    expect(ruleBody(css, '.sw-tab')).toContain(
      'padding-inline: var(--sw-control-md-padding-inline);',
    );
    expect(css).toContain('--sw-control-md-padding-inline: 16px;');
  });

  it('keeps the labels readable on the stuck strip over a solid fill passing under it, in every palette', () => {
    forEveryTheme((colors, label, theme) => {
      for (const under of [colors.text, colors.accent, colors.danger]) {
        const strip = stripOver(
          colors.background,
          under,
          stuckCanvasShare,
          theme.glass.saturate,
        );
        expect(
          contrastRatio(colors.muted, strip),
          `${label} muted over ${under}`,
        ).toBeGreaterThanOrEqual(4.1);
        expect(
          contrastRatio(colors.accent, strip),
          `${label} accent over ${under}`,
        ).toBeGreaterThanOrEqual(3.6);
      }
    });
  });

  it('turns the strip solid canvas under Reduce Transparency and in forced colors', () => {
    const css = generateStylesheet();
    const reduced = css.indexOf(
      '@media (prefers-reduced-transparency: reduce) {\n  .sw-tabs-sticky {',
    );
    expect(reduced).toBeGreaterThan(css.indexOf('.sw-tabs-sticky {'));
    const solid = ruleBody(css, '.sw-tabs-sticky', reduced + 1);
    expect(solid).toContain('background: var(--sw-color-background);');
    expect(solid).toContain('backdrop-filter: none;');
    expect(solid).toContain('-webkit-backdrop-filter: none;');
    expect(css).toMatch(
      /@media \(forced-colors: active\) \{[^@]*\.sw-tabs-sticky \{ background: Canvas; backdrop-filter: none;/,
    );
  });
});
