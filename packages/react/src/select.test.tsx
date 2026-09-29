import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Field } from './components/Field.js';
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
  it('shows a placeholder that is not an option until a value is chosen', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Select
        label="Reason"
        onChange={onChange}
        options={habitats}
        placeholder="Choose a habitat"
        value=""
      />,
    );
    const trigger = screen.getByRole('combobox', { name: 'Reason' });
    expect(trigger.textContent).toBe('Choose a habitat');
    const text = trigger.querySelector('.sw-select-value-text');
    expect(text?.className).toContain('sw-select-placeholder');
    // The placeholder also sizes the trigger, so choosing does not resize it.
    expect(
      [...trigger.querySelectorAll('.sw-select-value-sizer')].map((sizer) =>
        sizer.getAttribute('data-label'),
      ),
    ).toEqual(['Forest', 'Savanna', 'Ocean', 'Choose a habitat']);
    fireEvent.click(trigger);
    expect(
      screen.getAllByRole('option').map((option) => option.textContent),
    ).toEqual(['Forest', 'Savanna', 'Ocean']);
    expect(
      screen
        .getAllByRole('option')
        .some((option) => option.getAttribute('aria-selected') === 'true'),
    ).toBe(false);
    fireEvent.click(screen.getByRole('option', { name: 'Savanna' }));
    expect(onChange).toHaveBeenCalledWith('savanna');
    rerender(
      <Select
        label="Reason"
        onChange={onChange}
        options={habitats}
        placeholder="Choose a habitat"
        value="savanna"
      />,
    );
    expect(trigger.textContent).toBe('Savanna');
    expect(
      trigger.querySelector('.sw-select-value-text')?.className,
    ).not.toContain('sw-select-placeholder');
  });

  it('marks a required select and wires its error as Field does', () => {
    const { container, rerender } = render(
      <Select
        label="Reason"
        onChange={vi.fn()}
        options={habitats}
        placeholder="Choose a habitat"
        value=""
      />,
    );
    // The polite region exists, empty, before the error (review of PR #73).
    const region = container.querySelector('.sw-field-error');
    expect(region?.getAttribute('aria-live')).toBe('polite');
    expect(region?.textContent).toBe('');
    rerender(
      <Select
        error="Choose a reason."
        label="Reason"
        onChange={vi.fn()}
        options={habitats}
        placeholder="Choose a habitat"
        required
        value=""
      />,
    );
    const trigger = screen.getByRole('combobox', {
      name: 'Reason',
      description: 'Choose a reason.',
    });
    expect(trigger.getAttribute('aria-required')).toBe('true');
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    const mark = screen.getByText('*');
    expect(mark.className).toBe('sw-field-required');
    expect(mark.getAttribute('aria-hidden')).toBe('true');
    const message = screen.getByText('Choose a reason.');
    expect(message).toBe(region);
    expect(message.className).toBe('sw-field-error');
    expect(trigger.getAttribute('aria-describedby')).toBe(message.id);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(trigger.closest('.sw-select')?.className).toContain(
      'sw-select-invalid',
    );
    rerender(
      <Select
        error=""
        label="Reason"
        onChange={vi.fn()}
        options={habitats}
        value="forest"
      />,
    );
    expect(trigger.getAttribute('aria-invalid')).toBeNull();
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
    expect(trigger.getAttribute('aria-required')).toBeNull();
    expect(trigger.closest('.sw-select')?.className).not.toContain(
      'sw-select-invalid',
    );
  });

  it('rejects a blank placeholder', () => {
    expect(() =>
      render(
        <Select
          label="Reason"
          onChange={vi.fn()}
          options={habitats}
          placeholder=" "
          value=""
        />,
      ),
    ).toThrow(RangeError);
  });

  it('sizes the closed trigger to its longest option without adding text', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Select
          label="Watch range"
          onChange={vi.fn()}
          options={habitats}
          value="ocean"
        />
      </ThemeProvider>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Watch range' });
    // Only the current label is text; every option's label is a hidden
    // sizer drawn from data-label by CSS (Teisoro DRW-12).
    expect(trigger.textContent).toBe('Ocean');
    const sizers = trigger.querySelectorAll('.sw-select-value-sizer');
    expect(
      [...sizers].map((sizer) => sizer.getAttribute('data-label')),
    ).toEqual(['Forest', 'Savanna', 'Ocean']);
    for (const sizer of sizers)
      expect(sizer.getAttribute('aria-hidden')).toBe('true');
    expect(trigger.querySelector('.sw-select-value-text')?.textContent).toBe(
      'Ocean',
    );
  });

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

describe('Select label row', () => {
  it("draws its label as Field's, so the two line up side by side", () => {
    render(
      <>
        <Field label="Observers" required>
          <input name="observers" />
        </Field>
        <Select
          label="Survey habitat"
          onChange={() => undefined}
          options={habitats}
          required
          value="forest"
        />
      </>,
    );
    const fieldLabel = screen.getByText('Observers').closest('label')!;
    const selectLabel = screen.getByText('Survey habitat').closest('label')!;
    // The same words span and mark inside a label that keeps the canvas
    // type, so both label rows are the same height (the Select's was 5 px
    // shorter, as DateField's was in Teisoro NSF-35).
    expect(selectLabel.innerHTML).toBe(
      fieldLabel.innerHTML.replace('Observers', 'Survey habitat'),
    );
    expect(selectLabel.className).toBe('');
    const trigger = screen.getByRole('combobox', { name: 'Survey habitat' });
    expect(trigger.getAttribute('aria-labelledby')).toBe(selectLabel.id);
    expect(selectLabel.htmlFor).toBe(trigger.id);
  });
});
