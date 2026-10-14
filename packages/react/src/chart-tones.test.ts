import { categoricalHues, contrastRatio } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import {
  chartFillMixes,
  chartFillTones,
  chartInkMixes,
  chartStrokeColors,
  chartStrokeTones,
  chartTones,
  cssChartToneClasses,
} from './css/chart-tones.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import {
  chartMixColor,
  chartSourceColor,
  forEveryTheme,
} from './every-theme.test-support.js';

describe('chart tones', () => {
  it('lists every fill and stroke tone once', () => {
    expect(chartFillTones).toEqual([
      ...categoricalHues,
      'neutral',
      'success',
      'muted',
      'strong',
      'accent',
    ]);
    expect(chartStrokeTones).toEqual([
      'accent',
      'success',
      'warning',
      'danger',
      'neutral',
    ]);
    expect(new Set(chartTones).size).toBe(chartTones.length);
    expect(chartTones).toHaveLength(13);
  });

  it('hands each tone its roles as custom properties, with no hex', () => {
    const css = cssChartToneClasses();
    expect(css).not.toMatch(/#[0-9a-f]{3}/i);
    expect(css).toContain(
      '.sw-chart-tone-blue { --sw-chart-fill: color-mix(in srgb, var(--sw-categorical-blue) 72%, var(--sw-color-surface)); --sw-chart-ink: color-mix(in srgb, var(--sw-categorical-blue) 30%, var(--sw-color-text)); }',
    );
    // neutral is one grey for a series and a range bar's start; its stroke
    // and words are the muted colour.
    expect(css).toContain(
      '.sw-chart-tone-neutral { --sw-chart-fill: color-mix(in srgb, var(--sw-color-muted) 65%, var(--sw-color-surface)); --sw-chart-stroke: var(--sw-color-muted); --sw-chart-ink: var(--sw-color-muted); }',
    );
    expect(css).toContain(
      '.sw-chart-tone-accent { --sw-chart-fill: var(--sw-color-accent); --sw-chart-stroke: var(--sw-color-accent); --sw-chart-ink: color-mix(in srgb, var(--sw-color-accent) 50%, var(--sw-color-text)); }',
    );
    // A fill-only tone sets only its fill.
    expect(css).toContain(
      '.sw-chart-tone-strong { --sw-chart-fill: color-mix(in srgb, var(--sw-color-text) 85%, var(--sw-color-surface)); }',
    );
    expect(css).toContain(
      '.sw-chart-tone-warning { --sw-chart-stroke: var(--sw-color-warning); --sw-chart-ink: color-mix(in srgb, var(--sw-color-warning) 50%, var(--sw-color-text)); }',
    );
    expect(generateStylesheet()).toContain(css);
    for (const tone of chartTones)
      expect(utilityClassCatalog()).toContain(`sw-chart-tone-${tone}`);
  });

  it('keeps every fill 1.5:1 on the surface in every palette and scheme', () => {
    forEveryTheme((colors, label, theme) => {
      for (const tone of chartFillTones)
        expect(
          contrastRatio(
            chartMixColor(chartFillMixes[tone], colors, theme),
            colors.surface,
          ),
          `${label} ${tone}`,
        ).toBeGreaterThanOrEqual(1.5);
    });
  });

  it('keeps every stroke 3:1 on the surface, a graphic that must be seen', () => {
    forEveryTheme((colors, label, theme) => {
      for (const tone of chartStrokeTones)
        expect(
          contrastRatio(
            chartSourceColor(chartStrokeColors[tone], colors, theme),
            colors.surface,
          ),
          `${label} ${tone}`,
        ).toBeGreaterThanOrEqual(3);
    });
  });

  it('keeps every ink 4.5:1 on the surface, as text', () => {
    forEveryTheme((colors, label, theme) => {
      for (const [tone, mix] of Object.entries(chartInkMixes))
        expect(
          contrastRatio(chartMixColor(mix, colors, theme), colors.surface),
          `${label} ${tone}`,
        ).toBeGreaterThanOrEqual(4.5);
    });
  });
});
