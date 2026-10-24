import { describe, expect, it } from 'vitest';

import { compactTypographyVariants, typographyVariants } from './typography.js';

describe('compact typography', () => {
  it('steps the titles down and keeps them above a card title', () => {
    expect(Object.keys(compactTypographyVariants)).toEqual([
      'hero',
      'display',
      'headline',
      'heading',
      'lead',
    ]);
    for (const [name, compact] of Object.entries(compactTypographyVariants)) {
      const full = typographyVariants[name as keyof typeof typographyVariants];
      expect(compact.fontSize).toBeLessThan(full.fontSize);
      expect(compact.lineHeight).toBeLessThan(full.lineHeight);
      if (name === 'lead') continue;
      expect(compact.fontSize).toBeGreaterThan(
        typographyVariants.title.fontSize,
      );
    }
  });

  it("steps a lead down to the body's size", () => {
    const { lead } = compactTypographyVariants;
    expect(lead.fontSize).toBe(typographyVariants.body.fontSize);
    expect(lead.lineHeight).toBe(typographyVariants.body.lineHeight);
    expect(lead.letterSpacing).toBe(typographyVariants.body.letterSpacing);
  });
});

describe('showcase sizes', () => {
  it('places hero above display and headline between display and heading', () => {
    const { display, heading, headline, hero } = typographyVariants;
    expect(hero.fontSize).toBeGreaterThan(display.fontSize);
    expect(headline.fontSize).toBeGreaterThan(heading.fontSize);
    expect(headline.fontSize).toBeLessThan(display.fontSize);
  });

  it("sets a lead at a card title's size in the body's weight, with more leading", () => {
    const { body, lead, title } = typographyVariants;
    expect(lead.fontSize).toBe(title.fontSize);
    expect(lead.fontWeight).toBe(body.fontWeight);
    expect(lead.lineHeight).toBeGreaterThan(title.lineHeight);
  });
});
