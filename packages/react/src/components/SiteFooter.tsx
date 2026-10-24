import { type ReactNode } from 'react';

import { Band } from './Band.js';
import { type SiteFooterProps } from './site-footer/types.js';
import { assertSiteFooterGroups } from './site-footer/validate.js';
import { tabStop } from '../tab-stop.js';

/** Whether an optional slot draws anything: not left out, empty or `false`. */
function shown(node: ReactNode): boolean {
  return node !== undefined && node !== null && node !== false && node !== '';
}

export type {
  SiteFooterGroup,
  SiteFooterLink,
  SiteFooterProps,
} from './site-footer/types.js';

/**
 * A public site's footer on the dark inverse band: the brand and a tagline,
 * groups of links (each a `nav` named by its label, its label shown above
 * its links), and a bottom row past a hairline with the legal line at its
 * start and, say, a language switch at its end. Below `md` the brand takes
 * the full width and the groups two columns; from `md` the brand and the
 * groups share one row. A brand moves the band with a theme overlay of
 * `inverse`. Invalid groups or links throw a `RangeError`.
 */
export function SiteFooter({
  brand,
  end,
  groups,
  legal,
  tagline,
}: SiteFooterProps) {
  assertSiteFooterGroups(groups);
  const hasLegal = shown(legal);
  const hasEnd = shown(end);
  return (
    <Band
      as="footer"
      className="sw-site-footer"
      paddingBottom={6}
      tone="inverse"
    >
      <div className="sw-site-footer-top">
        <div className="sw-site-footer-brand">
          {brand}
          {tagline ? <p className="sw-site-footer-tagline">{tagline}</p> : null}
        </div>
        {groups.map((group) => (
          <nav
            aria-label={group.label}
            className="sw-site-footer-group"
            key={group.id}
          >
            <p aria-hidden="true" className="sw-site-footer-label">
              {group.label}
            </p>
            <ul className="sw-site-footer-links">
              {group.links.map((link) => (
                <li key={link.id}>
                  <a
                    aria-current={link.current ? 'page' : undefined}
                    className="sw-site-footer-link"
                    href={link.href}
                    hrefLang={link.hrefLang}
                    lang={link.lang}
                    tabIndex={tabStop}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      {hasLegal || hasEnd ? (
        <div className="sw-site-footer-bottom">
          {hasLegal ? (
            <div className="sw-site-footer-legal">{legal}</div>
          ) : null}
          {hasEnd ? <div className="sw-site-footer-end">{end}</div> : null}
        </div>
      ) : null}
    </Band>
  );
}
