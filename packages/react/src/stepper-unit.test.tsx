import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { Stepper, type StepperProps } from './components/Stepper.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

type Overrides = Partial<Omit<StepperProps, 'value' | 'onChange'>> & {
  initial?: number | null;
};

/** A controlled Stepper with a unit, as a consumer holds it. */
function Timed({ initial = 90, ...props }: Overrides) {
  const [value, setValue] = useState<number | null>(initial);
  return (
    <Stepper
      decrementLabel="One less"
      incrementLabel="One more"
      label="Dive time"
      unit="min"
      {...props}
      onChange={setValue}
      value={value}
    />
  );
}

function count() {
  return screen.getByRole('spinbutton') as HTMLInputElement;
}

describe('Stepper unit', () => {
  it('shows a muted word after the count, inside one frame, hidden from assistive technology', () => {
    render(<Timed />);
    const frame = count().parentElement!;
    expect(frame.className).toBe('sw-stepper-count');
    const unit = frame.lastElementChild!;
    expect(unit.className).toBe('sw-stepper-unit');
    expect(unit.textContent).toBe('min');
    expect(unit.getAttribute('aria-hidden')).toBe('true');
    expect(count().value).toBe('90');
    // The name stays the label: the unit is said with the value instead.
    expect(screen.getByRole('spinbutton', { name: 'Dive time' })).toBe(count());
  });

  it('reads the count with its unit, following the value', () => {
    render(<Timed />);
    expect(count().getAttribute('aria-valuetext')).toBe('90 min');
    fireEvent.click(screen.getByRole('button', { name: 'One more' }));
    expect(count().getAttribute('aria-valuetext')).toBe('91 min');
    fireEvent.change(count(), { target: { value: '' } });
    expect(count().hasAttribute('aria-valuetext')).toBe(false);
  });

  it("lets the consumer's valueText win", () => {
    render(<Timed valueText="Ninety minutes" />);
    expect(count().getAttribute('aria-valuetext')).toBe('Ninety minutes');
  });

  it('draws no frame without a unit', () => {
    render(<Timed unit={undefined} />);
    expect(count().parentElement!.className).toBe('sw-stepper-track');
    expect(document.querySelector('.sw-stepper-unit')).toBeNull();
    expect(count().hasAttribute('aria-valuetext')).toBe(false);
  });

  it('focuses the count when the unit is pressed, never a disabled one', () => {
    const { rerender } = render(<Timed />);
    fireEvent.mouseDown(document.querySelector('.sw-stepper-unit')!);
    expect(document.activeElement).toBe(count());
    count().blur();
    rerender(<Timed disabled />);
    fireEvent.mouseDown(document.querySelector('.sw-stepper-unit')!);
    expect(document.activeElement).not.toBe(count());
  });

  it('leaves a press on the count itself to the browser', () => {
    render(<Timed />);
    expect(fireEvent.mouseDown(count())).toBe(true);
    expect(
      fireEvent.mouseDown(document.querySelector('.sw-stepper-unit')!),
    ).toBe(false);
  });

  it('frames an invalid, a changed and a full-width count', () => {
    render(
      <>
        <Timed error="Too long" label="Late" />
        <Timed changed label="Moved" />
        <Timed label="Wide" width="full" />
      </>,
    );
    const frame = (name: string) =>
      screen.getByRole('spinbutton', { name }).parentElement!;
    expect(frame('Late').className).toBe('sw-stepper-count');
    expect(frame('Late').closest('.sw-stepper')!.className).toContain(
      'sw-stepper-invalid',
    );
    expect(
      screen
        .getByRole('spinbutton', { name: 'Late' })
        .getAttribute('aria-invalid'),
    ).toBe('true');
    expect(frame('Moved').closest('.sw-stepper')!.className).toContain(
      'sw-stepper-changed',
    );
    expect(frame('Wide').closest('.sw-stepper')!.className).toContain(
      'sw-stepper-full',
    );
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-stepper-changed .sw-stepper-count {\n  border-color: var(--sw-color-accent);',
    );
    expect(css).toContain(
      '.sw-stepper-full .sw-stepper-count { display: flex; }',
    );
  });

  it('keeps a read-only count framed and focusable from its unit, the buttons hidden', () => {
    render(<Timed readOnly />);
    expect(count().closest('.sw-stepper')!.className).toContain(
      'sw-stepper-readonly',
    );
    expect(count().readOnly).toBe(true);
    screen
      .getAllByRole('button', { hidden: true })
      .forEach((button) => expect(button.hasAttribute('disabled')).toBe(true));
    fireEvent.mouseDown(document.querySelector('.sw-stepper-unit')!);
    expect(document.activeElement).toBe(count());
  });

  it('gives a disabled count only the disabled look, even invalid or changed', () => {
    render(
      <>
        <Timed changed disabled label="Locked, moved" />
        <Timed disabled error="Too long" label="Locked, late" />
      </>,
    );
    for (const name of ['Locked, moved', 'Locked, late']) {
      const input = screen.getByRole('spinbutton', { name });
      expect(input).toHaveProperty('disabled', true);
      expect(input.parentElement!.className).toBe('sw-stepper-count');
    }
    // The disabled frame rule outranks the invalid, changed and tinted ones.
    const css = generateStylesheet();
    const disabled = css.indexOf(
      '.sw-stepper .sw-stepper-count:has(> input:disabled) {',
    );
    for (const state of [
      '.sw-stepper-invalid .sw-stepper-count {',
      '.sw-stepper-changed .sw-stepper-count {',
      '.sw-stepper-changed .sw-stepper-count:not(:has(> input:placeholder-shown)) {',
    ])
      expect(css.indexOf(state)).toBeLessThan(disabled);
  });

  it('refuses a blank unit', () => {
    expect(() => render(<Timed unit="" />)).toThrow(RangeError);
    expect(() => render(<Timed unit="   " />)).toThrow(RangeError);
  });

  it('generates the frame, its states and forced colours', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-stepper-count', 'sw-stepper-unit']),
    );
    expect(css).toContain('.sw-stepper-count:focus-within {');
    expect(css).toContain(
      '.sw-stepper-invalid .sw-stepper-count { border-color: var(--sw-color-danger); }',
    );
    expect(css).toMatch(
      /\.sw-stepper \.sw-stepper-count:has\(> input:disabled\) \{[^}]*border-style: dashed;[^}]*background-image: none;\s*border-color: var\(--sw-color-border\);\s*box-shadow: none;/,
    );
    expect(css).toContain('.sw-stepper-unit { color: CanvasText; }');
    // The input inside keeps its few-digit width, its digits against the unit.
    expect(css).toMatch(
      /\.sw-stepper-count > input\.sw-stepper-input \{[^}]*inline-size: 5ch;[^}]*text-align: end;/,
    );
  });
});
