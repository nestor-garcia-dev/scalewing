import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DateField } from './components/DateField.js';

afterEach(() => cleanup());

describe('DateField', () => {
  it('labels and describes a controlled date-only input', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <DateField
        description="Use the local calendar date"
        label="Sighting date"
        max="2024-12-31"
        min="2024-01-01"
        onChange={onChange}
        required
        value="2024-03-10"
      />,
    );
    const input = screen.getByLabelText('Sighting date');
    expect(input).toHaveProperty('type', 'date');
    expect(input).toHaveProperty('value', '2024-03-10');
    expect(input).toHaveProperty('required', true);
    expect(input.getAttribute('min')).toBe('2024-01-01');
    expect(input.getAttribute('max')).toBe('2024-12-31');
    const descriptionId = input.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(descriptionId)?.textContent).toBe(
      'Use the local calendar date',
    );
    fireEvent.change(input, { target: { value: '2024-11-03' } });
    expect(onChange).toHaveBeenCalledExactlyOnceWith('2024-11-03');
    rerender(
      <DateField
        label="Sighting date"
        onChange={onChange}
        value="2024-11-03"
      />,
    );
    expect(input).toHaveProperty('value', '2024-11-03');
  });

  it('surfaces range and supplied errors, and rejects invalid inputs', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <DateField
        description="Use the local calendar date"
        error="Choose a later date"
        label="Sighting date"
        min="2024-03-10"
        onChange={onChange}
        value="2024-03-09"
      />,
    );
    const input = screen.getByLabelText('Sighting date');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const ids = (input.getAttribute('aria-describedby') ?? '').split(' ');
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[1] ?? '')?.textContent).toBe(
      'Choose a later date',
    );
    Object.defineProperty(input, 'validity', {
      configurable: true,
      value: { badInput: true },
    });
    fireEvent.change(input, { target: { value: '' } });
    expect(onChange).not.toHaveBeenCalled();
    rerender(
      <DateField
        label="Sighting date"
        min="2024-03-10"
        onChange={onChange}
        value="2024-03-09"
      />,
    );
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('keeps disabled inputs inert and allows clearing optional dates', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <DateField
        disabled
        label="Sighting date"
        onChange={onChange}
        value="2024-03-10"
      />,
    );
    const input = screen.getByLabelText('Sighting date');
    await user.click(input);
    expect(input).toHaveProperty('disabled', true);
    expect(onChange).not.toHaveBeenCalled();
    rerender(
      <DateField
        label="Sighting date"
        onChange={onChange}
        value="2024-03-10"
      />,
    );
    fireEvent.change(input, { target: { value: '' } });
    expect(onChange).toHaveBeenCalledExactlyOnceWith('');
  });

  it('shows a consumer-supplied validation error for an empty required date', () => {
    const onChange = vi.fn();
    render(
      <DateField
        error="Choose a date"
        label="Sighting date"
        onChange={onChange}
        required
        value=""
      />,
    );
    const input = screen.getByLabelText('Sighting date');
    expect(input).toHaveProperty('required', true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(
      document.getElementById(input.getAttribute('aria-describedby') ?? '')
        ?.textContent,
    ).toBe('Choose a date');
  });

  it('rejects malformed controlled values and inverted bounds', () => {
    const onChange = vi.fn();
    expect(() =>
      render(<DateField label="Date" onChange={onChange} value="2024-02-30" />),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <DateField
          label="Date"
          max="2024-01-01"
          min="2024-12-31"
          onChange={onChange}
          value="2024-06-01"
        />,
      ),
    ).toThrow(RangeError);
  });
});
