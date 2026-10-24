import { isOneOf } from '../../is-one-of.js';
import { hasSlot } from '../slot.js';
import {
  commandPaletteShortcuts,
  type CommandPaletteProps,
  type CommandPaletteTriggerProps,
} from './types.js';

function isBlank(words: unknown): boolean {
  return typeof words !== 'string' || !words.trim();
}

function blankWhenGiven(words: unknown): boolean {
  return words !== undefined && isBlank(words);
}

function hasDuplicates(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

/**
 * Fails closed on a palette it cannot name or draw: blank words, a group
 * without a caption, empty or duplicate group or item ids (items across
 * groups), a blank item label or detail, loading without its words, or an
 * unknown shortcut.
 */
export function assertCommandPalette({
  emptyText,
  groups,
  hint,
  label,
  loading,
  loadingText,
  placeholder,
  shortcut,
}: CommandPaletteProps): void {
  const name = 'CommandPalette';
  if (isBlank(label) || isBlank(emptyText))
    throw new RangeError(`${name} label and emptyText must be nonempty`);
  if (blankWhenGiven(placeholder) || blankWhenGiven(hint))
    throw new RangeError(
      `${name} placeholder and hint are nonempty when given`,
    );
  if (blankWhenGiven(loadingText) || (loading && isBlank(loadingText)))
    throw new RangeError(`${name} loading needs a nonempty loadingText`);
  if (shortcut != null && !isOneOf(commandPaletteShortcuts, shortcut))
    throw new RangeError(
      `${name} shortcut must be one of ${commandPaletteShortcuts.join(', ')} or null`,
    );
  if (groups.some((group) => isBlank(group.id) || isBlank(group.label)))
    throw new RangeError(`${name} groups need nonempty ids and labels`);
  if (hasDuplicates(groups.map((group) => group.id)))
    throw new RangeError(`${name} groups need unique ids`);
  const items = groups.flatMap((group) => group.items);
  if (items.some((item) => isBlank(item.id) || isBlank(item.label)))
    throw new RangeError(`${name} items need nonempty ids and labels`);
  if (items.some((item) => blankWhenGiven(item.detail)))
    throw new RangeError(`${name} item details are nonempty when given`);
  if (hasDuplicates(items.map((item) => item.id)))
    throw new RangeError(`${name} items need unique ids`);
}

/** Fails closed on a trigger with blank words or a glyph that draws nothing. */
export function assertCommandPaletteTrigger({
  icon,
  label,
  placeholder,
  shortcutLabel,
}: CommandPaletteTriggerProps): void {
  const name = 'CommandPaletteTrigger';
  if (isBlank(label) || isBlank(placeholder))
    throw new RangeError(`${name} label and placeholder must be nonempty`);
  if (blankWhenGiven(shortcutLabel))
    throw new RangeError(`${name} shortcutLabel is nonempty when given`);
  if (!hasSlot(icon) || (typeof icon === 'string' && !icon.trim()))
    throw new RangeError(`${name} needs its search glyph`);
}
