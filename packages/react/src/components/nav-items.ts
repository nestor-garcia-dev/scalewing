/** What a navigation's item is marked by: `aria-current`, or nothing. */
export type NavItemCurrent = 'page' | 'location' | boolean;

/** The parts of a navigation item that SectionNav and AppShell validate alike. */
type CheckedNavItem = {
  id: string;
  label: string;
  count?: number;
  countLabel?: string;
};

/**
 * `aria-current` for an item: `page`, `location`, `true` for a bare `true`,
 * and none for `false` or nothing.
 */
export function navItemAriaCurrent(
  current: NavItemCurrent | undefined,
): 'page' | 'location' | 'true' | undefined {
  if (current === true) return 'true';
  return current || undefined;
}

/**
 * Fails closed on a navigation's items, named after the component that
 * draws them: empty or duplicate ids, empty labels, a count that is not a
 * whole number from 0, and a blank `countLabel` or one without a count.
 */
export function assertNavItems(
  component: string,
  items: readonly CheckedNavItem[],
): void {
  if (items.some((item) => !item.id.trim() || !item.label.trim()))
    throw new RangeError(`${component} items need nonempty ids and labels`);
  if (new Set(items.map((item) => item.id)).size !== items.length)
    throw new RangeError(`${component} items need unique ids`);
  if (
    items.some(
      (item) =>
        item.count !== undefined &&
        (!Number.isInteger(item.count) || item.count < 0),
    )
  )
    throw new RangeError(`${component} item counts are whole numbers from 0`);
  if (
    items.some(
      (item) =>
        item.countLabel !== undefined &&
        (!item.countLabel.trim() || item.count === undefined),
    )
  )
    throw new RangeError(
      `${component} item countLabel is nonempty and comes with a count`,
    );
}
