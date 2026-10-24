import { tabStop } from '../../tab-stop.js';
import { navItemAriaCurrent } from '../nav-items.js';
import { type SiteHeaderItem } from './types.js';

/** The destinations as a labelled `nav` of links, in the bar or the menu. */
export function SiteHeaderLinks({
  className,
  items,
  navLabel,
}: {
  className: string;
  items: readonly SiteHeaderItem[];
  navLabel: string;
}) {
  return (
    <nav aria-label={navLabel} className={className}>
      <ul className="sw-site-header-list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              aria-current={navItemAriaCurrent(item.current)}
              className="sw-site-header-link"
              href={item.href}
              tabIndex={tabStop}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
