import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Combobox } from './components/Combobox.js';
import { DateField } from './components/DateField.js';
import { Field } from './components/Field.js';
import { type RequiredMark } from './components/FieldLabelText.js';
import { FilterChips } from './components/FilterChips.js';
import { Select } from './components/Select.js';

afterEach(() => cleanup());

const marks = () => document.querySelectorAll('.sw-field-required');

function everyControl(requiredMark?: RequiredMark) {
  return render(
    <>
      <Field label="Name" required requiredMark={requiredMark}>
        <input />
      </Field>
      <Select
        label="Habitat"
        onChange={vi.fn()}
        options={[{ value: 'reed', label: 'Reed bed' }]}
        required
        requiredMark={requiredMark}
        value=""
      />
      <DateField
        label="Survey day"
        onChange={vi.fn()}
        required
        requiredMark={requiredMark}
        today="2026-10-11"
        value=""
      />
      <Combobox
        emptyText="Nothing matches"
        groups={[]}
        inputValue=""
        label="Colony"
        onInputChange={vi.fn()}
        onSelect={vi.fn()}
        required
        requiredMark={requiredMark}
      />
      <FilterChips
        label="Why"
        onChange={vi.fn()}
        options={[{ value: 'wrong', label: 'Wrong count' }]}
        required
        requiredMark={requiredMark}
        value=""
      />
    </>,
  );
}

describe('requiredMark', () => {
  it('draws the mark on every required control by default', () => {
    everyControl();
    expect(marks()).toHaveLength(5);
  });

  it('hides the mark while each control stays required', () => {
    everyControl('hidden');
    expect(marks()).toHaveLength(0);
    expect(
      (screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement)
        .required,
    ).toBe(true);
    expect(
      screen
        .getByRole('combobox', { name: 'Habitat' })
        .getAttribute('aria-required'),
    ).toBe('true');
    expect(
      (screen.getByRole('combobox', { name: 'Colony' }) as HTMLInputElement)
        .required,
    ).toBe(true);
    expect(
      (
        document.querySelector(
          '.sw-date-field input[type="text"]',
        ) as HTMLInputElement
      ).required,
    ).toBe(true);
    expect(
      (screen.getByRole('radio', { name: /Wrong count/ }) as HTMLInputElement)
        .required,
    ).toBe(true);
    // The names carry no mark either way: it was always aria-hidden.
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeTruthy();
  });

  it('fails closed on an unknown value on every control', () => {
    const quiet = 'quiet' as RequiredMark;
    expect(() =>
      render(
        <Select
          label="Habitat"
          onChange={vi.fn()}
          options={[{ value: 'reed', label: 'Reed bed' }]}
          requiredMark={quiet}
          value=""
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <DateField
          label="Survey day"
          onChange={vi.fn()}
          requiredMark={quiet}
          today="2026-10-11"
          value=""
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <Combobox
          emptyText="Nothing matches"
          groups={[]}
          inputValue=""
          label="Colony"
          onInputChange={vi.fn()}
          onSelect={vi.fn()}
          requiredMark={quiet}
        />,
      ),
    ).toThrow(RangeError);
  });

  it('fails closed on an unknown value on Field and FilterChips', () => {
    expect(() =>
      render(
        <Field label="Name" required requiredMark={'quiet' as RequiredMark}>
          <input />
        </Field>,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <FilterChips
          label="Why"
          onChange={vi.fn()}
          options={[{ value: 'wrong', label: 'Wrong count' }]}
          requiredMark={'quiet' as RequiredMark}
          value=""
        />,
      ),
    ).toThrow(RangeError);
  });
});
