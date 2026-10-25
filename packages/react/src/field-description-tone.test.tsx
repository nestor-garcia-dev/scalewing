import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Field,
  type FieldDescriptionTone,
  fieldDescriptionTones,
} from './index.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function BandField({
  tone,
  error,
  size,
}: {
  tone?: FieldDescriptionTone;
  error?: string;
  size?: 'xs' | 'md';
}) {
  return (
    <Field
      description="Kestrel 12 also wears band 7"
      descriptionTone={tone}
      error={error}
      label="Band number"
      size={size}
    >
      <input aria-describedby="row-note" defaultValue="7" />
    </Field>
  );
}

function hint() {
  return screen.getByText('Kestrel 12 also wears band 7').parentElement!;
}

describe('Field descriptionTone', () => {
  it('knows muted and warning', () => {
    expect(fieldDescriptionTones).toEqual(['muted', 'warning']);
  });

  it('draws a warning description with a hidden glyph and keeps it describing the control', () => {
    render(<BandField tone="warning" />);
    const input = screen.getByRole('textbox', { name: 'Band number' });
    expect(hint().className).toBe(
      'sw-field-description sw-field-description-warning',
    );
    expect(input.getAttribute('aria-describedby')).toBe(
      `row-note ${hint().id}`,
    );
    const glyph = hint().querySelector('svg')!;
    expect(glyph.getAttribute('aria-hidden')).toBe('true');
    expect(glyph.getAttribute('class')).toBe('sw-field-description-glyph');
    expect(hint().textContent).toBe('Kestrel 12 also wears band 7');
  });

  it('never marks the control invalid', () => {
    const { container } = render(<BandField tone="warning" />);
    const input = screen.getByRole('textbox', { name: 'Band number' });
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(container.querySelector('.sw-field-invalid')).toBeNull();
  });

  it('works at size xs', () => {
    const { container } = render(<BandField size="xs" tone="warning" />);
    expect(container.firstElementChild!.className).toContain('sw-field-xs');
    expect(hint().className).toContain('sw-field-description-warning');
  });

  it('stays a plain muted description by default and with muted', () => {
    for (const tone of [undefined, 'muted'] as const) {
      render(<BandField tone={tone} />);
      const plain = screen.getByText('Kestrel 12 also wears band 7');
      expect(plain.className).toBe('sw-field-description');
      expect(plain.querySelector('svg')).toBeNull();
      cleanup();
    }
  });

  it('gives way to an error, which marks the control invalid', () => {
    render(<BandField error="Enter a band number" tone="warning" />);
    const input = screen.getByRole('textbox', { name: 'Band number' });
    expect(screen.queryByText('Kestrel 12 also wears band 7')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('refuses an unknown tone', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(<BandField tone={'danger' as FieldDescriptionTone} />),
    ).toThrow(new RangeError('Unknown Field descriptionTone: danger'));
  });

  it('generates the warning colour, a space-4 glyph and CanvasText in forced colours', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-field-description-warning {\n  align-items: flex-start;\n  color: var(--sw-color-warning);',
    );
    expect(css).toContain('height: var(--sw-space-4);\n  margin-block: 1px;');
    expect(css).toContain(
      '.sw-field-description-warning { color: CanvasText; }',
    );
    // After the muted rule, so the warning colour wins.
    expect(css.indexOf('.sw-field-description-warning {')).toBeGreaterThan(
      css.indexOf('.sw-field-description { color: var(--sw-color-muted); }'),
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-field-description-warning',
        'sw-field-description-glyph',
      ]),
    );
  });
});
