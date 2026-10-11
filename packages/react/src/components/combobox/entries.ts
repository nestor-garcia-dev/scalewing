import {
  type ComboboxAction,
  type ComboboxGroup,
  type ComboboxOption,
} from './types.js';

/** One row the arrow keys move over: an option in a group, or the action. */
export type ComboboxEntry =
  | {
      kind: 'option';
      key: string;
      id: string;
      index: number;
      option: ComboboxOption;
      groupIndex: number;
    }
  | {
      kind: 'action';
      key: string;
      id: string;
      index: number;
      action: ComboboxAction;
    };

/*
 * Each row's key and DOM id come from its value, not its place, so an
 * option keeps its id (and stays the active one) when the consumer's
 * results change under it, and a new option never inherits an old id.
 */
const encoder = new TextEncoder();

/** The value as hex, so any value makes a unique, valid id part. */
function idPart(value: string): string {
  return Array.from(encoder.encode(value), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

/** The list's rows in order, each with a stable key and a DOM id under `listId`. */
export function comboboxEntries(
  listId: string,
  groups: readonly ComboboxGroup[],
  action: ComboboxAction | undefined,
): ComboboxEntry[] {
  const entries: ComboboxEntry[] = [];
  groups.forEach((group, groupIndex) => {
    for (const option of group.options)
      entries.push({
        kind: 'option',
        key: `option:${option.value}`,
        id: `${listId}-option-${idPart(option.value)}`,
        index: entries.length,
        option,
        groupIndex,
      });
  });
  if (action)
    entries.push({
      kind: 'action',
      key: 'action',
      id: `${listId}-action`,
      index: entries.length,
      action,
    });
  return entries;
}
