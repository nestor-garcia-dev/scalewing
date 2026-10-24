import { describe, expect, it } from 'vitest';

import {
  assertStepperBounds,
  assertStepperUnit,
  readStepperEntry,
  stepperMoves,
  stepperText,
  stepperValueText,
} from './stepper-count.js';

const counts = { min: 0, max: 10, step: 1 };

describe('stepper bounds', () => {
  it('takes whole bounds and an open top', () => {
    expect(() => assertStepperBounds(counts)).not.toThrow();
    expect(() =>
      assertStepperBounds({ min: -5, max: Infinity, step: 5 }),
    ).not.toThrow();
  });

  it('refuses fractions, a reversed range and a step that does not move', () => {
    expect(() => assertStepperBounds({ ...counts, min: 0.5 })).toThrow(
      RangeError,
    );
    expect(() => assertStepperBounds({ ...counts, max: Number.NaN })).toThrow(
      RangeError,
    );
    expect(() => assertStepperBounds({ ...counts, step: 1.5 })).toThrow(
      RangeError,
    );
    expect(() => assertStepperBounds({ min: 3, max: 2, step: 1 })).toThrow(
      /greater than max/,
    );
    expect(() => assertStepperBounds({ ...counts, step: 0 })).toThrow(
      /greater than zero/,
    );
  });
});

describe('stepper moves', () => {
  it('steps inside the range and stops each button at its bound', () => {
    expect(stepperMoves(4, counts, false)).toEqual({ down: 3, up: 5 });
    expect(stepperMoves(0, counts, false)).toEqual({ down: null, up: 1 });
    expect(stepperMoves(10, counts, false)).toEqual({ down: 9, up: null });
  });

  it('counts an empty box as min', () => {
    expect(stepperMoves(null, counts, false)).toEqual({ down: null, up: 1 });
    expect(stepperMoves(null, { min: 5, max: 10, step: 5 }, false)).toEqual({
      down: null,
      up: 10,
    });
  });

  it('clamps a step that passes a bound, and moves a typed count back inside', () => {
    const fives = { min: 0, max: 12, step: 5 };
    expect(stepperMoves(10, fives, false)).toEqual({ down: 5, up: 12 });
    expect(stepperMoves(2, fives, false)).toEqual({ down: 0, up: 7 });
    expect(stepperMoves(40, counts, false)).toEqual({ down: 10, up: null });
    expect(stepperMoves(-3, counts, false)).toEqual({ down: null, up: 0 });
  });

  it('stops both buttons when locked', () => {
    expect(stepperMoves(4, counts, true)).toEqual({ down: null, up: null });
  });
});

describe('stepper entry', () => {
  it('reads digits as a count and an empty box as none', () => {
    expect(readStepperEntry('12', false)).toEqual({ kind: 'count', value: 12 });
    expect(readStepperEntry('007', false)).toEqual({ kind: 'count', value: 7 });
    expect(readStepperEntry('', false)).toEqual({ kind: 'empty' });
  });

  it('refuses anything but digits', () => {
    for (const text of ['1.5', '1,200', '12a', ' 3', '+2', '-1', '-'])
      expect(readStepperEntry(text, false)).toEqual({ kind: 'refused' });
    expect(readStepperEntry('99999999999999999999', false)).toEqual({
      kind: 'refused',
    });
  });

  it('takes a leading minus when the range goes below zero', () => {
    expect(readStepperEntry('-4', true)).toEqual({ kind: 'count', value: -4 });
    expect(readStepperEntry('-', true)).toEqual({ kind: 'empty' });
    expect(readStepperEntry('-0', true)).toEqual({ kind: 'count', value: 0 });
    expect(readStepperEntry('4-', true)).toEqual({ kind: 'refused' });
  });

  it('writes a count as plain digits and none as an empty box', () => {
    expect(stepperText(12)).toBe('12');
    expect(stepperText(null)).toBe('');
  });
});

describe('stepper unit', () => {
  it('takes no unit or a word, and refuses a blank one', () => {
    expect(() => assertStepperUnit(undefined)).not.toThrow();
    expect(() => assertStepperUnit('min')).not.toThrow();
    expect(() => assertStepperUnit('')).toThrow(RangeError);
    expect(() => assertStepperUnit('  ')).toThrow(RangeError);
  });

  it('reads the count with its unit unless the consumer says it in words', () => {
    expect(stepperValueText(90, 'min', undefined)).toBe('90 min');
    expect(stepperValueText(11, ' players ', undefined)).toBe('11 players');
    expect(stepperValueText(90, 'min', 'Ninety minutes')).toBe(
      'Ninety minutes',
    );
    expect(stepperValueText(null, 'min', undefined)).toBeUndefined();
    expect(stepperValueText(4, undefined, undefined)).toBeUndefined();
    expect(stepperValueText(4, undefined, '4 herons')).toBe('4 herons');
  });
});
