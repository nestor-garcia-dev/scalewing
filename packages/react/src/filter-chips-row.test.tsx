import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { FilterChips } from './components/FilterChips.js';
import { FilterChipsRow } from './components/FilterChipsRow.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

function Kinds() {
  return (
    <FilterChips
      countAppearance="inline"
      label="Kinds"
      labelVisuallyHidden
      onChange={() => {}}
      options={[
        { value: 'all', label: 'All', count: 9 },
        { value: 'birds', label: 'Birds', count: 5 },
      ]}
      overflow="scroll"
      value="all"
    />
  );
}

function Unchecked() {
  return (
    <FilterChips
      countAppearance="inline"
      label="Not checked this week"
      labelVisuallyHidden
      multiple
      onChange={() => {}}
      options={[
        {
          value: 'unchecked',
          label: 'Not checked this week',
          count: 2,
          tone: 'warning',
        },
      ]}
      value={[]}
    />
  );
}

describe('FilterChipsRow', () => {
  it('lays the groups in one row, each keeping its own name and choices, the end group last', () => {
    const { container } = render(
      <FilterChipsRow end={<Unchecked />}>
        <Kinds />
      </FilterChipsRow>,
    );
    const row = container.firstElementChild;
    expect(row?.className).toBe('sw-filter-chips-row');
    expect(row?.children).toHaveLength(2);
    expect(row?.children[0]?.tagName).toBe('FIELDSET');
    expect(row?.children[1]?.className).toBe('sw-filter-chips-row-end');
    expect(
      screen.getByRole('group', { name: 'Kinds' }).querySelectorAll('input'),
    ).toHaveLength(2);
    const end = screen.getByRole('group', { name: 'Not checked this week' });
    expect(end.closest('.sw-filter-chips-row-end')).toBeTruthy();
    expect(
      screen.getByRole('checkbox', { name: 'Not checked this week 2' }),
    ).toBeTruthy();
    // No role of its own: the groups name themselves.
    expect(row?.getAttribute('role')).toBeNull();
  });

  it('scrolls as one row with overflow scroll', () => {
    const { container } = render(
      <FilterChipsRow end={<Unchecked />} overflow="scroll">
        <Kinds />
      </FilterChipsRow>,
    );
    expect(container.firstElementChild?.className).toBe(
      'sw-filter-chips-row sw-filter-chips-row-scroll',
    );
  });

  it('draws no end box for an empty end', () => {
    for (const end of [undefined, null, false, '']) {
      const { container, unmount } = render(
        <FilterChipsRow end={end}>
          <Kinds />
        </FilterChipsRow>,
      );
      expect(container.querySelector('.sw-filter-chips-row-end')).toBeNull();
      unmount();
    }
  });

  it('refuses an overflow it cannot draw', () => {
    expect(() =>
      render(
        <FilterChipsRow overflow={'clip' as never}>
          <Kinds />
        </FilterChipsRow>,
      ),
    ).toThrow(new RangeError('Unknown FilterChipsRow overflow: clip'));
  });

  it('generates the row after the groups’ own scroll rules, which it overrides, and catalogs its classes', () => {
    const css = generateStylesheet();
    const options =
      '.sw-filter-chips-row-scroll .sw-filter-chips-options {\n  flex-wrap: nowrap;\n  margin: 0;\n  overflow: visible;\n  padding: 0;\n}';
    expect(css).toContain(options);
    expect(css.indexOf(options)).toBeGreaterThan(
      css.indexOf('.sw-filter-chips-scroll .sw-filter-chips-options {'),
    );
    expect(css).toContain(
      '.sw-filter-chips-row-end {\n  display: flex;\n  margin-inline-start: auto;',
    );
    expect(css).toContain(
      '.sw-filter-chips-row-scroll {\n  flex-wrap: nowrap;\n  margin: calc(-1 * calc(var(--sw-focus-ring-width) + var(--sw-focus-ring-offset)));\n  overflow-x: auto;',
    );
    // A scrolling group is as wide as its chips, so its label and error wrap.
    expect(css).toContain(
      '.sw-filter-chips-row-scroll .sw-filter-chips { width: min-content; }',
    );
    // Positioned, so a hidden legend past the edge stays in the scroll box.
    expect(css).toMatch(
      /\.sw-filter-chips-row-scroll \{[^}]*position: relative;[^}]*\}/,
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-filter-chips-row',
        'sw-filter-chips-row-end',
        'sw-filter-chips-row-scroll',
      ]),
    );
  });
});
