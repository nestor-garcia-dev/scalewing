import { assertNavItems } from '../nav-items.js';
import {
  type SiteHeaderProps,
  type SiteHeaderSearchOptions,
  type SiteHeaderSkipLink,
} from './types.js';

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
  search,
  skipLink,
}: Pick<
  SiteHeaderProps,
  'items' | 'labels' | 'navLabel' | 'search' | 'skipLink'
>): void {
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
  if (search) assertSearch(search);
}

function assertSearch(search: SiteHeaderSearchOptions): void {
  if (typeof search.labels !== 'object' || search.labels === null)
    throw new RangeError(
      'SiteHeader search needs a nonempty action, label, placeholder and open and close labels',
    );
  const words = [
    search.action,
    search.label,
    search.placeholder,
    search.labels.open,
    search.labels.close,
  ];
  if (words.some((word) => !word.trim()))
    throw new RangeError(
      'SiteHeader search needs a nonempty action, label, placeholder and open and close labels',
    );
  if (search.name !== undefined && !/^[\w-]+$/.test(search.name))
    throw new RangeError(
      'SiteHeader search name must be a plain parameter name',
    );
  if (
    search.icon === null ||
    search.icon === undefined ||
    search.icon === false
  )
    throw new RangeError('SiteHeader search needs an icon');
}

function assertSkipLink({ href, label }: SiteHeaderSkipLink): void {
  if (!label.trim())
    throw new RangeError('SiteHeader skipLink needs a nonempty label');
  if (!/^#\S+$/.test(href))
    throw new RangeError(
      'SiteHeader skipLink href must be a fragment such as #main',
    );
}
