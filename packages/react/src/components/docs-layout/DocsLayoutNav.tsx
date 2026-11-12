import { useId } from 'react';

import { tabStop } from '../../tab-stop.js';
import { navItemAriaCurrent } from '../nav-items.js';
import { type DocsLayoutGroup } from './types.js';

/**
 * The docs navigation as a labelled `nav`: each group a muted caption
 * naming the list of links under it. DocsLayout draws it twice, in the
 * side column and in the disclosure, and CSS shows one at a time.
 */
export function DocsLayoutNav({
  className,
  groups,
  navLabel,
}: {
  className: string;
  groups: readonly DocsLayoutGroup[];
  navLabel: string;
}) {
  const idPrefix = useId();
  return (
    <nav aria-label={navLabel} className={className}>
      {groups.map((group) => {
        const labelId = `${idPrefix}-${group.id}`;
        return (
          <div className="sw-docs-layout-group" key={group.id}>
            <p className="sw-docs-layout-group-label" id={labelId}>
              {group.label}
            </p>
            <ul aria-labelledby={labelId} className="sw-docs-layout-list">
              {group.items.map((item) => (
                <li key={item.id}>
                  <a
                    aria-current={navItemAriaCurrent(item.current)}
                    className="sw-docs-layout-link"
                    href={item.href}
                    hrefLang={item.hrefLang}
                    lang={item.lang}
                    tabIndex={tabStop}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
