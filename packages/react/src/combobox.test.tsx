import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState, type ReactNode } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  Combobox,
  Dialog,
  type ComboboxGroup,
  type ComboboxProps,
  comboboxSizes,
} from './index.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

beforeAll(() => {
  // jsdom has no modal dialog.
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
  };
});

afterEach(() => cleanup());

const all: ComboboxGroup[] = [
  {
    label: "Kim's stations",
    options: [
      {
        value: 'lagoon',
        label: 'Blue Lagoon',
        description: '2 visits · last Sep 28',
        badge: { label: 'Busy', tone: 'warning' },
      },
      { value: 'delta', label: 'Delta hide', description: '1 visit' },
    ],
  },
  {
    label: 'All stations',
    options: [
      {
        value: 'quarry',
        label: 'Old quarry',
        badge: { label: 'Closed', tone: 'danger' },
        disabled: true,
      },
    ],
  },
];

function Stations(
  props: Partial<ComboboxProps> & { onPicked?: (v: string) => void },
) {
  const [text, setText] = useState('');
  const groups = all
    .map((group) => ({
      ...group,
      options: group.options.filter((option) =>
        option.label.toLowerCase().includes(text.toLowerCase()),
      ),
    }))
    .filter((group) => group.options.length > 0);
  return (
    <>
      <Combobox
        action={
          text
            ? {
                label: `New station “${text}”`,
                onPress: vi.fn(),
                badge: { label: 'New' },
              }
            : undefined
        }
        emptyText="No station matches."
        groups={groups}
        inputValue={text}
        label="Station"
        note="Not here? Type to search every station."
        onInputChange={setText}
        onSelect={(value) => {
          setText(
            all.flatMap((g) => g.options).find((o) => o.value === value)!.label,
          );
          props.onPicked?.(value);
        }}
        {...props}
      />
      <button type="button">Elsewhere</button>
    </>
  );
}

function live() {
  return document.querySelector('.sw-combobox > [role="status"]')!;
}

function input() {
  return screen.getByRole('combobox', { name: 'Station' }) as HTMLInputElement;
}

