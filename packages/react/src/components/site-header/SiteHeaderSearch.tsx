import { type ReactNode, useId } from 'react';

import { cx } from '../../class-names.js';
import { tabStop } from '../../tab-stop.js';
import { type SiteHeaderSearchOptions } from './types.js';

/**
 * The header's search: one form drawn once. From `lg` it sits in the bar as
 * a search field; below `lg` it is a native popover that the search button
 * opens over the whole window, with the field at the top, a close button
 * (or a Cancel word) beside it and the results under it, so it opens,
 * closes on Escape and closes from its button with no script. Submitting sends the query to
 * `action` as `name` (a results page). The results panel and its row
 * template are empty until the consumer's script fills them; with no
 * script the form still works.
 */
export function SiteHeaderSearch({
  search,
  closeIcon,
}: {
  search: SiteHeaderSearchOptions;
  closeIcon: ReactNode;
}) {
  const id = useId();
  const panelId = `${id}search`;
  const resultsId = `${id}results`;
  return (
    <>
      <button
        aria-label={search.labels.open}
        className="sw-site-header-search-button"
        popoverTarget={panelId}
        popoverTargetAction="show"
        tabIndex={tabStop}
        type="button"
      >
        <span aria-hidden="true" className="sw-site-header-glyph">
          {search.icon}
        </span>
      </button>
      <div className="sw-site-header-search" id={panelId} popover="auto">
        <form
          action={search.action}
          className="sw-site-header-search-form"
          method="get"
          role="search"
        >
          <div className="sw-site-header-search-field">
            <span aria-hidden="true" className="sw-site-header-search-icon">
              {search.icon}
            </span>
            <input
              aria-controls={resultsId}
              aria-label={search.label}
              autoComplete="off"
              className="sw-site-header-search-input"
              enterKeyHint="search"
              name={search.name ?? 'q'}
              placeholder={search.placeholder}
              tabIndex={tabStop}
              type="search"
            />
          </div>
          <SearchCloseButton
            cancel={search.labels.cancel}
            close={search.labels.close}
            closeIcon={closeIcon}
            panelId={panelId}
          />
        </form>
        <div className="sw-site-header-search-results" hidden id={resultsId}>
          <p aria-live="polite" className="sw-site-header-search-status" />
          <ul className="sw-site-header-search-list" />
          <template className="sw-site-header-search-row">
            <li>
              <a
                className="sw-site-header-search-result"
                href="/"
                tabIndex={tabStop}
              >
                <span className="sw-site-header-search-result-title" />
                <span className="sw-site-header-search-result-text" />
              </a>
            </li>
          </template>
        </div>
      </div>
    </>
  );
}

/**
 * Closes the open search below `lg`: the word `cancel` when given, which
 * is then the button's name, or else the ✕ glyph named `close`.
 */
function SearchCloseButton({
  cancel,
  close,
  closeIcon,
  panelId,
}: {
  cancel: string | undefined;
  close: string;
  closeIcon: ReactNode;
  panelId: string;
}) {
  return (
    <button
      aria-label={cancel === undefined ? close : undefined}
      className={cx(
        'sw-site-header-search-close',
        cancel !== undefined && 'sw-site-header-search-cancel',
      )}
      popoverTarget={panelId}
      popoverTargetAction="hide"
      tabIndex={tabStop}
      type="button"
    >
      {cancel === undefined ? (
        <span aria-hidden="true" className="sw-site-header-glyph">
          {closeIcon}
        </span>
      ) : (
        cancel
      )}
    </button>
  );
}
