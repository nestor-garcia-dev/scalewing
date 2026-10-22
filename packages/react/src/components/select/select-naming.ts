/**
 * How a Select is named: by its own `label` (drawn, or visually hidden),
 * or by words the page already draws, through `aria-labelledby`.
 */
export type SelectNaming =
  | {
      /** The select's own label, drawn above it as Field's. */
      label: string;
      /** Keeps the label for assistive technology only, for toolbar chrome. */
      labelVisuallyHidden?: boolean;
      'aria-labelledby'?: undefined;
    }
  | {
      /**
       * The id of words the page draws for this choice, such as a heading
       * or a label beside it: the select draws no label of its own, so
       * the name is drawn, and read, once.
       */
      'aria-labelledby': string;
      label?: undefined;
      labelVisuallyHidden?: undefined;
      /** No mark: the page draws the words, and any mark, itself. */
      requiredMark?: undefined;
    };

function isBlank(text: unknown): boolean {
  return typeof text !== 'string' || text.trim() === '';
}

/**
 * Fails closed on a Select with no name, or with both: a blank `label`
 * without `aria-labelledby`, a blank `aria-labelledby`, the two together
 * (one would silently hide the other), or `requiredMark` with
 * `aria-labelledby` (there is no label to mark).
 */
export function assertSelectNaming(naming: {
  label: unknown;
  labelVisuallyHidden: unknown;
  labelledBy: unknown;
  requiredMark: unknown;
}): void {
  if (naming.labelledBy === undefined) {
    if (isBlank(naming.label))
      throw new RangeError('Select needs a label or aria-labelledby');
    return;
  }
  if (isBlank(naming.labelledBy))
    throw new RangeError('Select aria-labelledby must be a non-empty id');
  if (naming.label !== undefined || naming.labelVisuallyHidden !== undefined)
    throw new RangeError(
      'Select takes label (and labelVisuallyHidden) or aria-labelledby, not both',
    );
  if (naming.requiredMark !== undefined)
    throw new RangeError(
      'Select requiredMark needs label: with aria-labelledby the page draws the mark',
    );
}
