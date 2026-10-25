import {
  siteHeaderCompactHeight,
  siteHeaderWideHeight,
  siteHeaderWideQuery,
} from './site-header-geometry.js';

/** The room an in-page jump leaves above its target: the bar, its hairline and a gap. */
function scrollPadding(barHeight: string): string {
  return `calc(${barHeight} + 1px + var(--sw-space-3))`;
}

/*
 * While a sticky SiteHeader is on the page, the document's scroll padding
 * clears the bar (its height at each width, its hairline) and a small gap,
 * so a #fragment link, :target and scrollIntoView land below the bar
 * instead of under it. A header in the page flow changes nothing.
 */
export function cssSiteHeaderAnchorRules(): string {
  return `html:has(.sw-site-header-sticky) {
  scroll-padding-top: ${scrollPadding(siteHeaderCompactHeight)};
}

@media ${siteHeaderWideQuery} {
  html:has(.sw-site-header-sticky) {
    scroll-padding-top: ${scrollPadding(siteHeaderWideHeight)};
  }
}`;
}
