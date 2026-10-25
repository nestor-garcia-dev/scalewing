import { buttonSizes } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import { generateStylesheet } from './css/stylesheet.js';

const css = generateStylesheet();

const coarseRule =
  '@media (pointer: coarse) {\n  .sw-button { min-height: var(--sw-control-md-min-height); min-width: var(--sw-control-md-min-height); }\n}';

describe('Button touch target', () => {
  it('gives every size the 44 px target both ways on a coarse pointer', () => {
    expect(css).toContain(coarseRule);
    expect(css).toContain('--sw-control-md-min-height: 44px');
  });

  it('follows every size rule, which it outranks only by order', () => {
    const coarse = css.indexOf(coarseRule);
    for (const size of buttonSizes) {
      const sizeRule = css.indexOf(`.sw-button-${size} { min-height:`);
      expect(sizeRule).toBeGreaterThan(-1);
      expect(sizeRule).toBeLessThan(coarse);
    }
  });

  it('keeps the fine-pointer heights of the small sizes', () => {
    expect(css).toContain('.sw-button-xs { min-height: 28px');
    expect(css).toContain('.sw-button-sm { min-height: 32px');
  });
});
