import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Select } from './components/Select.js';
import { ThemeProvider } from './theme/ThemeProvider.js';
import {
  nextSelectIndex,
  selectIndexForKey,
  selectedSelectIndex,
} from './select-list.js';

afterEach(() => {
  cleanup();
});

const habitats = [
  { value: 'forest', label: 'Forest' },
  { value: 'savanna', label: 'Savanna' },
  { value: 'ocean', label: 'Ocean' },
] as const;

describe('select list helpers', () => {
  it('clamps highlight movement and maps keys', () => {
    expect(selectedSelectIndex(habitats, 'ocean')).toBe(2);
    expect(selectedSelectIndex(habitats, 'missing')).toBe(0);
    expect(nextSelectIndex(0, -1, 3)).toBe(0);
    expect(nextSelectIndex(2, 1, 3)).toBe(2);
    expect(selectIndexForKey('ArrowDown', 0, 3)).toBe(1);
    expect(selectIndexForKey('Home', 2, 3)).toBe(0);
    expect(selectIndexForKey('End', 0, 3)).toBe(2);
    expect(selectIndexForKey('Tab', 1, 3)).toBeNull();
  });
});

describe('Select', () => {
  it('opens a labeled glass listbox and commits a choice', () => {
    const onChange = vi.fn();
    render(
      <ThemeProvider colorScheme="light">
        <Select
          label="Watch range"
          onChange={onChange}
          options={habitats}
          value="forest"
        />
      </ThemeProvider>,
    );

    const trigger = screen.getByRole('combobox', { name: 'Watch range' });
    expect(trigger.className).toContain('sw-select-trigger');
    expect(trigger).toHaveProperty('textContent', 'Forest');
    expect(screen.queryByRole('listbox')).toBeNull();

    fireEvent.click(trigger);
    const list = screen.getByRole('listbox', { name: 'Watch range' });
    expect(list.className).toContain('sw-select-list');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const savanna = screen.getByRole('option', { name: 'Savanna' });
    expect(
      screen
        .getByRole('option', { name: 'Forest' })
        .getAttribute('aria-selected'),
    ).toBe('true');
    fireEvent.pointerDown(savanna);
    fireEvent.click(savanna);
    expect(onChange).toHaveBeenCalledWith('savanna');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('compacts toolbar chrome and closes on Escape', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Select
          label="Compact range"
          labelVisuallyHidden
          onChange={() => undefined}
          options={habitats}
          size="xs"
          value="savanna"
        />
      </ThemeProvider>,
    );

    const trigger = screen.getByRole('combobox', { name: 'Compact range' });
    expect(trigger.closest('.sw-select')?.className).toContain('sw-select-xs');
    expect(screen.getByText('Compact range').className).toContain('sw-sr-only');

    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('moves the active option with arrows and commits with Enter', () => {
    const onChange = vi.fn();
    render(
      <ThemeProvider colorScheme="light">
        <Select
          label="Watch range"
          onChange={onChange}
          options={habitats}
          value="forest"
        />
      </ThemeProvider>,
    );

    const trigger = screen.getByRole('combobox', { name: 'Watch range' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(
      screen
        .getByRole('option', { name: 'Savanna' })
        .getAttribute('data-active'),
    ).toBe('true');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('savanna');
  });

  it('runs a trailing action without changing the value', () => {
    const onChange = vi.fn();
    const onPress = vi.fn();

    render(
      <ThemeProvider colorScheme="light">
        <Select
          action={{ label: 'Log a visit', onPress }}
          label="Watch range"
          onChange={onChange}
          options={habitats}
          value="forest"
        />
      </ThemeProvider>,
    );

    const trigger = screen.getByRole('combobox', { name: 'Watch range' });
    fireEvent.click(trigger);
    const command = screen.getByRole('option', { name: 'Log a visit' });
    expect(command.className).toContain('sw-select-action');
    expect(command.getAttribute('aria-selected')).toBe('false');
    fireEvent.pointerDown(command);
    fireEvent.click(command);
    expect(onPress).toHaveBeenCalledOnce();
    expect(onChange).not.toHaveBeenCalled();
    expect(trigger).toHaveProperty('textContent', 'Forest');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('commits the trailing action with End then Enter', () => {
    const onChange = vi.fn();
    const onPress = vi.fn();

    render(
      <ThemeProvider colorScheme="light">
        <Select
          action={{ label: 'Log a visit', onPress }}
          label="Watch range"
          onChange={onChange}
          options={habitats}
          value="forest"
        />
      </ThemeProvider>,
    );

    const trigger = screen.getByRole('combobox', { name: 'Watch range' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'End' });
    expect(
      screen
        .getByRole('option', { name: 'Log a visit' })
        .getAttribute('data-active'),
    ).toBe('true');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onPress).toHaveBeenCalledOnce();
    expect(onChange).not.toHaveBeenCalled();
  });
});
