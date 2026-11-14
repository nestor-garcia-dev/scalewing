import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Checkbox, checkboxAppearances } from './components/Checkbox.js';
import { cssCheckboxClasses } from './css/css-checkbox.js';

afterEach(() => cleanup());

function tileOf(control: HTMLElement): HTMLElement {
  const tile = control.closest('.sw-checkbox');
  if (!(tile instanceof HTMLElement)) throw new Error('no tile');
  return tile;
}

describe('Checkbox appearance="tile"', () => {
  it('draws one tile that takes the accent edge while chosen or mixed and the danger edge while invalid', () => {
    const { rerender } = render(
      <Checkbox
        appearance="tile"
        checked={false}
        description="Count and close the burrow each evening"
        label="Burrows"
        onCheckedChange={() => undefined}
      />,
    );
    const control = screen.getByRole('checkbox', {
      name: 'Burrows',
      description: 'Count and close the burrow each evening',
    });
    const tile = tileOf(control);
    expect(tile.className).toBe('sw-checkbox sw-checkbox-tile');
    // The description stays out of the name, inside the tile.
    expect(tile.textContent).toContain('Count and close the burrow');
    rerender(
      <Checkbox
        appearance="tile"
        checked
        label="Burrows"
        onCheckedChange={() => undefined}
      />,
    );
    expect(tile.classList.contains('sw-checkbox-tile-checked')).toBe(true);
    rerender(
      <Checkbox
        appearance="tile"
        checked={false}
        indeterminate
        error="Choose the burrows"
        label="Burrows"
        onCheckedChange={() => undefined}
      />,
    );
    expect(tile.classList.contains('sw-checkbox-tile-checked')).toBe(true);
    expect(tile.classList.contains('sw-checkbox-tile-invalid')).toBe(true);
  });

  it('toggles once per press on its words or Space, and not while disabled', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    function Tile({ disabled = false }: { disabled?: boolean }) {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox
          appearance="tile"
          checked={checked}
          disabled={disabled}
          label="Nests"
          onCheckedChange={(next) => {
            onChange(next);
            setChecked(next);
          }}
        />
      );
    }
    const { rerender } = render(<Tile />);
    await user.click(screen.getByText('Nests'));
    expect(onChange).toHaveBeenLastCalledWith(true);
    screen.getByRole('checkbox', { name: 'Nests' }).focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(onChange).toHaveBeenCalledTimes(2);
    rerender(<Tile disabled />);
    await user.click(screen.getByText('Nests'));
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('keeps plain the default and fails closed on an unknown appearance or a hidden label', () => {
    render(
      <Checkbox
        checked={false}
        label="Dens"
        onCheckedChange={() => undefined}
      />,
    );
    expect(
      tileOf(screen.getByRole('checkbox', { name: 'Dens' })).className,
    ).toBe('sw-checkbox');
    expect(checkboxAppearances).toEqual(['plain', 'tile']);
    expect(() =>
      render(
        <Checkbox
          // @ts-expect-error an appearance Checkbox does not have
          appearance="card"
          checked={false}
          label="Dens"
          onCheckedChange={() => undefined}
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <Checkbox
          appearance="tile"
          checked={false}
          label="Dens"
          labelVisuallyHidden
          onCheckedChange={() => undefined}
        />,
      ),
    ).toThrow(RangeError);
  });

  it('generates the tile rules: the stretched press target, the edges and forced colours', () => {
    const css = cssCheckboxClasses();
    expect(css).toContain('.sw-checkbox-tile .sw-checkbox-label::after');
    // The box sits above the stretched layer, so a press on it hits the input.
    expect(css).toMatch(
      /\.sw-checkbox-tile \.sw-checkbox-control \{\s*z-index: 1;\s*\}/,
    );
    // The tile keeps that layering to itself.
    expect(css).toMatch(/\.sw-checkbox-tile \{[^}]*isolation: isolate;/);
    expect(css).toMatch(
      /\.sw-checkbox-tile-checked \{\s*border-color: var\(--sw-color-accent\);\s*box-shadow: inset 0 0 0 1px var\(--sw-color-accent\);/,
    );
    expect(css).toMatch(
      /\.sw-checkbox-tile-invalid \{\s*border-color: var\(--sw-color-danger\);/,
    );
    expect(css).toContain(
      '.sw-checkbox-tile-checked { border-color: Highlight; box-shadow: inset 0 0 0 1px Highlight; }',
    );
    // The invalid edge comes after the chosen one, so it wins.
    expect(css.indexOf('.sw-checkbox-tile-invalid {')).toBeGreaterThan(
      css.indexOf('.sw-checkbox-tile-checked {'),
    );
  });
});
