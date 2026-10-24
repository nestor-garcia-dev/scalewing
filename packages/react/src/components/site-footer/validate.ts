import { type SiteFooterGroup } from './types.js';

const blank = (value: string) => !value.trim();

/**
 * Fails closed on the footer's groups: none at all, a group with no links,
 * blank or repeated ids (groups, and links within a group), blank labels,
 * and a blank `href`.
 */
export function assertSiteFooterGroups(
  groups: readonly SiteFooterGroup[],
): void {
  if (groups.length === 0)
    throw new RangeError('SiteFooter needs at least one group');
  if (groups.some((group) => blank(group.id) || blank(group.label)))
    throw new RangeError('SiteFooter groups need nonempty ids and labels');
  if (new Set(groups.map((group) => group.id)).size !== groups.length)
    throw new RangeError('SiteFooter groups need unique ids');
  for (const group of groups) {
    if (group.links.length === 0)
      throw new RangeError(`SiteFooter group ${group.id} needs a link`);
    if (
      group.links.some(
        (link) => blank(link.id) || blank(link.label) || blank(link.href),
      )
    )
      throw new RangeError(
        `SiteFooter group ${group.id} links need nonempty ids, labels and hrefs`,
      );
    if (new Set(group.links.map((link) => link.id)).size !== group.links.length)
      throw new RangeError(
        `SiteFooter group ${group.id} links need unique ids`,
      );
  }
}
