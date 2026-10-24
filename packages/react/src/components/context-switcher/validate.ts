import {
  contextSwitcherTriggerAppearances,
  contextSwitcherWidths,
} from '../../css/css-context-switcher-trigger.js';
import { badgeTones } from '../../css/css-data.js';
import { isOneOf } from '../../is-one-of.js';
import { navCountTones } from '../NavCount.js';
import { hasSlot } from '../slot.js';
import {
  type ContextSwitcherOption,
  type ContextSwitcherProps,
} from './types.js';

const name = 'ContextSwitcher';

/** The trigger edges the popup can line up with. */
const inlineAligns = ['start', 'end'] as const;

function isBlank(words: unknown): boolean {
  return typeof words !== 'string' || !words.trim();
}

function isWholeFromZero(value: unknown): boolean {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

function hasDuplicates(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

function assertGroups(groups: ContextSwitcherProps['groups']): void {
  if (groups.length === 0)
    throw new RangeError(`${name} needs at least one group`);
  if (groups.some((group) => isBlank(group.id)))
    throw new RangeError(`${name} groups need nonempty ids`);
  if (hasDuplicates(groups.map((group) => group.id)))
    throw new RangeError(`${name} groups need unique ids`);
  if (groups.some((group) => group.label !== undefined && isBlank(group.label)))
    throw new RangeError(`${name} group labels are nonempty when given`);
  if (groups.some((group) => group.options.length === 0))
    throw new RangeError(`${name} groups need at least one option`);
}

function assertOption(option: ContextSwitcherOption): void {
  if (isBlank(option.id) || isBlank(option.label))
    throw new RangeError(`${name} options need nonempty ids and labels`);
  if (option.detail !== undefined && isBlank(option.detail))
    throw new RangeError(`${name} option details are nonempty when given`);
  if (
    option.badge !== undefined &&
    (isBlank(option.badge.label) || !isOneOf(badgeTones, option.badge.tone))
  )
    throw new RangeError(
      `${name} option badges need a label and one of ${badgeTones.join(', ')}`,
    );
  if (option.count !== undefined && !isWholeFromZero(option.count))
    throw new RangeError(`${name} option counts are whole numbers from 0`);
  if (
    option.countLabel !== undefined &&
    (isBlank(option.countLabel) || option.count === undefined)
  )
    throw new RangeError(
      `${name} option countLabel is nonempty and comes with a count`,
    );
  if (
    option.countTone !== undefined &&
    (!isOneOf(navCountTones, option.countTone) || option.count === undefined)
  )
    throw new RangeError(
      `${name} option countTone is one of ${navCountTones.join(', ')} and comes with a count`,
    );
}

function assertFilter(filter: ContextSwitcherProps['filter']): void {
  if (filter === undefined) return;
  if (isBlank(filter.label) || isBlank(filter.emptyText))
    throw new RangeError(`${name} filter needs a label and an emptyText`);
  if (filter.placeholder !== undefined && isBlank(filter.placeholder))
    throw new RangeError(`${name} filter placeholder is nonempty when given`);
  if (filter.minOptions !== undefined && !isWholeFromZero(filter.minOptions))
    throw new RangeError(`${name} filter minOptions is a whole number from 0`);
}

function assertActions(actions: ContextSwitcherProps['actions']): void {
  if (actions === undefined) return;
  if (actions.some((action) => isBlank(action.id) || isBlank(action.label)))
    throw new RangeError(`${name} actions need nonempty ids and labels`);
  if (hasDuplicates(actions.map((action) => action.id)))
    throw new RangeError(`${name} actions need unique ids`);
}

/**
 * Fails closed on a switcher it cannot draw or name: blank words, empty or
 * duplicate groups, options (ids unique across groups) or actions, a bad
 * count, badge or tone, a `currentId` that names no option, a trigger that
 * draws nothing, or an unknown appearance, width or alignment.
 */
export function assertContextSwitcher({
  actions,
  align,
  currentId,
  filter,
  groups,
  label,
  trigger,
  triggerAppearance,
  width,
}: ContextSwitcherProps): void {
  if (isBlank(label)) throw new RangeError(`${name} label must be nonempty`);
  if (
    !hasSlot(trigger) ||
    (typeof trigger === 'string' && trigger.trim() === '')
  )
    throw new RangeError(`${name} needs a trigger to draw`);
  if (
    triggerAppearance !== undefined &&
    !isOneOf(contextSwitcherTriggerAppearances, triggerAppearance)
  )
    throw new RangeError(
      `${name} triggerAppearance must be one of ${contextSwitcherTriggerAppearances.join(', ')}`,
    );
  if (width !== undefined && !isOneOf(contextSwitcherWidths, width))
    throw new RangeError(
      `${name} width must be one of ${contextSwitcherWidths.join(', ')}`,
    );
  if (align !== undefined && !isOneOf(inlineAligns, align))
    throw new RangeError(
      `${name} align must be one of ${inlineAligns.join(', ')}`,
    );
  assertGroups(groups);
  const options = groups.flatMap((group) => group.options);
  options.forEach(assertOption);
  if (hasDuplicates(options.map((option) => option.id)))
    throw new RangeError(`${name} options need unique ids`);
  if (
    currentId !== undefined &&
    !options.some((option) => option.id === currentId)
  )
    throw new RangeError(`${name} currentId must name one of its options`);
  assertFilter(filter);
  assertActions(actions);
}
