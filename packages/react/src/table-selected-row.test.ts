import { contrastRatio, type SemanticColorKey } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import { cssTableClasses } from './css/css-table.js';
import { forEveryTheme } from './every-theme.test-support.js';

/*
 * Teisoro NSF-12: a selected row added padding to its first cell (the
 * columns moved by 11 px when a row was picked) and drew an 8 px dot. The
 * bar's token is read from the generated rule so the contrast checks
 * follow it.
 */
describe('Table selected row', () => {
  const css = cssTableClasses();
  const selectedRules = css.slice(css.indexOf('.sw-table-row-selected'));
  const bar =
    /\.sw-table-row-selected > :first-child::before \{\n {2}border-inline-start: var\(--sw-space-\d\) solid var\(--sw-color-(\w+)\);/.exec(
      css,
    );

  it('moves no column: nothing in the selected rules takes layout space', () => {
    expect(bar).not.toBeNull();
    expect(selectedRules).not.toMatch(/padding|margin|width|min-width/);
    // The bar is out of flow, inside the first cell's padding.
    const before = selectedRules.slice(
      selectedRules.indexOf(':first-child::before {'),
    );
    expect(before.slice(0, before.indexOf('}'))).toContain(
      'position: absolute;',
    );
    expect(css).not.toContain('.sw-table-compact .sw-table-row-selected');
  });

  it('keeps the bar in forced colors, in the system highlight', () => {
    expect(css).toContain(
      '@media (forced-colors: active) {\n  .sw-table-row-selected > :first-child::before { border-color: Highlight; }',
    );
  });

  it('adds no fill, so every text color keeps its contrast on the row', () => {
    // Review of PR #75: a subtle tint dropped accent text (ghost buttons,
    // links) under 4.5:1 in cornflower, soft-blue, capri, raspberry, amber,
    // fuchsia and synthwave light and synthwave dark.
    expect(selectedRules).not.toMatch(/background/);
    const below: string[] = [];
    forEveryTheme((colors, label) => {
      // With no fill the row shows what holds the table: the page or a
      // surface.
      for (const ground of ['background', 'surface'] as const) {
        for (const text of ['text', 'muted', 'accent'] as const) {
          const ratio = contrastRatio(colors[text], colors[ground]);
          if (ratio < 4.5) below.push(`${label} ${text} on ${ground}`);
        }
      }
    });
    // Harvest's dark accent is 4.24:1 on its own surface, a palette
    // property the tokens tests record; the selection neither causes nor
    // worsens it. Any new entry is a regression.
    expect(below).toEqual(['harvest dark accent on surface']);
  });

  it('keeps the bar at 3:1 against what holds the table in every palette and scheme', () => {
    const barToken = bar![1] as SemanticColorKey;
    forEveryTheme((colors, label) => {
      for (const ground of ['background', 'surface'] as const)
        expect(
          contrastRatio(colors[barToken], colors[ground]),
          `${label} bar on ${ground}`,
        ).toBeGreaterThanOrEqual(3);
    });
  });
});
