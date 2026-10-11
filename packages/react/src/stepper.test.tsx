import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Stepper, type StepperProps } from './components/Stepper.js';
import { cssStepperClasses } from './css/css-stepper.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const names = { decrementLabel: 'One less', incrementLabel: 'One more' };

type Overrides = Partial<Omit<StepperProps, 'value' | 'onChange'>> & {
  initial?: number | null;
  spy?: (value: number | null) => void;
};

/** A controlled Stepper, as a consumer holds it. */
function Counted({ initial = null, spy, ...props }: Overrides) {
  const [value, setValue] = useState<number | null>(initial);
  return (
    <Stepper
      label="Herons"
      max={10}
      {...names}
      {...props}
      onChange={(next) => {
        spy?.(next);
        setValue(next);
      }}
      value={value}
    />
  );
}

function parts() {
  return {
    count: screen.getByRole('spinbutton') as HTMLInputElement,
    less: screen.getByRole('button', { name: 'One less' }) as HTMLButtonElement,
    more: screen.getByRole('button', { name: 'One more' }) as HTMLButtonElement,
  };
}

describe('Stepper semantics', () => {
  it('is a labelled spin button between two named buttons in one group', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Counted initial={4} ref={ref} valueText="4 herons" />);
    const { count, less, more } = parts();
    expect(screen.getByRole('spinbutton', { name: 'Herons' })).toBe(count);
    expect(ref.current).toBe(count);
    expect(screen.getByRole('group', { name: 'Herons' }).contains(count)).toBe(
      true,
    );
    expect(count.getAttribute('inputmode')).toBe('numeric');
    expect(count.getAttribute('aria-valuemin')).toBe('0');
    expect(count.getAttribute('aria-valuemax')).toBe('10');
    expect(count.getAttribute('aria-valuenow')).toBe('4');
    expect(count.getAttribute('aria-valuetext')).toBe('4 herons');
    expect(count.value).toBe('4');
    // One tab stop: the buttons are pointer targets that control the count.
    for (const button of [less, more]) {
      expect(button.tabIndex).toBe(-1);
      expect(button.getAttribute('aria-controls')).toBe(count.id);
      expect(button.getAttribute('type')).toBe('button');
    }
  });

  it('has no valuenow or valuemax for an empty, open-topped count', () => {
    render(<Counted max={undefined} placeholder="0" />);
    const { count } = parts();
    expect(count.hasAttribute('aria-valuenow')).toBe(false);
    expect(count.hasAttribute('aria-valuemax')).toBe(false);
    expect(count.value).toBe('');
    expect(count.placeholder).toBe('0');
  });

  it('can hide its label and still be named by it', () => {
    render(<Counted labelVisuallyHidden />);
    expect(screen.getByRole('spinbutton', { name: 'Herons' })).toBeTruthy();
    expect(screen.getByText('Herons').closest('label')!.className).toBe(
      'sw-sr-only',
    );
  });

  it('describes the count by its error in a polite region and marks it invalid', () => {
    const { rerender } = render(
      <Stepper label="Herons" onChange={vi.fn()} value={12} {...names} />,
    );
    const { count } = parts();
    expect(count.hasAttribute('aria-invalid')).toBe(false);
    rerender(
      <Stepper
        error="Only 10 nests."
        label="Herons"
        onChange={vi.fn()}
        value={12}
        {...names}
      />,
    );
    expect(parts().count).toBe(count);
    expect(count.getAttribute('aria-invalid')).toBe('true');
    const message = screen.getByText('Only 10 nests.');
    expect(message.getAttribute('aria-live')).toBe('polite');
    expect(count.getAttribute('aria-describedby')).toBe(message.id);
    expect(count.closest('.sw-stepper')!.className).toContain(
      'sw-stepper-invalid',
    );
    rerender(
      <Stepper label="Herons" onChange={vi.fn()} value={9} {...names} />,
    );
    expect(count.hasAttribute('aria-describedby')).toBe(false);
    expect(count.hasAttribute('aria-invalid')).toBe(false);
    expect(message.textContent).toBe('');
  });

  it('maps width to its class and takes the text keyboard below zero', () => {
    render(<Counted min={-5} width="full" />);
    const { count } = parts();
    expect(count.closest('.sw-stepper')!.className).toBe(
      'sw-stepper sw-stepper-full',
    );
    expect(count.getAttribute('inputmode')).toBe('text');
  });

  it('takes the changed look unless it has an error', () => {
    const { rerender } = render(
      <Stepper
        changed
        label="Herons"
        onChange={vi.fn()}
        value={2}
        {...names}
      />,
    );
    const root = () => parts().count.closest('.sw-stepper')!;
    expect(root().className).toContain('sw-stepper-changed');
    rerender(
      <Stepper
        changed
        error="Too many."
        label="Herons"
        onChange={vi.fn()}
        value={2}
        {...names}
      />,
    );
    expect(root().className).not.toContain('sw-stepper-changed');
  });

  it('refuses bounds that are not a range of whole numbers', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Counted min={5} max={2} />)).toThrow(RangeError);
    expect(() => render(<Counted step={0} />)).toThrow(RangeError);
    expect(() =>
      render(
        <Stepper label="Herons" onChange={vi.fn()} value={1.5} {...names} />,
      ),
    ).toThrow(RangeError);
    vi.restoreAllMocks();
  });
});

