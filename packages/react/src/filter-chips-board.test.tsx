import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  FilterChips,
  filterChipCountAppearances,
  filterChipsOverflows,
} from './components/FilterChips.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const habitats = [
  { value: 'all', label: 'All', count: 7 },
  { value: 'forest', label: 'Forest', count: 3 },
  { value: 'reef', label: 'Reef', count: 0 },
];

const days = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
];

describe('FilterChips board options', () => {
  it('keeps a hidden label as the group name without drawing it', () => {
    render(
      <FilterChips
        label="Show habitats"
        labelVisuallyHidden
        onChange={vi.fn()}
        options={habitats}
        value="all"
      />,
    );
    const group = screen.getByRole('group', { name: 'Show habitats' });
    expect(group.querySelector('legend')?.className).toBe(
      'sw-filter-chips-legend sw-sr-only',
    );
  });

  it('draws an inline count after a hidden dot, read as the label and its count', () => {
    render(
      <FilterChips
        countAppearance="inline"
        label="Show habitats"
        onChange={vi.fn()}
        options={habitats}
        value="all"
      />,
    );
    const forest = screen.getByRole('radio', { name: 'Forest 3' });
    const face = forest.nextElementSibling!;
    expect(face.textContent).toBe('Forest · 3');
    expect(face.querySelector('[aria-hidden="true"]')?.textContent).toBe('·');
    expect(
      face.querySelector('.sw-filter-chip-count-inline')?.textContent,
    ).toBe('3');
    expect(face.querySelector('.sw-filter-chip-count')).toBeNull();
    expect(filterChipCountAppearances).toEqual(['figure', 'inline']);
  });

  it('scrolls on one row on request, and wraps by default', () => {
    const { rerender } = render(
      <FilterChips
        label="Show habitats"
        onChange={vi.fn()}
        options={habitats}
        value="all"
      />,
    );
    const group = () => screen.getByRole('group', { name: 'Show habitats' });
    expect(group().className).toBe('sw-filter-chips');
    rerender(
      <FilterChips
        label="Show habitats"
        onChange={vi.fn()}
        options={habitats}
        overflow="scroll"
        value="all"
      />,
    );
    expect(group().className).toBe('sw-filter-chips sw-filter-chips-scroll');
    expect(filterChipsOverflows).toEqual(['wrap', 'scroll']);
  });

  it('turns several chips on as checkboxes, each a tab stop, in the options order', () => {
    const onChange = vi.fn();
    render(
      <FilterChips
        label="Busiest days"
        multiple
        onChange={onChange}
        options={days}
        value={['wed']}
      />,
    );
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    const [mon, tue, wed] = screen.getAllByRole('checkbox');
    expect(wed).toHaveProperty('checked', true);
    expect(mon).toHaveProperty('checked', false);
    for (const box of [mon, tue, wed])
      expect(box).toHaveProperty('tabIndex', 0);
    fireEvent.click(mon!);
    expect(onChange).toHaveBeenLastCalledWith(['mon', 'wed']);
    fireEvent.click(wed!);
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('keeps a disabled chip that is on when another is toggled', () => {
    const onChange = vi.fn();
    render(
      <FilterChips
        label="Busiest days"
        multiple
        onChange={onChange}
        options={[days[0]!, { ...days[1]!, disabled: true }, days[2]!]}
        value={['tue']}
      />,
    );
    expect(screen.getByRole('checkbox', { name: 'Tue' })).toHaveProperty(
      'disabled',
      true,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Wed' }));
    expect(onChange).toHaveBeenLastCalledWith(['tue', 'wed']);
  });

  it('refuses what it cannot draw', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const base = { label: 'Days', onChange: vi.fn(), options: days };
    expect(() =>
      render(<FilterChips {...base} multiple value={['sun']} />),
    ).toThrow('every value must match an option');
    expect(() =>
      render(
        <FilterChips {...base} multiple required={true as never} value={[]} />,
      ),
    ).toThrow('a multiple FilterChips cannot be required');
    expect(() =>
      render(<FilterChips {...base} multiple value={'mon' as never} />),
    ).toThrow('a multiple FilterChips value must be a list');
    expect(() =>
      render(
        <FilterChips {...base} countAppearance={'pill' as never} value="mon" />,
      ),
    ).toThrow('Unknown FilterChips countAppearance: pill');
    expect(() =>
      render(<FilterChips {...base} overflow={'clip' as never} value="mon" />),
    ).toThrow('Unknown FilterChips overflow: clip');
  });

  it('generates the inline count and the one-row scroll', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-filter-chips-scroll .sw-filter-chips-options {\n  flex-wrap: nowrap;',
    );
    expect(css).toContain(
      '.sw-filter-chips-scroll .sw-filter-chip-face {\n  white-space: nowrap;\n}',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-filter-chip-count-inline',
        'sw-filter-chips-scroll',
      ]),
    );
  });
});