describe('Combobox', () => {
  it('is an ARIA 1.2 combobox that opens on a press and names its list', () => {
    render(<Stations />);
    const box = input();
    expect(box.getAttribute('aria-autocomplete')).toBe('list');
    expect(box.getAttribute('aria-expanded')).toBe('false');
    expect(box.getAttribute('aria-controls')).toBeNull();
    fireEvent.click(box);
    const list = screen.getByRole('listbox', { name: 'Station' });
    expect(box.getAttribute('aria-expanded')).toBe('true');
    expect(box.getAttribute('aria-controls')).toBe(list.id);
    expect(screen.getByRole('group', { name: "Kim's stations" })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'All stations' })).toBeTruthy();
    const lagoon = screen.getByRole('option', { name: /Blue Lagoon/ });
    expect(lagoon.textContent).toBe('Blue LagoonBusy2 visits · last Sep 28');
    expect(
      screen
        .getByRole('option', { name: /Old quarry/ })
        .getAttribute('aria-disabled'),
    ).toBe('true');
    expect(
      screen.getByText('Not here? Type to search every station.'),
    ).toBeTruthy();
  });

  it('moves the active option with the arrow keys, focus staying in the input', () => {
    render(<Stations />);
    const box = input();
    box.focus();
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    const options = screen.getAllByRole('option');
    expect(box.getAttribute('aria-activedescendant')).toBe(options[0]!.id);
    expect(options[0]!.getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    expect(box.getAttribute('aria-activedescendant')).toBe(options[2]!.id);
    // Wraps.
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    expect(box.getAttribute('aria-activedescendant')).toBe(options[0]!.id);
    fireEvent.keyDown(box, { key: 'ArrowUp' });
    expect(box.getAttribute('aria-activedescendant')).toBe(options[2]!.id);
    expect(document.activeElement).toBe(box);
  });

  it('chooses with Enter, never a disabled option, and closes', () => {
    const onPicked = vi.fn();
    render(<Stations onPicked={onPicked} />);
    const box = input();
    fireEvent.keyDown(box, { key: 'ArrowUp' }); // the last: disabled
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(onPicked).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.keyDown(box, { key: 'ArrowDown' }); // wraps to the first
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(onPicked).toHaveBeenCalledWith('lagoon');
    expect(box.value).toBe('Blue Lagoon');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(box.getAttribute('aria-activedescendant')).toBeNull();
  });

  it('chooses with a press, keeping focus in the input', () => {
    const onPicked = vi.fn();
    render(<Stations onPicked={onPicked} />);
    const box = input();
    box.focus();
    fireEvent.click(box);
    const delta = screen.getByRole('option', { name: /Delta hide/ });
    expect(fireEvent.mouseDown(delta)).toBe(false);
    fireEvent.click(delta);
    expect(onPicked).toHaveBeenCalledWith('delta');
    fireEvent.change(box, { target: { value: 'old' } });
    fireEvent.click(screen.getByRole('option', { name: /Old quarry/ }));
    expect(onPicked).toHaveBeenCalledTimes(1);
  });

  it('filters as the person types, runs the action, and shows the empty text', () => {
    const onPress = vi.fn();
    render(<Stations action={{ label: 'Add a station', onPress }} />);
    const box = input();
    fireEvent.change(box, { target: { value: 'zz' } });
    expect(live().textContent).toBe('No station matches.');
    const action = screen.getByRole('option', { name: 'Add a station' });
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    expect(box.getAttribute('aria-activedescendant')).toBe(action.id);
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('closes on Escape, then empties on a second Escape, and on blur', () => {
    render(<Stations />);
    const box = input();
    fireEvent.change(box, { target: { value: 'del' } });
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.keyDown(box, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(box.value).toBe('del');
    fireEvent.keyDown(box, { key: 'Escape' });
    expect(box.value).toBe('');
    fireEvent.click(box);
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.blur(box);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('carries the error, description, required mark and size through Field', () => {
    render(
      <Stations
        description="As on the sign."
        error="Pick a station."
        required
        size="xs"
      />,
    );
    const box = input();
    expect(box.getAttribute('aria-invalid')).toBe('true');
    expect(box.required).toBe(true);
    expect(box.closest('.sw-field')?.className).toContain('sw-field-xs');
    expect(
      document.getElementById(box.getAttribute('aria-describedby')!)
        ?.textContent,
    ).toBe('Pick a station.');
  });

  it('stays shut while disabled', () => {
    render(<Stations disabled />);
    const box = input();
    expect(box.disabled).toBe(true);
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('keeps the active option by value when the results change under it', () => {
    const onSelect = vi.fn();
    const base: ComboboxProps = {
      emptyText: 'None',
      groups: all,
      inputValue: '',
      label: 'Station',
      onInputChange: vi.fn(),
      onSelect,
    };
    const { rerender } = render(<Combobox {...base} />);
    const box = input();
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    fireEvent.keyDown(box, { key: 'ArrowDown' }); // Delta hide
    const deltaId = box.getAttribute('aria-activedescendant');
    // New results arrive (a fetch) with Delta hide first.
    rerender(
      <Combobox
        {...base}
        groups={[
          {
            options: [
              { value: 'delta', label: 'Delta hide' },
              { value: 'marsh', label: 'Salt marsh' },
            ],
          },
        ]}
      />,
    );
    expect(box.getAttribute('aria-activedescendant')).toBe(deltaId);
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('delta');
    // When the active option leaves the results, nothing is active.
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    rerender(
      <Combobox
        {...base}
        groups={[{ options: [{ value: 'marsh', label: 'Salt marsh' }] }]}
      />,
    );
    expect(box.getAttribute('aria-activedescendant')).toBeNull();
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('ignores keys typed into an input method', () => {
    const onPicked = vi.fn();
    render(<Stations onPicked={onPicked} />);
    const box = input();
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    fireEvent.keyDown(box, { key: 'Enter', isComposing: true });
    fireEvent.keyDown(box, { key: 'Enter', keyCode: 229 });
    expect(onPicked).not.toHaveBeenCalled();
    fireEvent.keyDown(box, { key: 'Escape', keyCode: 229 });
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('announces the count and the empty text in a region always present', () => {
    render(
      <Stations
        action={undefined}
        countText={(count) => `${count} stations`}
        listLabel="Stations"
      />,
    );
    const box = input();
    expect(live().getAttribute('aria-live')).toBe('polite');
    expect(live().textContent).toBe('');
    fireEvent.click(box);
    expect(screen.getByRole('listbox', { name: 'Stations' })).toBeTruthy();
    expect(live().textContent).toBe('3 stations');
    fireEvent.change(box, { target: { value: 'zz' } });
    expect(live().textContent).toBe('No station matches.');
    // The visible empty text is hidden from the reader, so it is read once.
    expect(
      screen
        .getByText('No station matches.', { selector: '.sw-combobox-empty' })
        .getAttribute('aria-hidden'),
    ).toBe('true');
    // The list is gone (no options, no action), so it is not expanded.
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(box.getAttribute('aria-expanded')).toBe('false');
    fireEvent.keyDown(box, { key: 'Escape' });
    expect(live().textContent).toBe('');
  });

  it('describes the input by the note while the list is open', () => {
    render(<Stations />);
    const box = input();
    expect(box.getAttribute('aria-describedby')).toBeNull();
    fireEvent.click(box);
    expect(
      document.getElementById(box.getAttribute('aria-describedby')!)
        ?.textContent,
    ).toBe('Not here? Type to search every station.');
  });

  it('opens with Alt+ArrowDown without moving, and closes with Alt+ArrowUp or Tab', () => {
    render(<Stations />);
    const box = input();
    box.focus();
    fireEvent.keyDown(box, { key: 'ArrowDown', altKey: true });
    expect(screen.getByRole('listbox')).toBeTruthy();
    expect(box.getAttribute('aria-activedescendant')).toBeNull();
    fireEvent.keyDown(box, { key: 'ArrowUp', altKey: true });
    expect(screen.queryByRole('listbox')).toBeNull();
    fireEvent.click(box);
    // Tab moves focus on, and the blur closes the list.
    fireEvent.keyDown(box, { key: 'Tab' });
    fireEvent.blur(box);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('moves the active option with the pointer', () => {
    render(<Stations />);
    const box = input();
    fireEvent.click(box);
    const delta = screen.getByRole('option', { name: /Delta hide/ });
    fireEvent.mouseMove(delta);
    expect(box.getAttribute('aria-activedescendant')).toBe(delta.id);
  });

  it('closes for good when disabled while open', () => {
    const base: ComboboxProps = {
      emptyText: 'None',
      groups: all,
      inputValue: '',
      label: 'Station',
      onInputChange: vi.fn(),
      onSelect: vi.fn(),
    };
    const { rerender } = render(<Combobox {...base} />);
    fireEvent.click(input());
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeTruthy();
    rerender(<Combobox {...base} disabled />);
    expect(screen.queryByRole('listbox')).toBeNull();
    rerender(<Combobox {...base} />);
    expect(screen.queryByRole('listbox')).toBeNull();
    // Reopened, it starts with no active option.
    fireEvent.click(input());
    expect(screen.getByRole('listbox')).toBeTruthy();
    expect(input().getAttribute('aria-activedescendant')).toBeNull();
  });

  it('lists ungrouped options, alone or beside a named group', () => {
    const base: ComboboxProps = {
      emptyText: 'None',
      groups: [{ options: [{ value: 'a', label: 'Alder' }] }],
      inputValue: '',
      label: 'Station',
      onInputChange: vi.fn(),
      onSelect: vi.fn(),
    };
    const { rerender } = render(<Combobox {...base} />);
    fireEvent.click(input());
    expect(screen.queryByRole('group')).toBeNull();
    expect(screen.getAllByRole('option')).toHaveLength(1);
    rerender(
      <Combobox
        {...base}
        groups={[
          { options: [{ value: 'a', label: 'Alder' }] },
          { label: 'More', options: [{ value: 'b', label: 'Birch' }] },
        ]}
      />,
    );
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByRole('group', { name: 'More' }).textContent).toContain(
      'Birch',
    );
  });

  it('closes its list on Escape inside a Dialog, leaving the dialog open', () => {
    const onClose = vi.fn();
    function InDialog({ children }: { children: ReactNode }) {
      return (
        <Dialog onClose={onClose} open title="Log a visit">
          {children}
        </Dialog>
      );
    }
    render(
      <InDialog>
        <Stations />
      </InDialog>,
    );
    const box = input();
    fireEvent.click(box);
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.keyDown(box, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Log a visit' })).toBeTruthy();
  });

  it('fails closed on blank words, duplicates, unknown sizes or tones', () => {
    const base: ComboboxProps = {
      emptyText: 'None',
      groups: all,
      inputValue: '',
      label: 'Station',
      onInputChange: vi.fn(),
      onSelect: vi.fn(),
    };
    expect(comboboxSizes).toEqual(['md', 'xs']);
    for (const broken of [
      { label: ' ' },
      { emptyText: '' },
      { size: 'lg' as 'md' },
      { groups: [{ label: ' ', options: [] }] },
      {
        groups: [
          {
            options: [
              { value: 'a', label: 'A' },
              { value: 'a', label: 'B' },
            ],
          },
        ],
      },
      { groups: [{ options: [{ value: 'a', label: ' ' }] }] },
      {
        groups: [
          {
            options: [
              {
                value: 'a',
                label: 'A',
                badge: { label: 'x', tone: 'pink' as 'danger' },
              },
            ],
          },
        ],
      },
      { action: { label: ' ', onPress: vi.fn() } },
      { listLabel: ' ' },
    ])
      expect(() => render(<Combobox {...base} {...broken} />)).toThrow(
        RangeError,
      );
    expect(() =>
      render(
        <Combobox
          {...base}
          action={{ label: 'Add', onPress: undefined as unknown as () => void }}
        />,
      ),
    ).toThrow(TypeError);
  });
});

describe('Combobox CSS', () => {
  const css = generateStylesheet();

  it('puts the list on the popup layer and lists its classes', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-combobox-popup',
        'sw-combobox-option',
        'sw-combobox-heading',
        'sw-combobox-action',
      ]),
    );
    expect(css).toMatch(/\.sw-combobox-popup \{[^}]*z-index: 10;/);
    expect(css).toMatch(
      /prefers-reduced-transparency: reduce\) \{[^}]*\.sw-combobox-popup,/,
    );
    expect(css).toMatch(
      /forced-colors: active\) \{[^@]*\.sw-combobox-option\[aria-selected='true'\] \{ background: Highlight; color: HighlightText; forced-color-adjust: none; \}/,
    );
    expect(css).toMatch(
      /\.sw-combobox-option \+ \.sw-combobox-option \{\s*border-top: 1px solid var\(--sw-color-border\);/,
    );
  });
});
