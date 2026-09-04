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
});
