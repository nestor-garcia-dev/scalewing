import { cleanup, render, screen } from '@testing-library/react';
import { type ReactElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Checkbox } from './components/Checkbox.js';
import { DateField } from './components/DateField.js';
import { Field } from './components/Field.js';
import { RadioGroup } from './components/RadioGroup.js';

afterEach(() => cleanup());

const noop = vi.fn();
const habitats = [
  { value: 'forest', label: 'Forest' },
  { value: 'ocean', label: 'Ocean' },
];

/**
 * Every field control keeps its error in a polite live region that exists,
 * empty, before the error, so the error is announced once when its text is
 * swapped in, while typing or after a submit, and never as an alert (review
 * of PR #73: without a live region, errors shown while typing were silent).
 */
const controls: Array<{
  name: string;
  region: string;
  render: (error?: string) => ReactElement;
  control: () => HTMLElement;
}> = [
  {
    name: 'Field',
    region: '.sw-field-error',
    render: (error) => (
      <Field error={error} label="Reference">
        <input name="reference" />
      </Field>
    ),
    control: () => screen.getByRole('textbox', { name: 'Reference' }),
  },
  {
    name: 'Checkbox',
    region: '.sw-checkbox-error',
    render: (error) => (
      <Checkbox
        checked={false}
        error={error}
        label="Recounted"
        onCheckedChange={noop}
      />
    ),
    control: () => screen.getByRole('checkbox', { name: 'Recounted' }),
  },
  {
    name: 'RadioGroup',
    region: '.sw-radio-group-error',
    render: (error) => (
      <RadioGroup
        error={error}
        legend="Habitat"
        onChange={noop}
        options={habitats}
        value=""
      />
    ),
    control: () => screen.getByRole('group', { name: 'Habitat' }),
  },
  {
    name: 'DateField',
    region: '.sw-date-field-error:last-of-type',
    render: (error) => (
      <DateField error={error} label="Date reported" onChange={noop} value="" />
    ),
    control: () => screen.getByRole('textbox', { name: 'Date reported' }),
  },
];

describe('field error regions', () => {
  it.each(controls)(
    '$name keeps an empty polite region and swaps the error into it',
    ({ region: selector, render: view, control }) => {
      const { container, rerender } = render(view());
      const region = container.querySelector<HTMLElement>(selector);
      expect(region).not.toBeNull();
      expect(region!.getAttribute('aria-live')).toBe('polite');
      expect(region!.textContent).toBe('');
      expect(control().getAttribute('aria-describedby') ?? '').not.toContain(
        region!.id,
      );

      rerender(view('Enter at most 20 characters.'));
      // The same element: only its text changed, which is what is announced.
      expect(container.querySelector(selector)).toBe(region);
      expect(region!.textContent).toBe('Enter at most 20 characters.');
      expect(control().getAttribute('aria-describedby')).toContain(region!.id);
      expect(control().getAttribute('aria-invalid')).toBe('true');
      expect(screen.queryByRole('alert')).toBeNull();

      rerender(view());
      expect(region!.textContent).toBe('');
    },
  );
});
