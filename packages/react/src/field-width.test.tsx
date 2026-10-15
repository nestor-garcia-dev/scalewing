import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Field } from './components/Field.js';
import { typedInputs } from './css/css-document.js';
import { fieldWidths } from './css/css-field-width.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function fieldOf(control: HTMLElement): HTMLElement {
  return control.closest('.sw-field') as HTMLElement;
}

describe('Field width', () => {
  it('fills the column by default and caps the control on request', () => {
    render(
      <>
        <Field label="Den name">
          <input defaultValue="" />
        </Field>
        <Field label="Rate" suffix="%" width="sm">
          <input defaultValue="2.00" />
        </Field>
        <Field label="Habitat" width="lg">
          <select defaultValue="forest">
            <option value="forest">Forest</option>
          </select>
        </Field>
      </>,
    );
    const plain = fieldOf(screen.getByRole('textbox', { name: 'Den name' }));
    expect(plain.classList.contains('sw-field-sized')).toBe(false);
    const rate = screen.getByRole('textbox', { name: 'Rate %' });
    expect(fieldOf(rate).classList).toContain('sw-field-sized');
    expect(fieldOf(rate).classList).toContain('sw-field-width-sm');
    // The label and the control keep their names and order.
    expect(rate).toHaveProperty('value', '2.00');
    expect(
      fieldOf(screen.getByRole('combobox', { name: 'Habitat' })).classList,
    ).toContain('sw-field-width-lg');
    expect(fieldWidths).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
  });

  it('refuses an unknown width', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <Field label="Rate" width={'tiny' as never}>
          <input />
        </Field>,
      ),
    ).toThrow('Unknown Field width: tiny');
  });

  it('needs one native control to cap', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <Field label="Rate" width="sm">
          <span>2.00</span>
        </Field>,
      ),
    ).toThrow(
      'Field validation, adornments and width require one native input, select, or textarea child',
    );
  });

  it('caps only the control at the Table column sizes, never past the column', () => {
    const css = generateStylesheet();
    expect(css).toContain('.sw-field-width-xs { --sw-field-width: 4rem; }');
    expect(css).toContain('.sw-field-width-xl { --sw-field-width: 16rem; }');
    expect(css).toContain(
      `.sw-field-sized > :is(${typedInputs}, select, .sw-field-adorned, .sw-field-search) {\n  align-self: flex-start;\n  box-sizing: border-box;\n  inline-size: min(100%, var(--sw-field-width));\n  max-inline-size: 100%;\n}`,
    );
    expect(css).toContain(
      '[data-theme] .sw-field-sized > select {\n  height: var(--sw-control-md-min-height);\n}',
    );
    expect(css).toContain(
      '[data-theme] .sw-field-xs.sw-field-sized > select {\n  height: var(--sw-control-xs-min-height);\n}',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-field-sized', 'sw-field-width-md']),
    );
  });
});