describe('Stepper changes', () => {
  it('steps with the buttons and stops each at its bound', () => {
    const spy = vi.fn();
    render(<Counted initial={9} spy={spy} />);
    const { count, less, more } = parts();
    expect(less.disabled).toBe(false);
    fireEvent.click(more);
    expect(spy).toHaveBeenLastCalledWith(10);
    expect(count.value).toBe('10');
    expect(more.disabled).toBe(true);
    fireEvent.click(less);
    expect(spy).toHaveBeenLastCalledWith(9);
  });

  it('starts an empty box from min', () => {
    const spy = vi.fn();
    render(<Counted spy={spy} />);
    const { less, more } = parts();
    expect(less.disabled).toBe(true);
    fireEvent.click(more);
    expect(spy).toHaveBeenLastCalledWith(1);
  });

  it('keeps focus on the count when a button is pressed', () => {
    render(<Counted initial={3} />);
    const { count, more } = parts();
    count.focus();
    const press = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    more.dispatchEvent(press);
    expect(press.defaultPrevented).toBe(true);
  });

  it('steps with ArrowUp and ArrowDown and leaves other keys alone', () => {
    const spy = vi.fn();
    render(<Counted initial={0} spy={spy} />);
    const { count } = parts();
    fireEvent.keyDown(count, { key: 'ArrowDown' });
    expect(spy).not.toHaveBeenCalled();
    fireEvent.keyDown(count, { key: 'ArrowUp' });
    expect(spy).toHaveBeenLastCalledWith(1);
    fireEvent.keyDown(count, { key: 'Tab' });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('goes to min with Home and to a finite max with End', () => {
    const spy = vi.fn();
    const { unmount } = render(<Counted initial={4} spy={spy} />);
    const { count } = parts();
    fireEvent.keyDown(count, { key: 'End' });
    expect(spy).toHaveBeenLastCalledWith(10);
    fireEvent.keyDown(count, { key: 'Home' });
    expect(spy).toHaveBeenLastCalledWith(0);
    unmount();
    // Without a max, End is left to the text box (the caret).
    const open = vi.fn();
    render(<Counted initial={4} max={undefined} spy={open} />);
    const end = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'End',
    });
    parts().count.dispatchEvent(end);
    expect(end.defaultPrevented).toBe(false);
    expect(open).not.toHaveBeenCalled();
  });

  it('reports a typed count as typed, even past max, and an emptied box as null', () => {
    const spy = vi.fn();
    render(<Counted initial={2} spy={spy} />);
    const { count, less, more } = parts();
    fireEvent.change(count, { target: { value: '25' } });
    expect(spy).toHaveBeenLastCalledWith(25);
    expect(more.disabled).toBe(true);
    // − moves a count past max back inside the range.
    fireEvent.click(less);
    expect(spy).toHaveBeenLastCalledWith(10);
    fireEvent.change(count, { target: { value: '' } });
    expect(spy).toHaveBeenLastCalledWith(null);
  });

  it('refuses text that is not a whole count and keeps the last text', () => {
    const spy = vi.fn();
    render(<Counted initial={2} spy={spy} />);
    const { count } = parts();
    for (const text of ['2.5', '2a', '-2']) {
      fireEvent.change(count, { target: { value: text } });
      expect(count.value).toBe('2');
    }
    expect(spy).not.toHaveBeenCalled();
  });

  it('keeps leading zeros while typing and writes the plain count on blur', () => {
    const spy = vi.fn();
    render(<Counted spy={spy} />);
    const { count } = parts();
    fireEvent.change(count, { target: { value: '007' } });
    expect(spy).toHaveBeenLastCalledWith(7);
    expect(count.value).toBe('007');
    fireEvent.blur(count);
    expect(count.value).toBe('7');
  });

  it('takes a negative count when min is below zero', () => {
    const spy = vi.fn();
    render(<Counted min={-5} spy={spy} />);
    const { count } = parts();
    fireEvent.change(count, { target: { value: '-' } });
    expect(count.value).toBe('-');
    expect(spy).not.toHaveBeenCalled();
    fireEvent.change(count, { target: { value: '-3' } });
    expect(spy).toHaveBeenLastCalledWith(-3);
  });

  it('shows a count the consumer replaces, not the stale typed text', () => {
    const { rerender } = render(
      <Stepper label="Herons" onChange={vi.fn()} value={null} {...names} />,
    );
    const { count } = parts();
    fireEvent.change(count, { target: { value: '04' } });
    rerender(
      <Stepper label="Herons" onChange={vi.fn()} value={8} {...names} />,
    );
    expect(count.value).toBe('8');
  });

  it('is fixed when disabled and read-only', () => {
    const spy = vi.fn();
    const { rerender } = render(<Counted disabled initial={3} spy={spy} />);
    let { count, less, more } = parts();
    expect(count.disabled).toBe(true);
    expect(less.disabled && more.disabled).toBe(true);
    rerender(<Counted initial={3} readOnly spy={spy} />);
    ({ count } = parts());
    expect(count.readOnly).toBe(true);
    expect(count.closest('.sw-stepper')!.className).toContain(
      'sw-stepper-readonly',
    );
    fireEvent.keyDown(count, { key: 'ArrowUp' });
    // jsdom keeps them; CSS hides them (visibility), which e2e/stepper.spec.ts checks.
    ({ less, more } = {
      less: screen.getByRole('button', {
        name: 'One less',
        hidden: true,
      }) as HTMLButtonElement,
      more: screen.getByRole('button', {
        name: 'One more',
        hidden: true,
      }) as HTMLButtonElement,
    });
    expect(less.disabled && more.disabled).toBe(true);
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('Stepper CSS', () => {
  const css = cssStepperClasses();

  it('lists its classes in the catalog and the stylesheet', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-stepper',
        'sw-stepper-full',
        'sw-stepper-track',
        'sw-stepper-button',
        'sw-stepper-input',
        'sw-stepper-invalid',
        'sw-stepper-changed',
        'sw-stepper-readonly',
      ]),
    );
    expect(generateStylesheet()).toContain(css);
  });

  it('sizes every part from tokens: the md control height and spacing step 6 buttons', () => {
    expect(css).toContain('min-height: var(--sw-control-md-min-height);');
    expect(css).toContain(
      'grid-template-columns: var(--sw-space-6) auto var(--sw-space-6);',
    );
    expect(css).toContain('font-variant-numeric: tabular-nums;');
    expect(css).not.toMatch(/#[0-9a-f]{3,6}\b/i);
  });

  it('beats the canvas text-input rule at equal specificity and keeps forced-color borders', () => {
    expect(css).toContain('[data-theme] input.sw-stepper-input {');
    expect(css).toContain(
      '.sw-stepper-readonly .sw-stepper-button { visibility: hidden; }',
    );
    expect(css).toMatch(/forced-colors: active[\s\S]*Mark[\s\S]*Highlight/);
    const sheet = generateStylesheet();
    expect(
      sheet.indexOf('[data-theme] input.sw-stepper-input {'),
    ).toBeGreaterThan(sheet.indexOf("[data-theme] :is(input[type='text']"));
  });
});
