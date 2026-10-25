import { assertNavItems } from '../nav-items.js';
import { type SiteHeaderProps, type SiteHeaderSkipLink } from './types.js';

/**
 * Fails closed on the header's words and destinations: no items, blank or
 * repeated ids, blank labels or hrefs, a blank navigation name or menu
 * button name, and a skip link with blank words or an address that is not
 * a fragment on the page.
 */
export function assertSiteHeaderProps({
  items,
  labels,
  navLabel,
  skipLink,
}: Pick<SiteHeaderProps, 'items' | 'labels' | 'navLabel' | 'skipLink'>): void {
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
  if (skipLink) assertSkipLink(skipLink);
}

function assertSkipLink({ href, label }: SiteHeaderSkipLink): void {
  if (!label.trim())
    throw new RangeError('SiteHeader skipLink needs a nonempty label');
  if (!/^#\S+$/.test(href))
    throw new RangeError(
      'SiteHeader skipLink href must be a fragment such as #main',
    );
}
