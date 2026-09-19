import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Checkbox } from './components/Checkbox.js';

afterEach(() => cleanup());

describe('Checkbox', () => {
  it('uses native checkbox semantics and associates its description and error', () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Checkbox
        checked={false}
        description="Required for the sighting report"
        error="Confirm the source"
        label="Source confirmed"
        onCheckedChange={onCheckedChange}
        required
      />,
    );
    const control = screen.getByRole('checkbox', { name: 'Source confirmed' });
    expect(control).toHaveProperty('type', 'checkbox');
    expect(control).toHaveProperty('checked', false);
    expect(control).toHaveProperty('required', true);
    expect(control.getAttribute('aria-invalid')).toBe('true');
    const ids = (control.getAttribute('aria-describedby') ?? '').split(' ');
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[0] ?? '')?.textContent).toBe(
      'Required for the sighting report',
    );
    expect(document.getElementById(ids[1] ?? '')?.textContent).toBe(
      'Confirm the source',
    );
    rerender(
      <Checkbox
        checked
        label="Source confirmed"
        onCheckedChange={onCheckedChange}
      />,
    );
    expect(control).toHaveProperty('checked', true);
    expect(control.getAttribute('aria-invalid')).toBe('false');
  });

  it('calls back once per pointer and Space toggle', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    function ControlledCheckbox() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox
          checked={checked}
          label="Source confirmed"
          onCheckedChange={(next) => {
            onCheckedChange(next);
            setChecked(next);
          }}
        />
      );
    }
    render(<ControlledCheckbox />);
    const control = screen.getByRole('checkbox', { name: 'Source confirmed' });
    await user.click(control);
    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(control).toHaveProperty('checked', true);
    control.focus();
    await user.keyboard(' ');
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(control).toHaveProperty('checked', false);
  });

  it('prevents disabled pointer and keyboard changes', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Checkbox
        checked={false}
        disabled
        label="Source confirmed"
        onCheckedChange={onCheckedChange}
      />,
    );
    const control = screen.getByRole('checkbox', { name: 'Source confirmed' });
    await user.click(control);
    control.focus();
    await user.keyboard(' ');
    expect(control).toHaveProperty('checked', false);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
