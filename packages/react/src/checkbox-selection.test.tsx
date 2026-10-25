import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Checkbox } from './components/Checkbox.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const css = generateStylesheet();

describe('Checkbox labelVisuallyHidden', () => {
  it('keeps the label as the name but hides its words', () => {
    render(
      <Checkbox
        checked={false}
        label="Select Mallard"
        labelVisuallyHidden
        onCheckedChange={() => {}}
      />,
    );
    const control = screen.getByRole('checkbox', { name: 'Select Mallard' });
    const label = control.closest('label')!;
    expect(label.className).toBe('sw-checkbox-label sw-checkbox-label-hidden');
    expect(label.querySelector('.sw-sr-only')?.textContent).toBe(
      'Select Mallard',
    );
    expect(label.querySelector('.sw-checkbox-text')).toBeNull();
  });

  it('draws the label by default', () => {
    render(
      <Checkbox checked={false} label="Ringed" onCheckedChange={() => {}} />,
    );
    const label = screen.getByRole('checkbox').closest('label')!;
    expect(label.className).toBe('sw-checkbox-label');
    expect(label.querySelector('.sw-checkbox-text')?.textContent).toBe(
      'Ringed',
    );
  });

  it('is its own size on a fine pointer and the 44 px target on a coarse one', () => {
    const start = css.indexOf('.sw-checkbox-label-hidden {');
    expect(css.slice(start, css.indexOf('}', start))).toContain(
      'min-height: 0;',
    );
    expect(css).toMatch(
      /@media \(pointer: coarse\) \{\s+\.sw-checkbox-label-hidden \{\s+min-height: var\(--sw-control-md-min-height\);\s+min-width: var\(--sw-control-md-min-height\);/,
    );
    expect(utilityClassCatalog()).toContain('sw-checkbox-label-hidden');
  });
});

describe('Checkbox indeterminate', () => {
  it('sets the native mixed state and aria-checked="mixed" only while mixed', () => {
    const { rerender } = render(
      <Checkbox
        checked={false}
        indeterminate
        label="Select all"
        onCheckedChange={() => {}}
      />,
    );
    const control = screen.getByRole<HTMLInputElement>('checkbox', {
      name: 'Select all',
    });
    expect(control.indeterminate).toBe(true);
    expect(control.getAttribute('aria-checked')).toBe('mixed');
    rerender(
      <Checkbox checked label="Select all" onCheckedChange={() => {}} />,
    );
    expect(control.indeterminate).toBe(false);
    expect(control.hasAttribute('aria-checked')).toBe(false);
    expect(control.checked).toBe(true);
  });

  it('reports a press from mixed as checked and stays mixed if the consumer keeps it', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Checkbox
        checked={false}
        indeterminate
        label="Select all"
        onCheckedChange={onCheckedChange}
      />,
    );
    const control = screen.getByRole<HTMLInputElement>('checkbox');
    await user.click(control);
    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
    // The consumer did not change the props: the box is mixed again.
    expect(control.indeterminate).toBe(true);
    expect(control.checked).toBe(false);
  });

  it('follows a controlled select-all through mixed, all and none', async () => {
    const user = userEvent.setup();
    function SelectAll() {
      const [chosen, setChosen] = useState(1);
      return (
        <Checkbox
          checked={chosen === 3}
          indeterminate={chosen > 0 && chosen < 3}
          label="Select all"
          onCheckedChange={(next) => setChosen(next ? 3 : 0)}
        />
      );
    }
    render(<SelectAll />);
    const control = screen.getByRole<HTMLInputElement>('checkbox');
    await user.click(control);
    expect([control.checked, control.indeterminate]).toEqual([true, false]);
    await user.click(control);
    expect([control.checked, control.indeterminate]).toEqual([false, false]);
  });

  it('draws a dash on the accent fill, kept in forced colours', () => {
    expect(css).toContain(
      '.sw-checkbox-input:indeterminate + .sw-checkbox-mark {\n  background: var(--sw-color-accent);',
    );
    const start = css.indexOf(
      '.sw-checkbox-input:indeterminate + .sw-checkbox-mark::after {',
    );
    const dash = css.slice(start, css.indexOf('}', start));
    expect(dash).toContain('border-right: 0;');
    expect(dash).toContain('transform: none;');
    expect(dash).toContain('width: var(--sw-space-3);');
    expect(css).toContain(
      '.sw-checkbox-input:is(:checked, :indeterminate) + .sw-checkbox-mark { background: Highlight; border-color: Highlight; }',
    );
  });
});
