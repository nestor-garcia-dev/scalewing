import { contrastRatio } from '@scalewing/tokens';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  FilterChips,
  filterChipsSelectedStyles,
} from './components/FilterChips.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { toneInkTextShare } from './css/tone-tint.js';
import { forEveryTheme, tintOver } from './every-theme.test-support.js';

afterEach(() => cleanup());

const css = generateStylesheet();
const chips = {
  label: 'Sightings',
  onChange: () => undefined,
  options: [
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
  ],
  value: 'open',
} as const;

const subtle =
  ':where(.sw-filter-chips-selected-subtle) .sw-filter-chip-input:checked + .sw-filter-chip-face {\n  background: var(--sw-color-accentSubtle);\n  border-color: var(--sw-color-accent);\n  color: color-mix(in srgb, var(--sw-color-accent) 70%, var(--sw-color-text));\n}';

describe('FilterChips selectedStyle', () => {
  it('adds nothing by default', () => {
    render(<FilterChips {...chips} />);
    expect(screen.getByRole('group').className).toBe('sw-filter-chips');
  });

  it('marks the group for subtle', () => {
    render(<FilterChips {...chips} selectedStyle="subtle" />);
    expect(screen.getByRole('group').className).toBe(
      'sw-filter-chips sw-filter-chips-selected-subtle',
    );
    expect(filterChipsSelectedStyles).toEqual(['solid', 'subtle']);
    expect(utilityClassCatalog()).toContain('sw-filter-chips-selected-subtle');
  });

  it('throws on an unknown style', () => {
    expect(() =>
      render(
        // @ts-expect-error an unknown style
        <FilterChips {...chips} selectedStyle="loud" />,
      ),
    ).toThrow(RangeError);
  });

  it('holds the chosen chip own specificity, so an error and forced colours still win', () => {
    const rule = css.indexOf(subtle);
    expect(rule).toBeGreaterThan(0);
    const solid = css.indexOf(
      '.sw-filter-chip-input:checked + .sw-filter-chip-face {\n  background: var(--sw-color-accent);',
    );
    const error = css.indexOf(
      ".sw-filter-chips[aria-invalid='true'] .sw-filter-chip-face {\n  border-color: var(--sw-color-danger);",
    );
    const forced = css.indexOf(
      '.sw-filter-chip-input:checked + .sw-filter-chip-face { background: Highlight;',
    );
    expect(solid).toBeLessThan(rule);
    expect(rule).toBeLessThan(error);
    expect(rule).toBeLessThan(forced);
  });

  it('keeps the words at 4.5:1 on the tint in every palette and scheme', () => {
    forEveryTheme((colors, label) => {
      const ink = tintOver(colors.accent, 1 - toneInkTextShare, colors.text);
      expect(
        contrastRatio(ink, colors.accentSubtle),
        label,
      ).toBeGreaterThanOrEqual(4.5);
      // The accent edge marks the chosen chip against the page (WCAG 1.4.11).
      expect(
        contrastRatio(colors.accent, colors.background),
        label,
      ).toBeGreaterThanOrEqual(3);
    });
  });
});
