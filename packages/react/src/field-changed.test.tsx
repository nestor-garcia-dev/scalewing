import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Field } from './components/Field.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

/** The Field's own classes, without the Stack's layout ones. */
function fieldOf(input: HTMLElement): { className: string } {
  const field = input.closest('.sw-field') as HTMLElement;
  return {
    className: [...field.classList]
      .filter((name) => name.startsWith('sw-field'))
      .join(' '),
  };
}

describe('Field changed', () => {
  it('marks a changed value with its own class and says what it was', () => {
    render(
      <Field changed description="Was 25" label="$20 bills">
        <input defaultValue="26" />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: '$20 bills' });
    expect(fieldOf(input).className).toBe('sw-field sw-field-changed');
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(
      document.getElementById(input.getAttribute('aria-describedby') ?? '')
        ?.textContent,
    ).toBe('Was 25');
  });

  it('marks an adorned frame, and adds nothing when unchanged', () => {
    render(
      <>
        <Field changed label="Sales" prefix="$">
          <input defaultValue="480.00" />
        </Field>
        <Field changed={false} label="Taxes" prefix="$">
          <input defaultValue="30.00" />
        </Field>
      </>,
    );
    expect(
      fieldOf(screen.getByRole('textbox', { name: 'Sales $' })).className,
    ).toBe('sw-field sw-field-changed');
    expect(
      fieldOf(screen.getByRole('textbox', { name: 'Taxes $' })).className,
    ).toBe('sw-field');
  });

  it('lets invalid and error win over changed', () => {
    render(
      <>
        <Field changed invalid label="Count">
          <input />
        </Field>
        <Field changed error="Enter a whole number" label="Rolls">
          <input />
        </Field>
      </>,
    );
    for (const name of ['Count', 'Rolls'])
      expect(fieldOf(screen.getByRole('textbox', { name })).className).toBe(
        'sw-field sw-field-invalid',
      );
  });

  it('requires a native control once passed, even false, but not undefined', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      expect(() =>
        render(
          <Field changed={false} label="Composed">
            <span>not a control</span>
          </Field>,
        ),
      ).toThrow(TypeError);
      expect(() =>
        render(
          <Field changed={undefined} label="Composed">
            <span>not a control</span>
          </Field>,
        ),
      ).not.toThrow();
    } finally {
      consoleError.mockRestore();
    }
  });

  it('generates the accent border, thicker without moving, and forced colors', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '[data-theme] .sw-field-changed > :is(input, select, textarea),\n.sw-field-changed .sw-field-adorned {\n  border-color: var(--sw-color-accent);\n  box-shadow: inset 0 0 0 1px var(--sw-color-accent);\n}',
    );
    expect(css).toContain(
      '.sw-field-changed .sw-field-adorned { border-color: Highlight; box-shadow: inset 0 0 0 1px Highlight; }',
    );
    expect(utilityClassCatalog()).toContain('sw-field-changed');
  });
});
