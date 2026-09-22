import { describe, expect, it } from 'vitest';

import { compactTypographyVariants, typographyVariants } from './typography.js';

describe('compact typography', () => {
  it('steps only the largest variants down and keeps them smaller than their full size', () => {
    expect(Object.keys(compactTypographyVariants)).toEqual([
      'display',
      'heading',
    ]);
    for (const [name, compact] of Object.entries(compactTypographyVariants)) {
      const full = typographyVariants[name as keyof typeof typographyVariants];
      expect(compact.fontSize).toBeLessThan(full.fontSize);
      expect(compact.lineHeight).toBeLessThan(full.lineHeight);
      expect(compact.fontSize).toBeGreaterThan(
        typographyVariants.title.fontSize,
      );
    }
  });
});
