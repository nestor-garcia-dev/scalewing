import { badgeTones } from '../../css/css-data.js';
import {
  type ComboboxBadge,
  type ComboboxProps,
  comboboxSizes,
} from './types.js';

function blank(text: string | undefined): boolean {
  return typeof text !== 'string' || !text.trim();
}

function assertBadge(badge: ComboboxBadge | undefined): void {
  if (badge === undefined) return;
  if (blank(badge.label))
    throw new RangeError('A Combobox badge needs a nonempty label');
  if (badge.tone !== undefined && !badgeTones.includes(badge.tone))
    throw new RangeError(`Unknown Combobox badge tone: ${String(badge.tone)}`);
}

/** Fails closed on blank words, duplicate values and unknown sizes. */
export function assertCombobox(props: ComboboxProps): void {
  if (blank(props.label))
    throw new RangeError('Combobox needs a nonempty label');
  if (blank(props.emptyText))
    throw new RangeError('Combobox needs a nonempty emptyText');
  if (props.listLabel !== undefined && blank(props.listLabel))
    throw new RangeError('A Combobox listLabel must not be blank');
  if (props.size !== undefined && !comboboxSizes.includes(props.size))
    throw new RangeError(`Unknown Combobox size: ${String(props.size)}`);
  const values = new Set<string>();
  for (const group of props.groups) {
    if (group.label !== undefined && blank(group.label))
      throw new RangeError('A Combobox group label must not be blank');
    for (const option of group.options) {
      if (blank(option.value) || blank(option.label))
        throw new RangeError(
          'Combobox options need nonempty values and labels',
        );
      if (values.has(option.value))
        throw new RangeError(`Duplicate Combobox option: ${option.value}`);
      values.add(option.value);
      assertBadge(option.badge);
    }
  }
  if (props.action) {
    if (blank(props.action.label))
      throw new RangeError('A Combobox action needs a nonempty label');
    if (typeof props.action.onPress !== 'function')
      throw new TypeError('A Combobox action needs onPress');
    assertBadge(props.action.badge);
  }
}
