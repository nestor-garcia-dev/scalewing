import { isOneOf } from '../../is-one-of.js';
import { navCountTones } from '../NavCount.js';
import { assertNavItems } from '../nav-items.js';
import { type AppShellProps } from './types.js';

/**
 * An icon that is no glyph: nothing, a boolean or an empty string (which
 * React draws as nothing), or 0 (which it draws as the text "0").
 */
function drawsNothing(node: unknown): boolean {
  return (
    node === undefined ||
    node === null ||
    typeof node === 'boolean' ||
    node === '' ||
    node === 0
  );
}

function isBlank(words: unknown): boolean {
  return typeof words !== 'string' || !words.trim();
}

function assertGroups(groups: AppShellProps['groups']): void {
  if (groups.length === 0)
    throw new RangeError('AppShell needs at least one group');
  if (groups.some((group) => isBlank(group.id)))
    throw new RangeError('AppShell groups need nonempty ids');
  if (new Set(groups.map((group) => group.id)).size !== groups.length)
    throw new RangeError('AppShell groups need unique ids');
  if (groups.some((group) => group.label !== undefined && isBlank(group.label)))
    throw new RangeError('AppShell group labels are nonempty when given');
  if (groups.some((group) => group.items.length === 0))
    throw new RangeError('AppShell groups need at least one item');
}

/**
 * Fails closed on the menu button's count: a whole number from 0, a
 * nonempty label and a known tone, each of the last two with a count.
 */
function assertMenuCount({
  menuCount,
  menuCountLabel,
  menuCountTone,
}: Pick<
  AppShellProps,
  'menuCount' | 'menuCountLabel' | 'menuCountTone'
>): void {
  if (
    menuCount !== undefined &&
    (!Number.isInteger(menuCount) || menuCount < 0)
  )
    throw new RangeError(
      `AppShell menuCount must be a whole number from 0: ${String(menuCount)}`,
    );
  if (menuCountLabel !== undefined && isBlank(menuCountLabel))
    throw new RangeError('AppShell menuCountLabel must be nonempty');
  if (menuCountTone !== undefined && !isOneOf(navCountTones, menuCountTone))
    throw new RangeError(
      `AppShell menuCountTone must be one of ${navCountTones.join(', ')}`,
    );
  if (
    menuCount === undefined &&
    (menuCountLabel !== undefined || menuCountTone !== undefined)
  )
    throw new RangeError(
      'AppShell menuCountLabel and menuCountTone come with a menuCount',
    );
}

/**
 * Fails closed on the shell's words, the menu's count, its groups and
 * their items (ids unique across every group, each with an icon, which is
 * all the rail shows).
 */
export function assertAppShellProps({
  groups,
  labels,
  menuCount,
  menuCountLabel,
  menuCountTone,
  navLabel,
}: Pick<
  AppShellProps,
  | 'groups'
  | 'labels'
  | 'menuCount'
  | 'menuCountLabel'
  | 'menuCountTone'
  | 'navLabel'
>): void {
  if (isBlank(navLabel))
    throw new RangeError('AppShell navLabel must be nonempty');
  if (isBlank(labels?.openMenu) || isBlank(labels?.closeMenu))
    throw new RangeError('AppShell labels openMenu and closeMenu are nonempty');
  assertMenuCount({ menuCount, menuCountLabel, menuCountTone });
  assertGroups(groups);
  const items = groups.flatMap((group) => group.items);
  assertNavItems('AppShell', items);
  if (items.some((item) => drawsNothing(item.icon)))
    throw new RangeError('AppShell items need an icon, all the rail shows');
  for (const item of items) {
    if (item.countTone === undefined) continue;
    if (!isOneOf(navCountTones, item.countTone))
      throw new RangeError(
        `AppShell item countTone must be one of ${navCountTones.join(', ')}`,
      );
    if (item.count === undefined)
      throw new RangeError('AppShell item countTone comes with a count');
  }
}
