import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  MultiSelect,
  type MultiSelectOption,
  type MultiSelectProps,
} from './components/MultiSelect.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const options: MultiSelectOption[] = [
  { value: 'forest', label: 'Forest', icon: <svg data-testid="leaf" /> },
  { value: 'lake', label: 'Lake' },
  { value: 'station', label: 'Station moves', separatorBefore: true },
];

function Habitats(props: Partial<MultiSelectProps>) {
  const [value, setValue] = useState<string[]>(['forest', 'lake', 'station']);
  return (
    <>
      <MultiSelect
        allLabel="All"
        clearLabel="Clear"
        label="Show"
        onChange={setValue}
        options={options}
        summary={value.length === 3 ? 'All sightings' : `${value.length} kinds`}
        value={value}
        {...props}
      />
      <output role="status">{value.join(',')}</output>
    </>
  );
}

function trigger() {
  return screen.getByRole('button', { name: /^Show/ });
}

describe('MultiSelect', () => {
  it('names the trigger by its label and summary and discloses a group', () => {
    render(<Habitats />);
    expect(trigger().textContent).toBe('Show All sightings');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('group')).toBeNull();
    fireEvent.click(trigger());
    const group = screen.getByRole('group', { name: 'Show' });
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().getAttribute('aria-controls')).toBe(group.id);
    expect(
      screen
        .getAllByRole('checkbox')
        .map((box) => [
          box.closest('label')?.textContent,
          (box as HTMLInputElement).checked,
        ]),
    ).toEqual([
      ['Forest', true],
      ['Lake', true],
      ['Station moves', true],
    ]);
    // The first checkbox takes focus as the panel opens.
    expect(document.activeElement).toBe(
      screen.getByRole('checkbox', { name: 'Forest' }),
    );
  });

  it('reports the checked values in the options order', () => {
    render(<Habitats />);
    fireEvent.click(trigger());
    fireEvent.click(screen.getByRole('checkbox', { name: 'Forest' }));
    expect(screen.getByRole('status', { hidden: true }).textContent).toBe(
      'lake,station',
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Forest' }));
    expect(screen.getByRole('status', { hidden: true }).textContent).toBe(
      'forest,lake,station',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByRole('status', { hidden: true }).textContent).toBe('');
    expect(trigger().textContent).toBe('Show 0 kinds');
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByRole('status', { hidden: true }).textContent).toBe(
      'forest,lake,station',
    );
  });

  it('hides the icon and sets a separated option apart', () => {
    render(<Habitats />);
    fireEvent.click(trigger());
    const icon = screen.getByTestId('leaf').parentElement;
    expect(icon?.className).toBe('sw-multi-select-icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(
      screen
        .getByRole('checkbox', { name: 'Station moves' })
        .closest('.sw-multi-select-row')?.className,
    ).toBe('sw-multi-select-row sw-multi-select-row-separated');
  });

  it('closes on Escape and gives focus back to the trigger', () => {
    render(<Habitats />);
    fireEvent.click(trigger());
    fireEvent.keyDown(screen.getByRole('checkbox', { name: 'Lake' }), {
      key: 'Escape',
    });
    expect(screen.queryByRole('group')).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('opens with ArrowDown and closes when focus leaves', () => {
    render(
      <>
        <Habitats />
        <button type="button">Elsewhere</button>
      </>,
    );
    fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
    const forest = screen.getByRole('checkbox', { name: 'Forest' });
    fireEvent.blur(forest, {
      relatedTarget: screen.getByRole('button', { name: 'Elsewhere' }),
    });
    expect(screen.queryByRole('group')).toBeNull();
  });

  it('stays shut while disabled', () => {
    render(<Habitats disabled />);
    expect((trigger() as HTMLButtonElement).disabled).toBe(true);
  });

  it('closes for good when disabled while open', () => {
    const { rerender } = render(<Habitats />);
    fireEvent.click(trigger());
    expect(screen.getByRole('group')).toBeTruthy();
    rerender(<Habitats disabled />);
    expect(screen.queryByRole('group')).toBeNull();
    const before = document.activeElement;
    rerender(<Habitats disabled={false} />);
    expect(screen.queryByRole('group')).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(before);
  });

  it('closes on Escape from the trigger while open, keeping focus there', () => {
    render(<Habitats />);
    fireEvent.click(trigger());
    trigger().focus();
    fireEvent.keyDown(trigger(), { key: 'Escape' });
    expect(screen.queryByRole('group')).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('fails closed on blank words, no options, duplicates or an unknown value', () => {
    const base: MultiSelectProps = {
      allLabel: 'All',
      clearLabel: 'Clear',
      label: 'Show',
      onChange: vi.fn(),
      options,
      summary: 'All',
      value: [],
    };
    for (const broken of [
      { label: ' ' },
      { summary: '' },
      { allLabel: '' },
      { options: [] },
      { options: [...options, { value: 'lake', label: 'Lake again' }] },
      { value: ['desert'] },
      { align: 'center' as 'start' },
    ])
      expect(() => render(<MultiSelect {...base} {...broken} />)).toThrow(
        RangeError,
      );
  });
});

describe('MultiSelect CSS', () => {
  it('emits the trigger, the panel on the popup layer and the rows', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-multi-select-trigger',
        'sw-multi-select-panel',
        'sw-multi-select-row-separated',
      ]),
    );
    expect(css).toMatch(/\.sw-multi-select-panel \{[^}]*z-index: 10;/);
    expect(css).toContain(
      '.sw-card-glass:has(.sw-select-list, .sw-action-menu-list, .sw-multi-select-panel',
    );
  });
});
