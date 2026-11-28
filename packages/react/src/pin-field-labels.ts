/**
 * Words the PinField speaks on its own. Products pass their translations.
 */
export type PinFieldLabels = {
  /**
   * How many digits are entered, read with the field and announced after
   * each entry: `{count}` and `{length}` are replaced by the numbers.
   */
  count: string;
  /** The pad's Delete key's name. */
  delete: string;
  /** The pad's name: its keys are a group. */
  pad: string;
};

export const defaultPinFieldLabels: PinFieldLabels = {
  count: '{count} of {length} digits entered',
  delete: 'Delete the last digit',
  pad: 'Number pad',
};

/** Consumer labels over the English defaults; empty strings fail closed. */
export function resolvePinFieldLabels(
  labels: Partial<PinFieldLabels> = {},
): PinFieldLabels {
  const resolved = { ...defaultPinFieldLabels, ...labels };
  for (const [key, text] of Object.entries(resolved))
    if (typeof text !== 'string' || text.trim() === '')
      throw new RangeError(`labels.${key} must be non-empty text`);
  return resolved;
}
