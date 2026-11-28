/**
 * The character a PinField's input holds in place of each digit entered.
 * The input's DOM value is only ever a run of these, so the digits are
 * never in the page: not in the input's `value`, nor in any attribute.
 */
export const pinMaskCharacter = '•';

export const defaultPinLength = 6;

/** The most digits a PinField takes: its dots still fit a 390 px column. */
export const maxPinLength = 12;

/** Fails closed on a length that is not a whole number from 1 to the cap. */
export function assertPinLength(length: number): void {
  if (!Number.isInteger(length) || length < 1 || length > maxPinLength)
    throw new RangeError(
      `PinField length must be a whole number from 1 to ${maxPinLength}`,
    );
}

/** Fails closed on a value that is not ASCII digits or is past `length`. */
export function assertPinValue(value: string, length: number): void {
  if (typeof value !== 'string' || /[^0-9]/.test(value))
    throw new RangeError('PinField value must hold only the digits 0 to 9');
  if (value.length > length)
    throw new RangeError('PinField value is longer than its length');
}

/** What the input holds for `count` digits entered: one mask character each. */
export function pinMask(count: number): string {
  return pinMaskCharacter.repeat(count);
}

/**
 * The digits after an edit of the input. `edited` is the input's text once
 * the browser applied a key, a paste or a deletion to the mask: the mask
 * characters left say how many of the earlier digits survive (always the
 * first ones: the entry adds and removes at its end), and the ASCII digits
 * in it are the new ones, in order. Anything else is dropped, and the result
 * is cut to `length`.
 */
export function readPinEntry(
  edited: string,
  value: string,
  length: number,
): string {
  // A typed or pasted mask character only counts toward the earlier digits
  // that survive (capped at how many there were); it is never a new digit.
  const kept = Math.min(
    edited.split(pinMaskCharacter).length - 1,
    value.length,
  );
  const typed = edited.replace(/[^0-9]/g, '');
  return (value.slice(0, kept) + typed).slice(0, length);
}

/** The count's words: `{count}` and `{length}` replaced in the template. */
export function pinCountText(
  template: string,
  count: number,
  length: number,
): string {
  return template
    .replaceAll('{count}', String(count))
    .replaceAll('{length}', String(length));
}
