import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './components/Button.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

describe('Button', () => {
  it('renders a native button with generated variant and md size classes', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Button onPress={() => undefined}>Save</Button>
      </ThemeProvider>,
    );

    const control = screen.getByRole('button', { name: 'Save' });
    expect(control.tagName).toBe('BUTTON');
    expect(control).toHaveProperty('type', 'button');
    expect(control.className).toContain('sw-button');
    expect(control.className).toContain('sw-button-primary');
    expect(control.className).toContain('sw-button-md');
  });

  it('blocks onPress when disabled and supports submit type', () => {
    const onPress = vi.fn();

    render(
      <ThemeProvider colorScheme="light">
        <Button disabled onPress={onPress} type="submit" variant="danger">
          Publish
        </Button>
      </ThemeProvider>,
    );

    const control = screen.getByRole('button', { name: 'Publish' });
    expect(control).toHaveProperty('disabled', true);
    expect(control).toHaveProperty('type', 'submit');
    expect(control.className).toContain('sw-button-danger');
    control.click();
    expect(onPress).not.toHaveBeenCalled();
  });
});
