import { assertNavItems } from '../nav-items.js';
import { type DocsLayoutProps } from './types.js';

const blank = (value: string) => !value.trim();

/**
 * Fails closed on the layout's words and navigation: a blank navigation
 * name or disclosure label, no groups, a group with no items, blank or
 * repeated group ids, blank group labels, and items with blank ids, labels
 * or hrefs or ids repeated anywhere in the navigation.
 */
export function assertDocsLayoutProps({
  groups,
  labels,
  navLabel,
}: Pick<DocsLayoutProps, 'groups' | 'labels' | 'navLabel'>): void {
  if (blank(navLabel))
    throw new RangeError('DocsLayout needs a nonempty navLabel');
  if (blank(labels.openNav))
    throw new RangeError('DocsLayout labels need a nonempty openNav');
  if (groups.length === 0)
    throw new RangeError('DocsLayout needs at least one group');
  if (groups.some((group) => blank(group.id) || blank(group.label)))
    throw new RangeError('DocsLayout groups need nonempty ids and labels');
  if (new Set(groups.map((group) => group.id)).size !== groups.length)
    throw new RangeError('DocsLayout groups need unique ids');
  const empty = groups.find((group) => group.items.length === 0);
  if (empty) throw new RangeError(`DocsLayout group ${empty.id} needs an item`);
  const items = groups.flatMap((group) => group.items);
  assertNavItems('DocsLayout', items);
  if (items.some((item) => blank(item.href)))
    throw new RangeError('DocsLayout items need nonempty hrefs');
}
