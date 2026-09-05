import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Field } from './components/Field.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

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

    const field = control.closest('label');
    expect(field?.className).toContain('sw-stack');
    expect(field?.className).toContain('sw-gap-1');
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
    const field = control.closest('label');
    expect(field?.className).toContain('sw-field-xs');
    expect(screen.getByText('League').className).toContain('sw-sr-only');
  });
});
