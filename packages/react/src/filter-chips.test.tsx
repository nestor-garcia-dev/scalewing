import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FilterChips } from './components/FilterChips.js';

const options = [
  { value: 'all', label: 'All sightings (12)' },
  { value: 'forest', label: 'Forest sightings (4)' },
  { value: 'desert', label: 'Desert sightings (0)', disabled: true },
] as const;

afterEach(() => cleanup());

describe('FilterChips', () => {
  it('has one selected native radio and calls back only on a changed choice', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <FilterChips
        label="Sighting filters"
        onChange={onChange}
        options={options}
        value="all"
      />,
    );
    const group = screen.getByRole('group', { name: 'Sighting filters' });
    const all = screen.getByRole('radio', { name: 'All sightings (12)' });
    const forest = screen.getByRole('radio', { name: 'Forest sightings (4)' });
    const desert = screen.getByRole('radio', { name: 'Desert sightings (0)' });
    expect(group).toBeTruthy();
    expect(all).toHaveProperty('checked', true);
    expect(forest).toHaveProperty('checked', false);
    expect(desert).toHaveProperty('disabled', true);
    fireEvent.click(forest);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('forest');
    rerender(
      <FilterChips
        label="Sighting filters"
        onChange={onChange}
        options={options}
        value="forest"
      />,
    );
    expect(forest).toHaveProperty('checked', true);
    fireEvent.click(forest);
    fireEvent.click(desert);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('updates changing counts and long localized labels without losing selection', () => {
    const { rerender } = render(
      <FilterChips
        label="Filtros de hábitat"
        onChange={() => undefined}
        options={options}
        value="forest"
      />,
    );
    rerender(
      <FilterChips
        label="Filtros de hábitat"
        onChange={() => undefined}
        options={[
          { value: 'all', label: 'Todos (13)' },
          {
            value: 'forest',
            label: 'Observaciones en bosques tropicales extensos (5)',
          },
        ]}
        value="forest"
      />,
    );
    expect(
      screen.getByRole('radio', {
        name: 'Observaciones en bosques tropicales extensos (5)',
      }),
    ).toHaveProperty('checked', true);
  });

  it('rejects missing labels, empty or duplicate values, and stale selection', () => {
    const onChange = () => undefined;
    expect(() =>
      render(
        <FilterChips
          label=" "
          onChange={onChange}
          options={options}
          value="all"
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <FilterChips
          label="Filters"
          onChange={onChange}
          options={[]}
          value="all"
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <FilterChips
          label="Filters"
          onChange={onChange}
          options={[{ value: '', label: 'Empty' }]}
          value=""
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <FilterChips
          label="Filters"
          onChange={onChange}
          options={[{ value: 'x', label: ' ' }]}
          value="x"
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <FilterChips
          label="Filters"
          onChange={onChange}
          options={[
            { value: 'x', label: 'One' },
            { value: 'x', label: 'Two' },
          ]}
          value="x"
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <FilterChips
          label="Filters"
          onChange={onChange}
          options={options}
          value="stale"
        />,
      ),
    ).toThrow(RangeError);
  });
});
