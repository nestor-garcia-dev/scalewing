import { describe, expect, it } from 'vitest';

import {
  buttonSizes,
  compactControlScale,
  compactFilterChipMinHeight,
  controlScale,
} from './control.js';
import { typographyVariants } from './typography.js';

describe('the control scales', () => {
  it('keeps the comfortable scale consumers already have', () => {
    expect(controlScale).toEqual({
      xs: { minHeight: 28, paddingInline: 10 },
      sm: { minHeight: 32, paddingInline: 12 },
      md: { minHeight: 44, paddingInline: 16 },
    });
  });

  it('steps every size down in the compact scale, keeping their order', () => {
    expect(compactControlScale.md).toEqual({
      minHeight: 36,
      paddingInline: 14,
    });
    for (const size of buttonSizes) {
      const compact = compactControlScale[size];
      expect(compact.minHeight).toBeLessThan(controlScale[size].minHeight);
      expect(compact.paddingInline).toBeLessThan(
        controlScale[size].paddingInline,
      );
      // A label's line and a border still fit.
      expect(compact.minHeight).toBeGreaterThanOrEqual(
        typographyVariants.label.lineHeight + 2,
      );
    }
    expect(compactControlScale.xs.minHeight).toBeLessThan(
      compactControlScale.sm.minHeight,
    );
    expect(compactControlScale.sm.minHeight).toBeLessThan(
      compactControlScale.md.minHeight,
    );
  });

  it('sets a compact chip between sm and md', () => {
    expect(compactFilterChipMinHeight).toBe(32);
    expect(compactFilterChipMinHeight).toBeGreaterThan(
      compactControlScale.sm.minHeight,
    );
    expect(compactFilterChipMinHeight).toBeLessThan(
      compactControlScale.md.minHeight,
    );
  });
});

describe('bodySm', () => {
  it('is 15/22/400', () => {
    expect(typographyVariants.bodySm).toMatchObject({
      fontSize: 15,
      fontWeight: 400,
      lineHeight: 22,
    });
  });
});
