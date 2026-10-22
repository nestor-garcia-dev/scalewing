import type { FileFieldValue } from '../FileField.js';

function isBlank(text: unknown): boolean {
  return typeof text !== 'string' || text.trim() === '';
}

/**
 * Fails closed on a FileField it cannot name or show: an empty label,
 * choose or change words, a blank drop hint, `onRemove` without its
 * words (or words without it), blank Remove words, or a chosen file with
 * no name, a blank detail or a blank preview address.
 */
export function assertFileField(props: {
  label: string;
  chooseLabel: string;
  changeLabel: string;
  dropLabel: string | undefined;
  value: FileFieldValue | null;
  onRemove: (() => void) | undefined;
  removeLabel: string | undefined;
}): void {
  for (const key of ['label', 'chooseLabel', 'changeLabel'] as const)
    if (isBlank(props[key]))
      throw new RangeError(`FileField ${key} must be non-empty text`);
  if (props.dropLabel !== undefined && isBlank(props.dropLabel))
    throw new RangeError('FileField dropLabel must be non-empty text');
  if ((props.onRemove === undefined) !== (props.removeLabel === undefined))
    throw new RangeError('FileField onRemove and removeLabel go together');
  if (props.removeLabel !== undefined && isBlank(props.removeLabel))
    throw new RangeError('FileField removeLabel must be non-empty text');
  if (props.value === null) return;
  if (isBlank(props.value.name))
    throw new RangeError('FileField value name must be non-empty text');
  if (props.value.detail !== undefined && isBlank(props.value.detail))
    throw new RangeError('FileField value detail must be non-empty text');
  if (props.value.preview !== undefined && isBlank(props.value.preview))
    throw new RangeError('FileField value preview must be an image address');
}
