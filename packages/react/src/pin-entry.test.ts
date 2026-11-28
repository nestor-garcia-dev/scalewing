import { describe, expect, it } from 'vitest';

import {
  assertPinLength,
  assertPinValue,
  pinCountText,
  pinMask,
  pinMaskCharacter,
  readPinEntry,
} from './pin-entry.js';
import {
  defaultPinFieldLabels,
  resolvePinFieldLabels,
} from './pin-field-labels.js';

const dot = pinMaskCharacter;

describe('pin entry', () => {
  it('masks a count with one character that is not a digit for each digit', () => {
    expect(pinMask(0)).toBe('');
    expect(pinMask(3)).toBe(dot.repeat(3));
    expect(/[0-9]/.test(dot)).toBe(false);
  });

  it('adds typed digits after the ones the mask still stands for', () => {
    expect(readPinEntry('7', '', 6)).toBe('7');
    expect(readPinEntry(`${dot}${dot}8`, '79', 6)).toBe('798');
    // Typed with the caret moved back: still added last.
    expect(readPinEntry(`${dot}8${dot}`, '79', 6)).toBe('798');
  });

  it('drops everything that is not an ASCII digit', () => {
    expect(readPinEntry(`${dot}a-8 x.9`, '7', 6)).toBe('789');
    expect(readPinEntry('abc', '', 6)).toBe('');
    // Full-width and Arabic-Indic digits are not kept.
    expect(readPinEntry('１٢3', '', 6)).toBe('3');
  });

  it('removes from the end when mask characters are deleted', () => {
    expect(readPinEntry(`${dot}${dot}`, '789', 6)).toBe('78');
    expect(readPinEntry('', '789', 6)).toBe('');
    // A selection replaced by a digit.
    expect(readPinEntry('4', '789', 6)).toBe('4');
  });

  it('cuts a paste to the length, keeping the digits already entered', () => {
    expect(readPinEntry('12 34 56 78', '', 6)).toBe('123456');
    expect(readPinEntry(`${dot}${dot}123456`, '78', 6)).toBe('781234');
    expect(readPinEntry(`${dot.repeat(6)}9`, '123456', 6)).toBe('123456');
  });

  it('never keeps more digits than there were for stray mask characters', () => {
    expect(readPinEntry(dot.repeat(5), '78', 6)).toBe('78');
  });

  it('fills the count template', () => {
    expect(pinCountText('{count} of {length} digits entered', 3, 6)).toBe(
      '3 of 6 digits entered',
    );
    expect(pinCountText('{length}: {count}/{length}', 0, 4)).toBe('4: 0/4');
  });

  it('refuses a length that is not a whole number from 1 to 12', () => {
    for (const length of [0, -1, 2.5, 13, Number.NaN])
      expect(() => assertPinLength(length)).toThrow(RangeError);
    expect(() => assertPinLength(1)).not.toThrow();
    expect(() => assertPinLength(12)).not.toThrow();
  });

  it('refuses a value that is not digits or is too long', () => {
    expect(() => assertPinValue('12a', 6)).toThrow(RangeError);
    expect(() => assertPinValue(' 12', 6)).toThrow(RangeError);
    expect(() => assertPinValue('１２', 6)).toThrow(RangeError);
    expect(() => assertPinValue('1234567', 6)).toThrow(RangeError);
    expect(() => assertPinValue('', 6)).not.toThrow();
    expect(() => assertPinValue('123456', 6)).not.toThrow();
  });

  it('resolves labels over the English defaults and refuses a blank one', () => {
    expect(resolvePinFieldLabels()).toEqual(defaultPinFieldLabels);
    expect(resolvePinFieldLabels({ pad: 'Teclado' }).pad).toBe('Teclado');
    expect(resolvePinFieldLabels({ pad: 'Teclado' }).delete).toBe(
      'Delete the last digit',
    );
    expect(() => resolvePinFieldLabels({ delete: ' ' })).toThrow(RangeError);
  });
});
