import { type MultiSelectProps } from './types.js';

function isBlank(text: unknown): boolean {
  return typeof text !== 'string' || !text.trim();
}

/** Fails closed on words or options a MultiSelect cannot show. */
export function assertMultiSelect({
  allLabel,
  align,
  clearLabel,
  label,
  options,
  summary,
  value,
}: Pick<
  MultiSelectProps,
  | 'allLabel'
  | 'align'
  | 'clearLabel'
  | 'label'
  | 'options'
  | 'summary'
  | 'value'
>): void {
  if (isBlank(label) || isBlank(summary))
    throw new RangeError('MultiSelect needs a label and a summary');
  if (isBlank(allLabel) || isBlank(clearLabel))
    throw new RangeError('MultiSelect needs an allLabel and a clearLabel');
  if (options.length === 0)
    throw new RangeError('MultiSelect needs at least one option');
  const values = new Set<string>();
  for (const option of options) {
    if (isBlank(option.value) || isBlank(option.label))
      throw new RangeError('MultiSelect options need a value and a label');
    if (values.has(option.value))
      throw new RangeError(`Duplicate MultiSelect value: ${option.value}`);
    values.add(option.value);
  }
  for (const checked of value)
    if (!values.has(checked))
      throw new RangeError(`Unknown MultiSelect value: ${checked}`);
  if (align !== undefined && align !== 'start' && align !== 'end')
    throw new RangeError(`Unknown MultiSelect align: ${String(align)}`);
}
