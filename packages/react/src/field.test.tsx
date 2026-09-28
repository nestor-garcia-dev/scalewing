import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Field } from './components/Field.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

afterEach(() => cleanup());

describe('Field', () => {
  it('associates a wrapping label with a native control using token gap', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Field label="Scoring">
          <select>
            <option>PPR</option>
          </select>
        </Field>
      </ThemeProvider>,
    );

    const control = screen.getByLabelText('Scoring');
    expect(control.tagName).toBe('SELECT');

    const field = control.closest('.sw-field');
    expect(field?.className).toContain('sw-stack');
    expect(field?.className).toContain('sw-gap-1');
    expect(field?.querySelector('label')?.htmlFor).toBe(control.id);
  });

  it('compacts native controls and can hide the visible label', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Field label="League" labelVisuallyHidden size="xs">
          <select>
            <option>My league</option>
          </select>
        </Field>
      </ThemeProvider>,
    );

    const control = screen.getByLabelText('League');
    const field = control.closest('.sw-field');
    expect(field?.className).toContain('sw-field-xs');
    expect(screen.getByText('League').className).toContain('sw-sr-only');
  });
  it('associates a stable hint ID, required input, and existing descriptions', () => {
    const { rerender } = render(
      <Field
        description="Use the code on the sighting card"
        label="Sighting code"
        required
      >
        <input aria-describedby="external-note" name="sighting-code" />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Sighting code' });
    const hint = screen.getByText('Use the code on the sighting card');
    const id = hint.id;
    expect(id).toBeTruthy();
    expect(input.getAttribute('aria-describedby')).toBe(`external-note ${id}`);
    expect(input).toHaveProperty('required', true);
    expect(screen.getByText('*').getAttribute('aria-hidden')).toBe('true');
    rerender(
      <Field
        description="Use the code on the sighting card"
        error="A code is required"
        label="Sighting code"
        required
      >
        <input aria-describedby="external-note" name="sighting-code" />
      </Field>,
    );
    expect(screen.queryByText('Use the code on the sighting card')).toBeNull();
    expect(screen.getByRole('alert').id).toBe(id);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.closest('.sw-field')?.className).toContain('sw-field-invalid');
    rerender(
      <Field
        description="Use the code on the sighting card"
        label="Sighting code"
        required
      >
        <input aria-describedby="external-note" name="sighting-code" />
      </Field>,
    );
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText('Use the code on the sighting card').id).toBe(id);
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.closest('.sw-field')?.className).not.toContain(
      'sw-field-invalid',
    );
  });

  it('keeps IDs distinct across fields and preserves existing child semantics', () => {
    render(
      <>
        <Field description="First hint" label="First">
          <input aria-invalid="true" />
        </Field>
        <Field description="Second hint" label="Second">
          <textarea />
        </Field>
      </>,
    );
    const first = screen.getByRole('textbox', { name: 'First' });
    const second = screen.getByRole('textbox', { name: 'Second' });
    expect(first.getAttribute('aria-describedby')).not.toBe(
      second.getAttribute('aria-describedby'),
    );
    expect(first.getAttribute('aria-invalid')).toBe('true');
    expect(second.closest('.sw-field')?.querySelector('label')?.htmlFor).toBe(
      second.id,
    );
  });

  it('keeps an optional control mounted as an error appears and clears', () => {
    const { rerender } = render(
      <Field label="Optional code">
        <input />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Optional code' });
    rerender(
      <Field error="Invalid code" label="Optional code">
        <input />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'Optional code' })).toBe(input);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    rerender(
      <Field label="Optional code">
        <input />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'Optional code' })).toBe(input);
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('rejects a non-native or multiple validation children', () => {
    expect(() =>
      render(
        <Field description="Help" label="Code">
          <span>not a control</span>
        </Field>,
      ),
    ).toThrow(TypeError);
    expect(() =>
      render(
        <Field error="Invalid" label="Code">
          <input />
          <input />
        </Field>,
      ),
    ).toThrow(TypeError);
  });

  it('names an adorned input with its label, prefix, and suffix', () => {
    render(
      <Field label="Drop amount" prefix="$" suffix="USD">
        <input inputMode="decimal" name="drop-amount" />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Drop amount $ USD' });
    const frame = input.parentElement;
    expect(frame?.className).toBe('sw-field-adorned');
    const prefix = frame?.querySelector('.sw-field-prefix');
    const suffix = frame?.querySelector('.sw-field-suffix');
    expect(prefix?.textContent).toBe('$');
    expect(suffix?.textContent).toBe('USD');
    expect(prefix?.getAttribute('aria-hidden')).toBe('true');
    expect(suffix?.getAttribute('aria-hidden')).toBe('true');
    expect(frame?.firstElementChild).toBe(prefix);
    expect(frame?.lastElementChild).toBe(suffix);
    const label = input.closest('.sw-field')?.querySelector('label');
    expect(input.getAttribute('aria-labelledby')).toBe(
      `${label?.id} ${prefix?.id} ${suffix?.id}`,
    );
    expect(label?.htmlFor).toBe(input.id);
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('keeps a lone suffix, validation, and an own aria-labelledby', () => {
    const { rerender } = render(
      <Field error="Enter a rate" label="Tax rate" required suffix="%">
        <input name="tax-rate" />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Tax rate %' });
    expect(input.parentElement?.querySelector('.sw-field-prefix')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(
      screen.getByRole('alert').id,
    );
    expect(input).toHaveProperty('required', true);
    expect(input.closest('.sw-field')?.className).toContain('sw-field-invalid');
    rerender(
      <>
        <span id="own-name">Rate</span>
        <Field label="Tax rate" suffix="%">
          <input aria-labelledby="own-name" name="tax-rate" />
        </Field>
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'Rate' })).toBeTruthy();
  });

  it('leaves an unadorned control unwrapped and unlabelled by id', () => {
    render(
      <Field label="Species name">
        <input name="species" />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Species name' });
    expect(input.getAttribute('aria-labelledby')).toBeNull();
    expect(input.parentElement?.className).toContain('sw-field');
  });

  it('rejects an adornment on a control that is not a native input', () => {
    expect(() =>
      render(
        <Field label="Habitat" prefix="#">
          <select>
            <option>Forest</option>
          </select>
        </Field>,
      ),
    ).toThrow('Field prefix and suffix require a native input child');
    expect(() =>
      render(
        <Field label="Weight" suffix="kg">
          <span>not a control</span>
        </Field>,
      ),
    ).toThrow(TypeError);
  });

  it('generates the adornment frame from the control surface tokens', () => {
    const css = generateStylesheet();
    const catalog = utilityClassCatalog();
    for (const className of [
      'sw-field-adorned',
      'sw-field-prefix',
      'sw-field-suffix',
    ]) {
      expect(css).toContain(`.${className}`);
      expect(catalog).toContain(className);
    }
    expect(css).toContain('[data-theme] .sw-field-adorned > input {');
    expect(css).toContain('.sw-field-adorned:focus-within {');
    expect(css).toContain(
      '.sw-field-invalid .sw-field-adorned { border-color: var(--sw-color-danger); }',
    );
    expect(css).toContain('.sw-field-xs .sw-field-adorned {');
    expect(css).not.toMatch(
      /sw-field-(prefix|suffix|adorned)[^}]*#[0-9a-f]{3}/i,
    );
  });
});
