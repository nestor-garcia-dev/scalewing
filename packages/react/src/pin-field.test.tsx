import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { contrastRatio } from '@scalewing/tokens';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PinField } from './components/PinField.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import {
  forEveryTheme,
  glassOverBackground,
} from './every-theme.test-support.js';
import { pinMaskCharacter } from './pin-entry.js';
import { HeldPinField, pageState } from './pin-field.test-support.js';

afterEach(() => cleanup());

const css = generateStylesheet();
const dot = pinMaskCharacter;

function field(): HTMLInputElement {
  return screen.getByRole('textbox', { name: 'Gate code' });
}

function filledDots(container: HTMLElement): number {
  return container.querySelectorAll('.sw-pin-field-dot-filled').length;
}

/** Waits for the polite region to hold these words. */
async function announced(words: string) {
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toBe(words),
  );
}

describe('PinField', () => {
  it('is one text input for digits that is not a password field and stays out of autofill', () => {
    const { container } = render(<HeldPinField />);
    const input = field();
    expect(container.querySelectorAll('input')).toHaveLength(1);
    expect(input.getAttribute('type')).toBe('text');
    expect(input.getAttribute('inputmode')).toBe('numeric');
    expect(input.getAttribute('autocomplete')).toBe('off');
    expect(input.hasAttribute('name')).toBe(false);
    expect(input.getAttribute('spellcheck')).toBe('false');
    expect(input.getAttribute('autocorrect')).toBe('off');
    expect(input.getAttribute('autocapitalize')).toBe('off');
    for (const hint of ['data-1p-ignore', 'data-lpignore', 'data-bwignore'])
      expect(input.hasAttribute(hint)).toBe(true);
    expect(input.getAttribute('data-form-type')).toBe('other');
    expect(container.querySelector("input[type='password']")).toBeNull();
    // The label is a real label for it, drawn above.
    const label = container.querySelector('label')!;
    expect(label.getAttribute('for')).toBe(input.id);
    expect(label.className).toBe('');
  });

  it('draws one hidden dot per digit of the code, six by default', () => {
    const { container, rerender } = render(
      <PinField label="Gate code" onChange={() => {}} value="" />,
    );
    const dots = container.querySelector('.sw-pin-field-dots')!;
    expect(dots.getAttribute('aria-hidden')).toBe('true');
    expect(dots.querySelectorAll('.sw-pin-field-dot')).toHaveLength(6);
    expect(filledDots(container)).toBe(0);
    rerender(
      <PinField label="Gate code" length={4} onChange={() => {}} value="12" />,
    );
    expect(container.querySelectorAll('.sw-pin-field-dot')).toHaveLength(4);
    expect(filledDots(container)).toBe(2);
  });

  it('takes typed digits, fills a dot for each and drops everything else', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<HeldPinField onChange={onChange} />);
    await user.type(field(), '7');
    expect(onChange).toHaveBeenLastCalledWith('7');
    expect(filledDots(container)).toBe(1);
    await user.type(field(), 'a-8 .');
    expect(onChange).toHaveBeenLastCalledWith('78');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(filledDots(container)).toBe(2);
    // The input holds the mask, never the digits.
    expect(field().value).toBe(dot.repeat(2));
  });

  it('stops at the length', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HeldPinField length={4} onChange={onChange} />);
    await user.type(field(), '789012');
    expect(onChange).toHaveBeenLastCalledWith('7890');
    expect(onChange).toHaveBeenCalledTimes(4);
    expect(field().value).toBe(dot.repeat(4));
  });

  it('keeps the digits of a paste, after those already entered, cut to the length', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<HeldPinField onChange={onChange} />);
    await user.type(field(), '9');
    await user.click(field());
    await user.paste('78-9 0x');
    expect(onChange).toHaveBeenLastCalledWith('97890');
    expect(filledDots(container)).toBe(5);
    await user.paste('123456');
    expect(onChange).toHaveBeenLastCalledWith('978901');
    expect(filledDots(container)).toBe(6);
    // A paste with no digit changes nothing.
    onChange.mockClear();
    await user.paste('no digits');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('removes the last digit with Backspace, and nothing from an empty field', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <HeldPinField initial="789" onChange={onChange} />,
    );
    await user.type(field(), '{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith('78');
    expect(filledDots(container)).toBe(2);
    await user.type(field(), '{Backspace}{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith('');
    expect(filledDots(container)).toBe(0);
    onChange.mockClear();
    await user.type(field(), '{Backspace}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onComplete once, at the last digit, after onChange', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    const onComplete = vi.fn((value: string) => calls.push(`done ${value}`));
    render(
      <HeldPinField
        length={4}
        onChange={(value) => calls.push(`change ${value}`)}
        onComplete={onComplete}
      />,
    );
    await user.type(field(), '789');
    expect(onComplete).not.toHaveBeenCalled();
    await user.type(field(), '0');
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenLastCalledWith('7890');
    expect(calls.slice(-2)).toEqual(['change 7890', 'done 7890']);
    // More keys on a full field complete nothing.
    await user.type(field(), '12');
    expect(onComplete).toHaveBeenCalledTimes(1);
    // A digit deleted and entered again is a new completion.
    await user.type(field(), '{Backspace}');
    expect(onComplete).toHaveBeenCalledTimes(1);
    await user.type(field(), '5');
    expect(onComplete).toHaveBeenCalledTimes(2);
    expect(onComplete).toHaveBeenLastCalledWith('7895');
  });

  it('completes on a paste that fills it, and not for a value the consumer sets', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const view = render(
      <PinField
        label="Gate code"
        onChange={() => {}}
        onComplete={onComplete}
        value=""
      />,
    );
    view.rerender(
      <PinField
        label="Gate code"
        onChange={() => {}}
        onComplete={onComplete}
        value="123456"
      />,
    );
    expect(onComplete).not.toHaveBeenCalled();
    cleanup();
    render(<HeldPinField onComplete={onComplete} />);
    await user.click(field());
    await user.paste('789 012');
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenLastCalledWith('789012');
  });

  it('adds a digit typed with the caret moved back at the end', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HeldPinField initial="78" onChange={onChange} />);
    await user.type(field(), '9', {
      initialSelectionStart: 1,
      initialSelectionEnd: 1,
    });
    expect(onChange).toHaveBeenLastCalledWith('789');
    expect(field().value).toBe(dot.repeat(3));
  });

  it('replaces the code when everything is selected and a digit typed, and clears it with Delete', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <HeldPinField initial="789" onChange={onChange} />,
    );
    await user.type(field(), '4', {
      initialSelectionStart: 0,
      initialSelectionEnd: 3,
    });
    expect(onChange).toHaveBeenLastCalledWith('4');
    expect(field().value).toBe(dot);
    await user.type(field(), '56');
    await user.type(field(), '{Delete}', {
      initialSelectionStart: 0,
      initialSelectionEnd: 3,
    });
    expect(onChange).toHaveBeenLastCalledWith('');
    expect(field().value).toBe('');
    expect(filledDots(container)).toBe(0);
  });

  it('removes the last digit when a character is deleted from the middle', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HeldPinField initial="789" onChange={onChange} />);
    await user.type(field(), '{Backspace}', {
      initialSelectionStart: 1,
      initialSelectionEnd: 1,
    });
    expect(onChange).toHaveBeenLastCalledWith('78');
    await user.type(field(), '{Delete}', {
      initialSelectionStart: 0,
      initialSelectionEnd: 0,
    });
    expect(onChange).toHaveBeenLastCalledWith('7');
    expect(field().value).toBe(dot);
  });

  it('takes a pasted mask character for nothing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HeldPinField initial="9" onChange={onChange} />);
    await user.click(field());
    await user.paste(`${dot}7${dot}8`);
    expect(onChange).toHaveBeenLastCalledWith('978');
    expect(field().value).toBe(dot.repeat(3));
    // Mask characters alone add nothing.
    onChange.mockClear();
    await user.paste(dot.repeat(2));
    expect(onChange).not.toHaveBeenCalled();
    expect(field().value).toBe(dot.repeat(3));
  });

  it('puts the mask back when the consumer keeps its value, so no typed digit stays in the input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    // A consumer that ignores every change.
    const { container } = render(
      <PinField id="code" label="Gate code" onChange={onChange} value="12" />,
    );
    await user.type(field(), '7');
    expect(onChange).toHaveBeenLastCalledWith('127');
    expect(field().value).toBe(dot.repeat(2));
    expect(field().getAttribute('value')).toBe(dot.repeat(2));
    await user.click(field());
    await user.paste('789');
    expect(onChange).toHaveBeenLastCalledWith('12789');
    expect(field().value).toBe(dot.repeat(2));
    await user.type(field(), '{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith('1');
    expect(field().value).toBe(dot.repeat(2));
    expect(pageState(container)).not.toMatch(/[789]/);
  });

  it('puts the mask back after a digit typed on a full field and after a refused key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <HeldPinField initial="123456" onChange={onChange} />,
    );
    await user.type(field(), '7');
    await user.click(field());
    await user.paste('89');
    expect(onChange).not.toHaveBeenCalled();
    expect(field().value).toBe(dot.repeat(6));
    expect(pageState(container)).not.toMatch(/[789]/);
    cleanup();
    render(<HeldPinField initial="12" onChange={onChange} />);
    await user.type(field(), 'x');
    expect(onChange).not.toHaveBeenCalled();
    expect(field().value).toBe(dot.repeat(2));
  });

  it('takes nothing while disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <HeldPinField disabled initial="78" onChange={onChange} />,
    );
    expect(field().disabled).toBe(true);
    await user.type(field(), '9{Backspace}');
    expect(onChange).not.toHaveBeenCalled();
    expect(filledDots(container)).toBe(2);
  });

  it('shows a hint, and an error in its place that is announced and marks the input', () => {
    const view = render(
      <HeldPinField description="Six digits, not all the same." />,
    );
    const input = field();
    const hint = screen.getByText('Six digits, not all the same.');
    expect(hint.className).toBe('sw-field-description');
    expect(input.getAttribute('aria-describedby')).toBe('code-count code-hint');
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    // The error's region is there, empty, before any error.
    const region = view.container.querySelector('.sw-field-error')!;
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent).toBe('');

    view.rerender(
      <HeldPinField
        description="Six digits, not all the same."
        error="That code is not right. Try again."
      />,
    );
    expect(region.isConnected).toBe(true);
    expect(region.textContent).toBe('That code is not right. Try again.');
    expect(screen.queryByText('Six digits, not all the same.')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(
      'code-count code-error',
    );
    expect(view.container.firstElementChild!.className).toContain(
      'sw-field-invalid',
    );
  });

  it('describes the input by the count and announces it politely after each entry', async () => {
    const user = userEvent.setup();
    render(<HeldPinField />);
    const status = screen.getByRole('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.className).toBe('sw-sr-only');
    const description = document.getElementById('code-count')!;
    expect(description.hidden).toBe(true);
    expect(description.textContent).toBe('0 of 6 digits entered');
    // Nothing is said before the person enters something.
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(status.textContent).toBe('');

    await user.type(field(), '7');
    await announced('1 of 6 digits entered');
    expect(description.textContent).toBe('1 of 6 digits entered');
    await user.type(field(), '8');
    await announced('2 of 6 digits entered');
    await user.type(field(), '{Backspace}');
    await announced('1 of 6 digits entered');
  });

  it('says the count in the consumer’s words', async () => {
    const user = userEvent.setup();
    render(
      <HeldPinField
        labels={{ count: '{count} de {length} dígitos' }}
        length={4}
      />,
    );
    await user.type(field(), '9');
    await announced('1 de 4 dígitos');
  });

  it('holds the same page whatever the digits are: typing, a paste and Backspace', async () => {
    /** Enters `code` in steps and returns the page after each one. */
    async function pagesFor(code: string, user: UserEvent) {
      const onChange = vi.fn();
      const { container } = render(<HeldPinField onChange={onChange} />);
      const pages: string[] = [pageState(container)];
      const steps: [() => Promise<void>, number, string][] = [
        [() => user.type(field(), code[0]!), 1, code.slice(0, 1)],
        [() => user.type(field(), code[1]!), 2, code.slice(0, 2)],
        [() => user.paste(`${code[2]}-${code[3]} x`), 4, code.slice(0, 4)],
        [() => user.type(field(), '{Backspace}'), 3, code.slice(0, 3)],
        [() => user.type(field(), code.slice(3)), 6, code],
        [() => user.type(field(), '{Backspace}'), 5, code.slice(0, 5)],
      ];
      for (const [step, count, digits] of steps) {
        await step();
        await announced(`${count} of 6 digits entered`);
        // The entry worked: the consumer holds the digits.
        expect(onChange).toHaveBeenLastCalledWith(digits);
        pages.push(pageState(container));
      }
      cleanup();
      return pages;
    }

    const user = userEvent.setup();
    const first = await pagesFor('789987', user);
    const second = await pagesFor('123450', user);
    expect(first).toHaveLength(7);
    // Byte for byte the same DOM and input values for two different codes.
    expect(second).toEqual(first);
    for (const page of first) {
      // No digit of the code anywhere: text, attributes, the input's value.
      expect(page).not.toMatch(/[789]/);
      expect(page).not.toContain('value="7');
    }
    // The input's value attribute and property are the mask alone.
    expect(first.at(-1)).toContain(`value="${dot.repeat(5)}"`);
    expect(first.at(-1)).toContain(JSON.stringify([dot.repeat(5)]));
  });

  it('keeps a value the consumer sets out of the page too', () => {
    const { container } = render(<HeldPinField initial="789987" />);
    expect(pageState(container)).not.toMatch(/[789]/);
    expect(field().value).toBe(dot.repeat(6));
    expect(field().getAttribute('value')).toBe(dot.repeat(6));
  });

  it('passes its ref and id to the input, focuses it when asked and reads other descriptions first', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <PinField
        aria-describedby="who"
        autoFocus
        id="door"
        label="Gate code"
        labelVisuallyHidden
        onChange={() => {}}
        ref={ref}
        value=""
      />,
    );
    expect(ref.current).toBe(field());
    expect(field().id).toBe('door');
    expect(document.activeElement).toBe(field());
    expect(field().getAttribute('aria-describedby')).toBe('who door-count');
    // A hidden label still names the input and leaves no gap.
    const label = document.querySelector('label')!;
    expect(label.className).toBe('sw-sr-only');
    expect(label.parentElement!.className).toContain('sw-gap-0');
  });

  it('does not take the focus unless asked, and makes its own ids', () => {
    render(<PinField label="Gate code" onChange={() => {}} value="" />);
    expect(document.activeElement).toBe(document.body);
    const input = field();
    expect(input.id).not.toBe('');
    expect(input.getAttribute('aria-describedby')).toBe(`${input.id}-count`);
  });

  it('refuses a blank label, a bad length, a value that is not digits and a blank label word', () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
    const base = { label: 'Gate code', onChange: () => {}, value: '' };
    expect(() => render(<PinField {...base} label=" " />)).toThrow(RangeError);
    expect(() => render(<PinField {...base} length={0} />)).toThrow(RangeError);
    expect(() => render(<PinField {...base} length={13} />)).toThrow(
      RangeError,
    );
    expect(() => render(<PinField {...base} value="12a" />)).toThrow(
      RangeError,
    );
    expect(() => render(<PinField {...base} value="1234567" />)).toThrow(
      RangeError,
    );
    expect(() => render(<PinField {...base} labels={{ pad: '' }} />)).toThrow(
      RangeError,
    );
    quiet.mockRestore();
  });

  it('generates the frame, the unseen input and the dots from tokens', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-pin-field',
        'sw-pin-field-with-pad',
        'sw-pin-field-entry',
        'sw-pin-field-input',
        'sw-pin-field-dots',
        'sw-pin-field-dot',
        'sw-pin-field-dot-filled',
        'sw-pin-field-pad',
        'sw-pin-field-key',
        'sw-pin-field-key-delete',
        'sw-pin-field-glyph',
      ]),
    );
    // The input is never painted, so neither is its mask; it has no font
    // size of its own, so it keeps the canvas's (no zoom on iOS).
    const input = /\[data-theme\] input\.sw-pin-field-input \{([^}]*)\}/.exec(
      css,
    )![1]!;
    expect(input).toContain('opacity: 0;');
    expect(input).toContain('position: absolute;');
    expect(input).not.toContain('font-size');
    // Disabled too, after the canvas rule that would draw it again.
    const hidden =
      '[data-theme] input.sw-pin-field-input:disabled { opacity: 0; }';
    expect(css).toContain(hidden);
    expect(css.indexOf(hidden)).toBeGreaterThan(
      css.indexOf("[data-theme] :is(input[type='text']"),
    );
    expect(css).toContain(
      '.sw-pin-field-entry:focus-within {\n  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);\n  outline-offset: var(--sw-focus-ring-offset);\n}',
    );
    expect(css).toContain(
      '.sw-field-invalid .sw-pin-field-entry { border-color: var(--sw-color-danger); }',
    );
    expect(css).toContain(
      '.sw-pin-field-dot-filled {\n  background: var(--sw-color-text);\n  border-color: var(--sw-color-text);\n}',
    );
    expect(css).toContain(
      '.sw-pin-field-dot { border-color: CanvasText; }\n  .sw-pin-field-dot-filled { background: CanvasText; }',
    );
    // No colour of its own: every one is a token or a system colour.
    const own = css.slice(
      css.indexOf('.sw-pin-field {'),
      css.indexOf('.sw-pin-field-key:is(:disabled'),
    );
    expect(own).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
  });

  it('keeps the dots’ ring and the keys’ edge at 3:1 and the digits at 4.5:1 in every palette', () => {
    forEveryTheme((colors, label, theme) => {
      const frame = glassOverBackground(theme);
      for (const backdrop of [colors.surface, colors.subtle, frame])
        expect(
          contrastRatio(colors.muted, backdrop),
          `${label} ring or edge on ${backdrop}`,
        ).toBeGreaterThanOrEqual(3);
      for (const fill of [colors.subtle, colors.border])
        expect(
          contrastRatio(colors.text, fill),
          `${label} digit on ${fill}`,
        ).toBeGreaterThanOrEqual(4.5);
    });
  });
});
