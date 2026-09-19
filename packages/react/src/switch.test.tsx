import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Switch } from './components/Switch.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

afterEach(() => cleanup());

describe('Switch', () => {
  it('labels and describes a controlled native switch', () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <ThemeProvider colorScheme="light">
        <Switch
          checked={false}
          description="Include active habitats"
          label="Active only"
          onCheckedChange={onCheckedChange}
        />
      </ThemeProvider>,
    );
    const control = screen.getByRole('switch', { name: 'Active only' });
    expect(control).toHaveProperty('type', 'checkbox');
    expect(control).toHaveProperty('checked', false);
    expect(control.getAttribute('aria-checked')).toBe('false');
    const descriptionId = control.getAttribute('aria-describedby');
    expect(descriptionId).toBeTruthy();
    expect(document.getElementById(descriptionId ?? '')?.textContent).toBe(
      'Include active habitats',
    );

    fireEvent.click(control);
    expect(onCheckedChange).toHaveBeenCalledOnce();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    rerender(
      <ThemeProvider colorScheme="dark">
        <Switch
          checked
          description="Include active habitats"
          label="Active only"
          onCheckedChange={onCheckedChange}
        />
      </ThemeProvider>,
    );
    expect(control).toHaveProperty('checked', true);
    expect(control.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(control);
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it('does not toggle or call back when disabled', () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        checked={false}
        disabled
        label="Active only"
        onCheckedChange={onCheckedChange}
      />,
    );
    const control = screen.getByRole('switch', { name: 'Active only' });
    fireEvent.click(control);
    expect(control).toHaveProperty('checked', false);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('toggles once with Space and ignores Space after becoming disabled', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    function ControlledSwitch({ disabled = false }: { disabled?: boolean }) {
      const [checked, setChecked] = useState(false);
      return (
        <Switch
          checked={checked}
          disabled={disabled}
          label="Active only"
          onCheckedChange={(next) => {
            onCheckedChange(next);
            setChecked(next);
          }}
        />
      );
    }

    const { rerender } = render(<ControlledSwitch />);
    const control = screen.getByRole('switch', { name: 'Active only' });
    control.focus();
    await user.keyboard(' ');
    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(control).toHaveProperty('checked', true);

    rerender(<ControlledSwitch disabled />);
    await user.keyboard(' ');
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(control).toHaveProperty('checked', true);
  });
});
