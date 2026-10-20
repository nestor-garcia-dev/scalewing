import { contrastRatio } from '@scalewing/tokens';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { FilterChips, filterChipTones } from './components/FilterChips.js';
import { warningChipUnchosen } from './css/css-filter-chip-tones.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { toneInkTextShare, toneTintShare } from './css/tone-tint.js';
import { forEveryTheme, tintOver } from './every-theme.test-support.js';

afterEach(() => cleanup());

const unchosen = warningChipUnchosen;

describe('FilterChips option tone', () => {
  it('lists its tones, neutral first as the default', () => {
    expect(filterChipTones).toEqual(['neutral', 'warning']);
  });

  it('marks a warning chip and leaves the others and its name as they were', () => {
    render(
      <FilterChips
        countAppearance="inline"
        label="Sightings"
        multiple
        onChange={() => {}}
        options={[
          { value: 'all', label: 'All', count: 12 },
          { value: 'tagged', label: 'Tagged', count: 4, tone: 'neutral' },
          {
            value: 'unchecked',
            label: 'Not checked',
            count: 2,
            tone: 'warning',
          },
        ]}
        value={[]}
      />,
    );
    const warning = screen.getByRole('checkbox', { name: 'Not checked 2' });
    expect(warning.closest('label')?.className).toBe(
      'sw-filter-chip sw-filter-chip-warning',
    );
    for (const name of ['All 12', 'Tagged 4'])
      expect(
        screen.getByRole('checkbox', { name }).closest('label')?.className,
      ).toBe('sw-filter-chip');
  });

  it('keeps the quiet class beside the tone for a chip with nothing in it', () => {
    render(
      <FilterChips
        label="Sightings"
        onChange={() => {}}
        options={[
          { value: 'all', label: 'All', count: 3 },
          {
            value: 'unchecked',
            label: 'Not checked',
            count: 0,
            tone: 'warning',
          },
        ]}
        value="all"
      />,
    );
    expect(
      screen.getByRole('radio', { name: 'Not checked 0' }).closest('label')
        ?.className,
    ).toBe('sw-filter-chip sw-filter-chip-quiet sw-filter-chip-warning');
  });

  it('refuses a tone it cannot draw', () => {
    expect(() =>
      render(
        <FilterChips
          label="Sightings"
          onChange={() => {}}
          options={[{ value: 'all', label: 'All', tone: 'danger' as never }]}
          value="all"
        />,
      ),
    ).toThrow(new RangeError('Unknown FilterChips option tone: danger'));
  });

  it('draws an unchosen warning chip in the warning tint and ink, its count too, after the base chip rules', () => {
    const css = generateStylesheet();
    const rule = `${unchosen} {\n  background: color-mix(in srgb, var(--sw-color-warning) 10%, var(--sw-color-surface));\n  color: color-mix(in srgb, var(--sw-color-warning) 70%, var(--sw-color-text));\n}`;
    expect(css).toContain(rule);
    expect(css).toContain(
      `${unchosen} .sw-filter-chip-count {\n  color: inherit;\n}`,
    );
    expect(css).toContain(
      `@media (forced-colors: active) {\n  ${unchosen} { background: Canvas; color: CanvasText; }\n}`,
    );
    // After the glass face it overrides; the checked rule is out of its reach (:not(:checked)).
    expect(css.indexOf(rule)).toBeGreaterThan(
      css.indexOf('.sw-filter-chip-face {'),
    );
    expect(utilityClassCatalog()).toContain('sw-filter-chip-warning');
    // It sets no border, so an error's danger edge still shows on it.
    const block = css.slice(css.indexOf(`${unchosen} {`));
    expect(block.slice(0, block.indexOf('}'))).not.toContain('border');
    expect(warningChipUnchosen).toBe(
      '.sw-filter-chip-warning:not(.sw-filter-chip-quiet) .sw-filter-chip-input:not(:checked) + .sw-filter-chip-face',
    );
  });

  it('keeps the warning words at 4.5:1 on the warning tint in every palette and scheme', () => {
    forEveryTheme((colors, label) => {
      const fill = tintOver(colors.warning, toneTintShare, colors.surface);
      const ink = tintOver(colors.warning, 1 - toneInkTextShare, colors.text);
      expect(contrastRatio(ink, fill), label).toBeGreaterThanOrEqual(4.5);
    });
  });
});
