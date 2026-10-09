import { contrastRatio } from '@scalewing/tokens';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Field } from './components/Field.js';
import { changedTintStrength } from './css/css-field-changed.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import {
  forEveryTheme,
  glassOverBackground,
  tintOver,
} from './every-theme.test-support.js';

afterEach(() => cleanup());

/** The Field's own classes, without the Stack's layout ones. */
function fieldOf(input: HTMLElement): { className: string } {
  const field = input.closest('.sw-field') as HTMLElement;
  return {
    className: [...field.classList]
      .filter((name) => name.startsWith('sw-field'))
      .join(' '),
  };
}

describe('Field changed', () => {
  it('marks a changed value with its own class and says what it was', () => {
    render(
      <Field changed description="Was 25" label="$20 bills">
        <input defaultValue="26" />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: '$20 bills' });
    expect(fieldOf(input).className).toBe('sw-field sw-field-changed');
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(
      document.getElementById(input.getAttribute('aria-describedby') ?? '')
        ?.textContent,
    ).toBe('Was 25');
  });

  it('marks an adorned frame, and adds nothing when unchanged', () => {
    render(
      <>
        <Field changed label="Sales" prefix="$">
          <input defaultValue="480.00" />
        </Field>
        <Field changed={false} label="Taxes" prefix="$">
          <input defaultValue="30.00" />
        </Field>
      </>,
    );
    expect(
      fieldOf(screen.getByRole('textbox', { name: 'Sales $' })).className,
    ).toBe('sw-field sw-field-changed');
    expect(
      fieldOf(screen.getByRole('textbox', { name: 'Taxes $' })).className,
    ).toBe('sw-field');
  });

  it('lets invalid and error win over changed', () => {
    render(
      <>
        <Field changed invalid label="Count">
          <input />
        </Field>
        <Field changed error="Enter a whole number" label="Rolls">
          <input />
        </Field>
      </>,
    );
    for (const name of ['Count', 'Rolls'])
      expect(fieldOf(screen.getByRole('textbox', { name })).className).toBe(
        'sw-field sw-field-invalid',
      );
  });

  it('requires a native control once passed, even false, but not undefined', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      expect(() =>
        render(
          <Field changed={false} label="Composed">
            <span>not a control</span>
          </Field>,
        ),
      ).toThrow(TypeError);
      expect(() =>
        render(
          <Field changed={undefined} label="Composed">
            <span>not a control</span>
          </Field>,
        ),
      ).not.toThrow();
    } finally {
      consoleError.mockRestore();
    }
  });

  it('generates the accent border, thicker without moving, a tint over the fill, and forced colors', () => {
    const css = generateStylesheet();
    const typed = `input[type='text'], input[type='email'], input[type='number'], input[type='search'], input[type='url'], input[type='password'], input:not([type]), textarea`;
    // An adorned frame with a value; while its placeholder shows it is plain.
    const frame =
      '.sw-field-changed .sw-field-adorned:not(:has(> input:placeholder-shown))';
    const tint =
      'linear-gradient(color-mix(in srgb, var(--sw-color-accent) 12%, transparent), color-mix(in srgb, var(--sw-color-accent) 12%, transparent))';
    expect(css).toContain(
      '[data-theme] .sw-field-changed > :is(input, select, textarea),\n.sw-field-changed .sw-field-adorned {\n  border-color: var(--sw-color-accent);\n  box-shadow: inset 0 0 0 1px var(--sw-color-accent);\n}',
    );
    // The tint is a background image over the control's own fill, and not
    // while a placeholder shows.
    expect(css).toContain(
      `[data-theme] .sw-field-changed > :is(${typed}):not(:placeholder-shown),\n${frame} {\n  background-image: ${tint};\n}`,
    );
    // A select keeps its chevron above the tint.
    expect(css).toContain(
      `[data-theme] .sw-field-changed > select {\n  background-image:\n    linear-gradient(45deg, transparent 50%, var(--sw-color-muted) 50%),\n    linear-gradient(135deg, var(--sw-color-muted) 50%, transparent 50%),\n    ${tint};\n  background-position:\n    calc(100% - var(--sw-select-chevron-inset)) calc(50% - 1px),\n    calc(100% - calc(var(--sw-select-chevron-inset) - var(--sw-space-1))) calc(50% - 1px),\n    0 0;`,
    );
    expect(css).toContain(
      `${frame} > :is(.sw-field-prefix, .sw-field-suffix) {\n  color: var(--sw-color-text);\n}`,
    );
    // Focus never tints: a text control's focus rules draw a ring only.
    const focusRules = [
      ...css.matchAll(
        /[^{}]*(?:select:focus|sw-field-adorned:focus)[^{}]*\{[^}]*\}/g,
      ),
    ].map(([rule]) => rule);
    expect(focusRules.length).toBeGreaterThanOrEqual(3);
    for (const rule of focusRules) expect(rule).not.toMatch(/background/);
    expect(css).toContain(
      '.sw-field-changed .sw-field-adorned { border-color: Highlight; box-shadow: inset 0 0 0 1px Highlight; }',
    );
    expect(css).toContain(
      '.sw-field-changed .sw-field-adorned:not(:has(> input:placeholder-shown)) { background-image: none; }',
    );
    expect(css).toContain(
      '[data-theme] .sw-field-changed > select { background-image: linear-gradient(45deg, transparent 50%, var(--sw-color-muted) 50%),\n    linear-gradient(135deg, var(--sw-color-muted) 50%, transparent 50%); }',
    );
    expect(utilityClassCatalog()).toContain('sw-field-changed');
  });

  it("places a changed select's chevron for its size, xs included", () => {
    render(
      <Field changed label="Colony" size="xs">
        <select defaultValue="ocean">
          <option value="forest">Forest</option>
          <option value="ocean">Ocean</option>
        </select>
      </Field>,
    );
    const select = screen.getByRole('combobox', { name: 'Colony' });
    expect(fieldOf(select).className).toBe(
      'sw-field sw-field-xs sw-field-changed',
    );
    const css = generateStylesheet();
    // Every rule that lists the chevron's layers places them from one inset,
    // which the select sets per size; the xs rule declares no position of
    // its own for the changed rule to beat.
    expect(css).toContain(
      '[data-theme] select {\n  background-color: var(--sw-glass-fill);',
    );
    expect(css).toContain('  --sw-select-chevron-inset: var(--sw-space-4);');
    const xs = /\.sw-field-xs select \{[^}]*\}/.exec(css)?.[0] ?? '';
    expect(xs).toContain('--sw-select-chevron-inset: var(--sw-space-3);');
    expect(xs).not.toContain('background-position');
    for (const [rule] of css.matchAll(/[^{}]*select[^{}]*\{[^}]*\}/g))
      if (rule.includes('background-position'))
        expect(rule, rule).toContain(
          'calc(100% - var(--sw-select-chevron-inset)) calc(50% - 1px),',
        );
  });

  it('limits the tint to text controls and a select, and the adornment color to a frame on the tint', () => {
    const css = generateStylesheet();
    const tintRule =
      /[^{}]*\{\n {2}background-image: linear-gradient\(color-mix[^}]*\}/.exec(
        css,
      )?.[0];
    expect(tintRule).toBeDefined();
    expect(tintRule).not.toMatch(/:is\(input,/);
    expect(tintRule).not.toMatch(/range|color'|file/);
    expect(css).not.toContain(
      '.sw-field-changed :is(.sw-field-prefix, .sw-field-suffix)',
    );
  });

  it('keeps the value at 4.5:1 on the tint in every palette and scheme', () => {
    // The control is the glass fill over the page (the subtle fill when
    // disabled), and the tint is the accent at 12 % over that. The value,
    // and an adorned frame's prefix and suffix, are in the text color; a
    // select's muted chevron is a graphic and needs 3:1.
    forEveryTheme((colors, label, theme) => {
      const fill = glassOverBackground(theme);
      const tint = tintOver(colors.accent, changedTintStrength, fill);
      expect(
        contrastRatio(colors.text, tint),
        `${label} value`,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(
          colors.text,
          tintOver(colors.accent, changedTintStrength, colors.subtle),
        ),
        `${label} disabled value`,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(colors.muted, tint),
        `${label} chevron`,
      ).toBeGreaterThanOrEqual(3);
      // The tint shows against the plain fill.
      expect(contrastRatio(tint, fill), `${label} tint`).toBeGreaterThanOrEqual(
        1.1,
      );
    });
  });
});
