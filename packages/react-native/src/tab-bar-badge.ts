/** Past this count a tab's badge reads `99+`, as an iOS tab badge does. */
export const tabBarBadgeMax = 99;

/** A badge shows for a positive whole number only. */
function isShownBadge(count: number | undefined): count is number {
  return count !== undefined && Number.isInteger(count) && count > 0;
}

/**
 * The words a tab's badge draws, or `undefined` when there is no badge
 * (no count, zero, or not a positive whole number).
 */
export function tabBarBadgeText(count: number | undefined): string | undefined {
  if (!isShownBadge(count)) return undefined;

  return count > tabBarBadgeMax ? `${tabBarBadgeMax}+` : String(count);
}

/**
 * What a screen reader hears after the tab's name, the way iOS reads a tab
 * badge ("Agenda, 3 items"): the consumer's words when given, otherwise the
 * full count in English. `undefined` when no badge shows.
 */
export function tabBarBadgeAccessibilityValue(
  count: number | undefined,
  label?: string,
): string | undefined {
  if (!isShownBadge(count)) return undefined;
  if (label !== undefined && label !== '') return label;

  return count === 1 ? '1 item' : `${count} items`;
}
