import { describe, expect, it } from 'vitest';

import { chartPlotClassCatalog } from './css/css-chart-plot.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

const css = generateStylesheet();

describe('chart plot CSS', () => {
  it('generates every plot class into the catalog', () => {
    for (const name of chartPlotClassCatalog())
      expect(utilityClassCatalog()).toContain(name);
  });

  it('draws the marks from the tone roles and theme colours, with no hex', () => {
    const rules = css.slice(
      css.indexOf('.sw-chart {'),
      css.indexOf('@media (forced-colors: active) {\n  .sw-chart-column'),
    );
    expect(rules).not.toMatch(/#[0-9a-f]{3}/i);
    expect(css).toContain('.sw-chart-column { fill: var(--sw-chart-fill); }');
    expect(css).toContain(
      '.sw-chart-line {\n  fill: none;\n  stroke: var(--sw-chart-stroke);',
    );
    expect(css).toContain(
      '.sw-chart-highlight {\n  fill: none;\n  stroke: var(--sw-chart-stroke);\n  stroke-dasharray: 3 3;',
    );
    expect(css).toContain(
      '.sw-chart-callout-text {\n  fill: var(--sw-chart-ink, var(--sw-color-text));',
    );
    expect(css).toContain('.sw-chart-tick-line { fill: var(--sw-chart-ink); }');
  });

  it('sets the words in the caption type and the drawing at its own width', () => {
    expect(css).toContain(
      '.sw-chart-svg {\n  display: block;\n  font-family: var(--sw-font-sans);\n  font-size: 13px;\n  height: auto;',
    );
    expect(css).toContain(
      '  max-width: 100%;\n  overflow: visible;\n  width: 100%;',
    );
  });

  it('keeps the drawing in system colours when colours are forced', () => {
    expect(css).toContain(
      '@media (forced-colors: active) {\n  .sw-chart-column { fill: CanvasText; stroke: Canvas; }',
    );
    expect(css).toContain('  .sw-chart-line { stroke: Highlight; }');
    expect(css).toContain(
      '  .sw-chart-callout-dot { background: CanvasText; }',
    );
  });
});
