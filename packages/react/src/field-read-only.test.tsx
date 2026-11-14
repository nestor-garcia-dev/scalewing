import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Field } from './components/Field.js';
import { cssFieldClasses } from './css/css-field.js';

afterEach(() => cleanup());

describe('Field variant="read-only"', () => {
  it('shows a value that cannot be changed: labelled, described, focusable and read-only', () => {
    render(
      <Field
        description="The keeper's address the invitation went to"
        label="Email"
        variant="read-only"
      >
        <input readOnly type="email" value="ada@example.test" />
      </Field>,
    );
    const input = screen.getByRole('textbox', {
      name: 'Email',
      description: "The keeper's address the invitation went to",
    });
    expect(input).toHaveProperty('readOnly', true);
    expect(input).toHaveProperty('value', 'ada@example.test');
    expect(
      input.closest('.sw-field')?.classList.contains('sw-field-read-only'),
    ).toBe(true);
    input.focus();
    expect(document.activeElement).toBe(input);
  });

  it('fails closed without a read-only native input or textarea, or with an adornment', () => {
    expect(() =>
      render(
        <Field label="Email" variant="read-only">
          <input value="ada@example.test" onChange={() => undefined} />
        </Field>,
      ),
    ).toThrow(TypeError);
    expect(() =>
      render(
        <Field label="Habitat" variant="read-only">
          <select>
            <option>Marsh</option>
          </select>
        </Field>,
      ),
    ).toThrow(TypeError);
    expect(() =>
      render(
        <Field label="Weight" suffix="kg" variant="read-only">
          <input readOnly value="12" />
        </Field>,
      ),
    ).toThrow(TypeError);
    // A value the person cannot change is never marked invalid or changed:
    // the read-only look would hide the danger or accent edge.
    for (const marks of [
      { error: 'Check the email' },
      { invalid: false },
      { changed: true },
    ])
      expect(() =>
        render(
          <Field label="Email" variant="read-only" {...marks}>
            <input readOnly value="ada@example.test" />
          </Field>,
        ),
      ).toThrow(TypeError);
    render(
      <Field label="Notes" variant="read-only">
        <textarea readOnly value="Seen at dawn" />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveProperty(
      'readOnly',
      true,
    );
  });

  it('draws the subtle fill with no edge, apart from the dashed disabled look', () => {
    const css = cssFieldClasses();
    expect(css).toMatch(
      /\[data-theme\] \.sw-field-read-only > :is\(input, textarea\) \{\s*background-color: var\(--sw-color-subtle\);\s*border-color: transparent;/,
    );
    expect(css).toContain('border-style: dotted;');
  });
});
