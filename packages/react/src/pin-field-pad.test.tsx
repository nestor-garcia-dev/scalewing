import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { generateStylesheet } from './css/stylesheet.js';
import { pinMaskCharacter } from './pin-entry.js';
import {
  HeldPinField,
  pageState,
  pageStateOutsideKeyFaces,
} from './pin-field.test-support.js';

afterEach(() => cleanup());

const css = generateStylesheet();
const dot = pinMaskCharacter;

function field(): HTMLInputElement {
  return screen.getByRole('textbox', { name: 'Gate code' });
}

function pad(name = 'Number pad'): HTMLElement {
  return screen.getByRole('group', { name });
}

function key(name: string): HTMLButtonElement {
  return within(pad()).getByRole('button', { name });
}

const deleteName = 'Delete the last digit';

async function announced(words: string) {
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toBe(words),
  );
}

describe('PinField pad', () => {
  it('draws no pad unless asked', () => {
    render(<HeldPinField />);
    expect(screen.queryByRole('group')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('is a named group of twelve positions: 1 to 9, an empty one, 0 and Delete', () => {
    const { container } = render(<HeldPinField pad />);
    expect(container.firstElementChild!.className).toContain(
      'sw-pin-field-with-pad',
    );
    const positions = [...pad().children];
    expect(positions).toHaveLength(12);
    expect(positions.map((position) => position.textContent)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '',
      '0',
      '',
    ]);
    // The empty position is not a control and is hidden.
    expect(positions[9]!.tagName).toBe('SPAN');
    expect(positions[9]!.getAttribute('aria-hidden')).toBe('true');
    const buttons = within(pad()).getAllByRole('button');
    expect(buttons).toHaveLength(11);
    for (const button of buttons) {
      // Real buttons that submit nothing, each a Tab stop (Safari too).
      expect(button.tagName).toBe('BUTTON');
      expect(button.getAttribute('type')).toBe('button');
      expect(button.getAttribute('tabindex')).toBe('0');
      expect(button.className).toContain('sw-pin-field-key');
    }
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual([
      ...Array.from({ length: 10 }, () => null),
      deleteName,
    ]);
    // The Delete key's mark is decorative.
    expect(
      key(deleteName).querySelector('svg')!.getAttribute('aria-hidden'),
    ).toBe('true');
    // Still one input, before the pad, with the hint and error after it.
    expect(container.querySelectorAll('input')).toHaveLength(1);
    expect(
      field().compareDocumentPosition(pad()) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('names the pad and Delete in the consumer’s words', () => {
    render(
      <HeldPinField
        labels={{ pad: 'Teclado', delete: 'Borrar el último dígito' }}
        pad
      />,
    );
    expect(
      within(pad('Teclado')).getByRole('button', {
        name: 'Borrar el último dígito',
      }),
    ).toBeTruthy();
  });

  it('enters a digit per press, keeps the input in step and leaves the focus on the key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<HeldPinField onChange={onChange} pad />);
    await user.click(key('7'));
    expect(onChange).toHaveBeenLastCalledWith('7');
    expect(document.activeElement).toBe(key('7'));
    await user.click(key('0'));
    expect(onChange).toHaveBeenLastCalledWith('70');
    expect(document.activeElement).toBe(key('0'));
    expect(field().value).toBe(dot.repeat(2));
    expect(container.querySelectorAll('.sw-pin-field-dot-filled')).toHaveLength(
      2,
    );
    await announced('2 of 6 digits entered');
    // A key pressed from the keyboard does the same.
    key('9').focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith('7099');
    expect(document.activeElement).toBe(key('9'));
  });

  it('deletes the last digit, and keeps Delete focusable when nothing is left', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HeldPinField initial="78" onChange={onChange} pad />);
    const remove = key(deleteName);
    expect(remove.hasAttribute('aria-disabled')).toBe(false);
    await user.click(remove);
    expect(onChange).toHaveBeenLastCalledWith('7');
    await user.click(remove);
    expect(onChange).toHaveBeenLastCalledWith('');
    await announced('0 of 6 digits entered');
    // Nothing to delete: marked off, but never disabled, so focus stays.
    expect(remove.getAttribute('aria-disabled')).toBe('true');
    expect(remove.disabled).toBe(false);
    expect(document.activeElement).toBe(remove);
    onChange.mockClear();
    await user.click(remove);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('mixes with typing, stops at the length and completes once', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onComplete = vi.fn();
    render(
      <HeldPinField
        length={4}
        onChange={onChange}
        onComplete={onComplete}
        pad
      />,
    );
    await user.type(field(), '78');
    await user.click(key('9'));
    expect(onComplete).not.toHaveBeenCalled();
    await user.click(key('0'));
    expect(onChange).toHaveBeenLastCalledWith('7890');
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenLastCalledWith('7890');
    onChange.mockClear();
    await user.click(key('1'));
    expect(onChange).not.toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledTimes(1);
    await user.type(field(), '{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith('789');
  });

  it('turns the input and every key off while disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HeldPinField disabled initial="7" onChange={onChange} pad />);
    expect(field().disabled).toBe(true);
    const buttons = within(pad()).getAllByRole<HTMLButtonElement>('button');
    for (const button of buttons) expect(button.disabled).toBe(true);
    // Off, not "nothing to delete".
    expect(key(deleteName).hasAttribute('aria-disabled')).toBe(false);
    await user.click(key('8'));
    await user.click(key(deleteName));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('puts the hint and the error under the keys, so they never move', () => {
    const { container } = render(
      <HeldPinField description="Checked at the last digit." pad />,
    );
    const parts = [...container.firstElementChild!.children];
    const padAt = parts.indexOf(pad());
    expect(
      parts.indexOf(screen.getByText('Checked at the last digit.')),
    ).toBeGreaterThan(padAt);
    expect(
      parts.indexOf(container.querySelector('.sw-field-error')!),
    ).toBeGreaterThan(padAt);
  });

  it('holds the same page whatever keys are pressed, but for the keys’ own faces', async () => {
    async function pagesFor(code: string, user: UserEvent) {
      const onChange = vi.fn();
      const { container } = render(<HeldPinField onChange={onChange} pad />);
      const pages: string[] = [pageState(container)];
      const outsideFaces: string[] = [pageStateOutsideKeyFaces(container)];
      const steps: [() => Promise<void>, number, string][] = [
        [() => user.click(key(code[0]!)), 1, code.slice(0, 1)],
        [() => user.click(key(code[1]!)), 2, code.slice(0, 2)],
        [() => user.type(field(), code[2]!), 3, code.slice(0, 3)],
        [() => user.click(key(deleteName)), 2, code.slice(0, 2)],
        [() => user.click(key(code[2]!)), 3, code.slice(0, 3)],
        [() => user.click(key(code[3]!)), 4, code.slice(0, 4)],
      ];
      for (const [step, count, digits] of steps) {
        await step();
        await announced(`${count} of 6 digits entered`);
        expect(onChange).toHaveBeenLastCalledWith(digits);
        pages.push(pageState(container));
        outsideFaces.push(pageStateOutsideKeyFaces(container));
      }
      cleanup();
      return { pages, outsideFaces };
    }

    const user = userEvent.setup();
    const first = await pagesFor('7898', user);
    const second = await pagesFor('1230', user);
    // The whole DOM, the keys included, is the same for two different codes:
    // no key is marked pressed, current or last used.
    expect(second.pages).toEqual(first.pages);
    for (const page of first.outsideFaces) expect(page).not.toMatch(/[789]/);
  });

  it('generates keys of at least 64 px with an edge, the focus ring and a centred column', () => {
    const rule = /\n\.sw-pin-field-key \{([^}]*)\}/.exec(css)![1]!;
    expect(rule).toContain('min-block-size: calc(2 * var(--sw-space-6));');
    expect(rule).toContain('min-inline-size: calc(2 * var(--sw-space-6));');
    expect(rule).toContain('border: 1px solid var(--sw-color-muted);');
    expect(rule).toContain('background: var(--sw-color-subtle);');
    expect(css).toContain(
      '.sw-pin-field-key:focus-visible {\n  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);\n  outline-offset: var(--sw-focus-ring-offset);\n}',
    );
    expect(css).toContain(
      '.sw-pin-field-pad {\n  display: grid;\n  gap: var(--sw-space-2);\n  grid-template-columns: repeat(3, minmax(0, 1fr));',
    );
    expect(css).toContain(
      'margin-inline: auto;\n  max-inline-size: calc(10 * var(--sw-space-6));\n  text-align: center;\n  width: 100%;\n}',
    );
    // Forced colours draw the edge in the button text colour.
    expect(css).toContain('.sw-pin-field-key { border-color: ButtonText; }');
    // A touch never leaves the hover fill behind.
    expect(css).toContain(
      "@media (hover: hover) {\n  .sw-pin-field-key:hover:not(:disabled, [aria-disabled='true'])",
    );
  });
});
