import {
  siteHeaderContentStart,
  siteHeaderGutter,
  siteHeaderGutterQuery,
} from './site-header-geometry.js';
import { skipLinkRules } from './skip-link.js';

const link = '.sw-site-header-skip-link';

/*
 * The header's skip link, its first focusable element, in the shared skip
 * link look, laid over the bar's start (centred in its height and lined up
 * with the brand) while it has focus. Positioned, it paints over the bar's
 * content, which is not, so it needs no layer of its own.
 */
export function cssSiteHeaderSkipLinkRules(): string {
  return `${skipLinkRules(link)}

${link} {
  inset-block-start: 50%;
  inset-inline-start: ${siteHeaderContentStart(siteHeaderGutter.compact)};
  position: absolute;
  transform: translateY(-50%);
}

@media ${siteHeaderGutterQuery} {
  ${link} { inset-inline-start: ${siteHeaderContentStart(siteHeaderGutter.wide)}; }
}`;
}
