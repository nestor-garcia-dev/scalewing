import { cx } from '../class-names.js';
import { DocsLayoutNav } from './docs-layout/DocsLayoutNav.js';
import { type DocsLayoutProps } from './docs-layout/types.js';
import { assertDocsLayoutProps } from './docs-layout/validate.js';

export type {
  DocsLayoutGroup,
  DocsLayoutItem,
  DocsLayoutLabels,
  DocsLayoutProps,
} from './docs-layout/types.js';

/**
 * A docs page's frame, centred on the site header's bar: from `lg` a side
 * navigation of grouped links at the start (sticky below a sticky
 * SiteHeader) beside the content column at the reading width, and on a
 * wide window an optional `aside` column at the end, such as "On this
 * page". Below `lg` the same navigation is a native `details` disclosure at
 * the top of the content, so it opens with no script. The navigation is
 * drawn twice and only one copy is ever displayed. It is a plain wrapper:
 * put it inside the page's one `main`. Invalid groups, items or words throw
 * a `RangeError`.
 */
export function DocsLayout({
  aside,
  children,
  groups,
  labels,
  navLabel,
}: DocsLayoutProps) {
  assertDocsLayoutProps({ groups, labels, navLabel });
  const hasAside = aside !== undefined && aside !== null && aside !== false;
  return (
    <div
      className={cx('sw-docs-layout', hasAside && 'sw-docs-layout-with-aside')}
    >
      <div className="sw-docs-layout-side">
        <DocsLayoutNav
          className="sw-docs-layout-nav"
          groups={groups}
          navLabel={navLabel}
        />
      </div>
      <div className="sw-docs-layout-content">
        <details className="sw-docs-layout-disclosure">
          <summary className="sw-docs-layout-summary">
            <span className="sw-docs-layout-summary-label">
              {labels.openNav}
            </span>
            <span aria-hidden="true" className="sw-docs-layout-marker" />
          </summary>
          <DocsLayoutNav
            className="sw-docs-layout-nav sw-docs-layout-nav-compact"
            groups={groups}
            navLabel={navLabel}
          />
        </details>
        <div className="sw-docs-layout-body">{children}</div>
      </div>
      {hasAside ? <div className="sw-docs-layout-aside">{aside}</div> : null}
    </div>
  );
}
