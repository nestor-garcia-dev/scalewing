import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { contrastRatio, type SemanticColorKey } from '@scalewing/tokens';
import { afterEach, describe, expect, it } from 'vitest';

import { Field } from './components/Field.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { forEveryTheme } from './every-theme.test-support.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

afterEach(() => cleanup());

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

    const field = control.closest('.sw-field');
    expect(field?.className).toContain('sw-stack');
    expect(field?.className).toContain('sw-gap-1');
    expect(field?.querySelector('label')?.htmlFor).toBe(control.id);
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
    const field = control.closest('.sw-field');
    expect(field?.className).toContain('sw-field-xs');
    expect(screen.getByText('League').className).toContain('sw-sr-only');
  });
  it('associates a stable hint ID, required input, and existing descriptions', () => {
    const { rerender } = render(
      <Field
        description="Use the code on the sighting card"
        label="Sighting code"
        required
      >
        <input aria-describedby="external-note" name="sighting-code" />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Sighting code' });
    const hint = screen.getByText('Use the code on the sighting card');
    const id = hint.id;
    expect(id).toBeTruthy();
    expect(input.getAttribute('aria-describedby')).toBe(`external-note ${id}`);
    expect(input).toHaveProperty('required', true);
    expect(screen.getByText('*').getAttribute('aria-hidden')).toBe('true');
    // The error region exists, empty and polite, before any error, so a new
    // error is announced once when its text is swapped in (not as an alert).
    const region = input
      .closest('.sw-field')
      ?.querySelector('.sw-field-error') as HTMLElement;
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent).toBe('');
    rerender(
      <Field
        description="Use the code on the sighting card"
        error="A code is required"
        label="Sighting code"
        required
      >
        <input aria-describedby="external-note" name="sighting-code" />
      </Field>,
    );
    expect(screen.queryByText('Use the code on the sighting card')).toBeNull();
    // The error replaces the hint on screen, in the same region element that
    // existed before, and it is not an alert (Teisoro CHK-3).
    expect(screen.getByText('A code is required')).toBe(region);
    expect(input.getAttribute('aria-describedby')).toBe(
      `external-note ${region.id}`,
    );
    expect(screen.queryByRole('alert')).toBeNull();
    expect(
      screen.getByRole('textbox', {
        name: 'Sighting code',
        description: 'A code is required',
      }),
    ).toBe(input);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.closest('.sw-field')?.className).toContain('sw-field-invalid');
    rerender(
      <Field
        description="Use the code on the sighting card"
        label="Sighting code"
        required
      >
        <input aria-describedby="external-note" name="sighting-code" />
      </Field>,
    );
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText('Use the code on the sighting card').id).toBe(id);
    expect(region.textContent).toBe('');
    expect(input.getAttribute('aria-describedby')).toBe(`external-note ${id}`);
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.closest('.sw-field')?.className).not.toContain(
      'sw-field-invalid',
    );
  });

  it('keeps IDs distinct across fields and preserves existing child semantics', () => {
    render(
      <>
        <Field description="First hint" label="First">
          <input aria-invalid="true" />
        </Field>
        <Field description="Second hint" label="Second">
          <textarea />
        </Field>
      </>,
    );
    const first = screen.getByRole('textbox', { name: 'First' });
    const second = screen.getByRole('textbox', { name: 'Second' });
    expect(first.getAttribute('aria-describedby')).not.toBe(
      second.getAttribute('aria-describedby'),
    );
    expect(first.getAttribute('aria-invalid')).toBe('true');
    expect(second.closest('.sw-field')?.querySelector('label')?.htmlFor).toBe(
      second.id,
    );
  });

  it('keeps an optional control mounted as an error appears and clears', () => {
    const { rerender } = render(
      <Field label="Optional code">
        <input />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Optional code' });
    rerender(
      <Field error="Invalid code" label="Optional code">
        <input />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'Optional code' })).toBe(input);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    rerender(
      <Field label="Optional code">
        <input />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'Optional code' })).toBe(input);
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('marks a control invalid without a message of its own', () => {
    render(
      <>
        <Field invalid label="$1 bills">
          <input aria-describedby="count-error" />
        </Field>
        <p id="count-error">Enter at least one bill or coin.</p>
      </>,
    );
    const input = screen.getByRole('textbox', { name: '$1 bills' });
    // Teisoro DRW-18: the group's message sits under the grid, and its
    // count fields had no invalid state of their own.
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.closest('.sw-field')?.className).toContain('sw-field-invalid');
    // No message of its own: the empty polite region only, and the
    // consumer's description of the group's message kept.
    const region = input.closest('.sw-field')!.querySelector('.sw-field-error');
    expect(region?.textContent).toBe('');
    expect(input.getAttribute('aria-describedby')).toBe('count-error');
  });

  it('keeps its hint while invalid, and clears the state when invalid goes', () => {
    const { rerender } = render(
      <Field description="Loose bills" invalid label="$5 bills">
        <input />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: '$5 bills' });
    expect(input.getAttribute('aria-invalid')).toBe('true');
    // Without an error the hint stays on screen and describes the control.
    const hint = screen.getByText('Loose bills');
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
    rerender(
      <Field description="Loose bills" label="$5 bills">
        <input />
      </Field>,
    );
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.closest('.sw-field')?.className).not.toContain(
      'sw-field-invalid',
    );
  });

  it('lets error win over invalid, and invalid mark an adorned frame', () => {
    render(
      <>
        <Field error="Enter a count" invalid={false} label="Coins">
          <input />
        </Field>
        <Field invalid label="Fee" prefix="$">
          <input />
        </Field>
      </>,
    );
    const coins = screen.getByRole('textbox', { name: 'Coins' });
    expect(coins.getAttribute('aria-invalid')).toBe('true');
    const fee = screen.getByRole('textbox', { name: /Fee/ });
    expect(fee.getAttribute('aria-invalid')).toBe('true');
    expect(fee.closest('.sw-field')?.className).toContain('sw-field-invalid');
  });

  it('rejects invalid on a child that is not one native control', () => {
    expect(() =>
      render(
        <Field invalid label="Code">
          <span>not a control</span>
        </Field>,
      ),
    ).toThrow(TypeError);
  });

  it('rejects a non-native or multiple validation children', () => {
    expect(() =>
      render(
        <Field description="Help" label="Code">
          <span>not a control</span>
        </Field>,
      ),
    ).toThrow(TypeError);
    expect(() =>
      render(
        <Field error="Invalid" label="Code">
          <input />
          <input />
        </Field>,
      ),
    ).toThrow(TypeError);
  });

  it('names an adorned input with its label, prefix, and suffix', () => {
    render(
      <Field label="Drop amount" prefix="$" suffix="USD">
        <input inputMode="decimal" name="drop-amount" />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Drop amount $ USD' });
    const frame = input.parentElement;
    expect(frame?.className).toBe('sw-field-adorned');
    const prefix = frame?.querySelector('.sw-field-prefix');
    const suffix = frame?.querySelector('.sw-field-suffix');
    expect(prefix?.textContent).toBe('$');
    expect(suffix?.textContent).toBe('USD');
    expect(prefix?.getAttribute('aria-hidden')).toBe('true');
    expect(suffix?.getAttribute('aria-hidden')).toBe('true');
    expect(frame?.firstElementChild).toBe(prefix);
    expect(frame?.lastElementChild).toBe(suffix);
    const label = input.closest('.sw-field')?.querySelector('label');
    expect(input.getAttribute('aria-labelledby')).toBe(
      `${label?.id} ${prefix?.id} ${suffix?.id}`,
    );
    expect(label?.htmlFor).toBe(input.id);
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('keeps a lone suffix, validation, and an own aria-labelledby', () => {
    const { rerender } = render(
      <Field error="Enter a rate" label="Tax rate" required suffix="%">
        <input name="tax-rate" />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Tax rate %' });
    expect(input.parentElement?.querySelector('.sw-field-prefix')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(
      screen.getByText('Enter a rate').id,
    );
    expect(input).toHaveProperty('required', true);
    expect(input.closest('.sw-field')?.className).toContain('sw-field-invalid');
    rerender(
      <>
        <span id="own-name">Rate</span>
        <Field label="Tax rate" suffix="%">
          <input aria-labelledby="own-name" name="tax-rate" />
        </Field>
      </>,
    );
    const named = screen.getByRole('textbox', {
      name: 'Rate',
      description: '%',
    });
    expect(named.getAttribute('aria-labelledby')).toBe('own-name');
  });

  it('keeps a child aria-label and describes the input with the adornment', () => {
    render(
      <>
        <span id="drop-hint">Count it twice</span>
        <Field
          error="Enter an amount"
          label="Drop amount"
          prefix="$"
          suffix="USD"
        >
          <input
            aria-describedby="drop-hint"
            aria-label="Cash dropped"
            name="drop-amount"
          />
        </Field>
      </>,
    );
    const input = screen.getByRole('textbox', {
      name: 'Cash dropped',
      description: 'Count it twice $ USD Enter an amount',
    });
    expect(input.getAttribute('aria-labelledby')).toBeNull();
    const frame = input.parentElement;
    expect(input.getAttribute('aria-describedby')).toBe(
      [
        'drop-hint',
        frame?.querySelector('.sw-field-prefix')?.id,
        frame?.querySelector('.sw-field-suffix')?.id,
        screen.getByText('Enter an amount').id,
      ].join(' '),
    );
  });

  it('focuses the input from a press on its prefix, suffix, or frame', () => {
    render(
      <Field label="Drop amount" prefix="$" suffix="USD">
        <input name="drop-amount" />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Drop amount $ USD' });
    const frame = input.parentElement as HTMLElement;
    for (const target of [
      frame.querySelector('.sw-field-prefix') as HTMLElement,
      frame.querySelector('.sw-field-suffix') as HTMLElement,
      frame,
    ]) {
      input.blur();
      // fireEvent returns false when the handler prevented the default, which
      // keeps the press from moving focus away or selecting the adornment.
      expect(fireEvent.mouseDown(target)).toBe(false);
      expect(document.activeElement).toBe(input);
    }
    // A press on the input keeps the browser's own caret and selection.
    expect(fireEvent.mouseDown(input)).toBe(true);
  });

  it('leaves a disabled adorned input unfocused', () => {
    render(
      <Field label="Drop amount" prefix="$">
        <input disabled name="drop-amount" />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Drop amount $' });
    const prefix = input.parentElement?.querySelector('.sw-field-prefix');
    expect(fireEvent.mouseDown(prefix as HTMLElement)).toBe(true);
    expect(document.activeElement).not.toBe(input);
  });

  it('leaves an unadorned control unwrapped and unlabelled by id', () => {
    render(
      <Field label="Species name">
        <input name="species" />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Species name' });
    expect(input.getAttribute('aria-labelledby')).toBeNull();
    expect(input.parentElement?.className).toContain('sw-field');
  });

  it('rejects an adornment on a control that is not a native input', () => {
    expect(() =>
      render(
        <Field label="Habitat" prefix="#">
          <select>
            <option>Forest</option>
          </select>
        </Field>,
      ),
    ).toThrow('Field prefix and suffix require a native input child');
    expect(() =>
      render(
        <Field label="Weight" suffix="kg">
          <span>not a control</span>
        </Field>,
      ),
    ).toThrow(TypeError);
  });

  it('generates the adornment frame from the control surface tokens', () => {
    const css = generateStylesheet();
    const catalog = utilityClassCatalog();
    for (const className of [
      'sw-field-adorned',
      'sw-field-prefix',
      'sw-field-suffix',
    ]) {
      expect(css).toContain(`.${className}`);
      expect(catalog).toContain(className);
    }
    expect(css).toContain('[data-theme] .sw-field-adorned > input {');
    expect(css).toContain('.sw-field-adorned:focus-within {');
    expect(css).toContain(
      '.sw-field-invalid .sw-field-adorned { border-color: var(--sw-color-danger); }',
    );
    expect(css).toContain('.sw-field-xs .sw-field-adorned {');
    expect(css).not.toMatch(
      /sw-field-(prefix|suffix|adorned)[^}]*#[0-9a-f]{3}/i,
    );
  });
});

describe('disabled text controls', () => {
  const css = generateStylesheet();
  // The canvas rule for a disabled native text control, read from the
  // stylesheet so the contrast check follows the token it uses.
  const fill =
    /:disabled,\n\[data-theme\] select:disabled \{\n {2}background-color: var\(--sw-color-(\w+)\);/.exec(
      css,
    );

  it('fills, dashes and keeps the value unfaded without the button opacity', () => {
    expect(fill).not.toBeNull();
    const rule = css.slice(fill!.index, css.indexOf('}', fill!.index));
    expect(rule).toContain('border-style: dashed;');
    expect(rule).toContain('cursor: not-allowed;');
    expect(rule).toContain('opacity: 1;');
    expect(rule).not.toContain('--sw-disabled-opacity');
    // The adorned frame and DateField's entry carry the same look.
    expect(css).toContain('.sw-field-adorned:has(> input:disabled) {');
    expect(css).toMatch(
      /\.sw-date-field-input:disabled \{\n {2}background-color: var\(--sw-color-subtle\);\n {2}border-style: dashed;/,
    );
    expect(css).not.toMatch(
      /\.sw-date-field-input:disabled,\n\.sw-date-field-button:disabled/,
    );
  });

  it('keeps the dashed border in the system disabled color under forced colors', () => {
    expect(css).toMatch(
      /@media \(forced-colors: active\) \{\n {2}\[data-theme\] :is\(.*\):disabled,\n {2}\[data-theme\] select:disabled \{\n {4}border-color: GrayText;/,
    );
  });

  it('keeps the value and placeholder at 4.5:1 on the fill in every palette and scheme', () => {
    const fillToken = fill![1] as SemanticColorKey;
    forEveryTheme((colors, label) => {
      expect(
        contrastRatio(colors.text, colors[fillToken]),
        label,
      ).toBeGreaterThanOrEqual(4.5);
      // The placeholder, prefix and suffix are muted.
      expect(
        contrastRatio(colors.muted, colors[fillToken]),
        label,
      ).toBeGreaterThanOrEqual(4.5);
    });
  });

  it('draws every typed placeholder in the muted color, which the disabled claim relies on', () => {
    // The browser's own placeholder is #757575 in both schemes: 2.28:1 at the
    // lowest on a field in the palettes, where muted keeps 4.55:1 or more,
    // so the rule applies to enabled fields too.
    expect(css).toContain(
      "[data-theme] :is(input[type='text'], input[type='email'], input[type='number'], input[type='search'], input[type='url'], input[type='password'], input:not([type]), textarea)::placeholder {\n  color: var(--sw-color-muted);\n  opacity: 1;\n}",
    );
  });
});
