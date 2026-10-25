import { describe, expect, it } from 'vitest';

import { generateStylesheet } from './css/stylesheet.js';

const css = generateStylesheet();

const coarseRule =
  '@media (pointer: coarse) {\n  .sw-select .sw-select-trigger,\n  .sw-select .sw-select-option { min-height: var(--sw-control-md-min-height); }\n}';

describe('Select touch target', () => {
  it('gives the trigger and options of every size 44 px on a coarse pointer', () => {
    expect(css).toContain(coarseRule);
    expect(css).toContain('--sw-control-md-min-height: 44px');
  });

  it('follows the xs rules, which it outranks only by order', () => {
    const coarse = css.indexOf(coarseRule);
    for (const rule of [
      '.sw-select-xs .sw-select-trigger {',
      '.sw-select-xs .sw-select-option {',
      '\n.sw-select-trigger {',
      '\n.sw-select-option {',
    ]) {
      const at = css.indexOf(rule);
      expect(at).toBeGreaterThan(-1);
      expect(at).toBeLessThan(coarse);
    }
  });

  it('keeps the fine-pointer xs height', () => {
    const start = css.indexOf('.sw-select-xs .sw-select-trigger {');
    expect(css.slice(start, css.indexOf('}', start))).toContain(
      'min-height: var(--sw-control-xs-min-height);',
    );
  });
});
