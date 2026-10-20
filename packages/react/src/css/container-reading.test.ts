import { describe, expect, it } from 'vitest';

import { generateStylesheet, utilityClassCatalog } from './stylesheet.js';

describe('sw-container-reading', () => {
  it('centres a column at the reading width, as sw-container does at the container width', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-container-reading { width: 100%; max-width: var(--sw-reading-max); margin-inline: auto; }',
    );
    expect(css).toContain('--sw-reading-max: 46rem;');
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-container', 'sw-container-reading']),
    );
  });
});
