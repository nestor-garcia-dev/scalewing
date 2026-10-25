import { breakpointQuery } from './breakpoints.js';

/*
 * The site header's measures, shared by the bar, its skip link and the
 * document's scroll padding so all three agree on where the bar ends.
 */

/** The bar's height below `lg`: 56 px. */
export const siteHeaderCompactHeight =
  'calc(var(--sw-control-md-min-height) + var(--sw-space-3))';

/** The bar's height from `lg`: 72 px. */
export const siteHeaderWideHeight =
  'calc(var(--sw-control-md-min-height) + var(--sw-space-5) + var(--sw-space-1))';

/** The bar's content: the page container plus the page gutter each side. */
export const siteHeaderBarMaxWidth =
  'calc(var(--sw-container-max) + 2 * var(--sw-space-5))';

/** From here the bar is the wide one with its row of destinations. */
export const siteHeaderWideQuery = breakpointQuery('from', 'lg');

/** From here the bar's gutter is the wider one. */
export const siteHeaderGutterQuery = breakpointQuery('from', 'md');

/** The bar's gutter below `md` (`compact`) and from it (`wide`). */
export const siteHeaderGutter = {
  compact: 'var(--sw-space-4)',
  wide: 'var(--sw-space-5)',
} as const;

/**
 * Where the bar's content starts, measured from the header's start: the
 * centred bar's margin (none on a window narrower than the bar) plus its
 * gutter, so something laid over the bar lines up with the brand.
 */
export function siteHeaderContentStart(gutter: string): string {
  return `calc(max(0px, (100% - ${siteHeaderBarMaxWidth}) / 2) + ${gutter})`;
}
