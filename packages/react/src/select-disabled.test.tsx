import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Select, type SelectProps } from './components/Select.js';
import { cssSelectClasses } from './css/css-select.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const options = [
  { value: 'otter', label: 'Otter' },
  { value: 'heron', label: 'Heron' },
];

function select(props: Partial<SelectProps> = {}) {
  return (
    <Select
      label="Species"
      onChange={() => {}}
      options={options}
      value="otter"
      {...props}
    />
  );
}

describe('Select disabled', () => {
  it('is a native disabled trigger, out of the Tab order and read as dimmed', () => {
    render(select({ disabled: true }));
    const trigger = screen.getByRole('combobox', { name: 'Species' });
    expect((trigger as HTMLButtonElement).disabled).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens no list and never calls onChange', () => {
    const onChange = vi.fn();
    render(select({ disabled: true, onChange }));
    const trigger = screen.getByRole('combobox', { name: 'Species' });
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'h' });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('closes an open list when it is turned off', () => {
    const view = render(select());
    fireEvent.click(screen.getByRole('combobox', { name: 'Species' }));
    expect(screen.getByRole('listbox')).toBeTruthy();
    view.rerender(select({ disabled: true }));
    expect(screen.queryByRole('listbox')).toBeNull();
    view.rerender(select({ disabled: false }));
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('stays on by default', () => {
    render(select());
    const trigger = screen.getByRole('combobox', { name: 'Species' });
    expect((trigger as HTMLButtonElement).disabled).toBe(false);
  });

  it('fades as a disabled Button and greys in forced colours', () => {
    const css = cssSelectClasses();
    expect(css).toContain(`.sw-select-trigger:disabled {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}`);
    expect(css).toContain(
      '.sw-select-trigger:disabled { border-color: GrayText; color: GrayText; }',
    );
    expect(css).toContain(
      '.sw-select-trigger:disabled::after { border-color: GrayText; }',
    );
  });
});
