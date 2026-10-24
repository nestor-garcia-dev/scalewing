import { assertNavItems } from '../nav-items.js';
import { type SiteHeaderProps } from './types.js';

/**
 * Fails closed on the header's words and destinations: no items, blank or
 * repeated ids, blank labels or hrefs, and a blank navigation name or menu
 * button name.
 */
export function assertSiteHeaderProps({
  items,
  labels,
  navLabel,
}: Pick<SiteHeaderProps, 'items' | 'labels' | 'navLabel'>): void {
  if (items.length === 0)
    throw new RangeError('SiteHeader needs at least one item');
  assertNavItems('SiteHeader', items);
  if (items.some((item) => !item.href.trim()))
    throw new RangeError('SiteHeader items need nonempty hrefs');
  if (!navLabel.trim())
    throw new RangeError('SiteHeader needs a nonempty navLabel');
  if (!labels.openMenu.trim() || !labels.closeMenu.trim())
    throw new RangeError(
      'SiteHeader labels need nonempty openMenu and closeMenu',
    );
}
