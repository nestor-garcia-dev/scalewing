import { SiteHeader, Stack, Text } from '@scalewing/react';
import { useEffect, useRef } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const menuPath = 'M2 4h12 M2 8h12 M2 12h12';
const closePath = 'M4 4l8 8 M12 4l-8 8';
const searchPath =
  'M7 12.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z M11 11l3.5 3.5';
const here = '#site-header-search';

/** The pages the stand-in script searches, as a site's search index would. */
const pages = [
  {
    title: 'Herons and egrets',
    text: 'Grey herons stand still in the shallows of the north marsh.',
  },
  {
    title: 'Your first count',
    text: 'Count from the hide at first light; herons first, then ducks.',
  },
  { title: 'Reed bed', text: 'Bitterns boom from the reed bed in spring.' },
  {
    title: 'What to bring',
    text: 'Binoculars, a notebook and boots for the marsh path.',
  },
];

/**
 * Stands in for a site's own search script, which Scalewing leaves to the
 * consumer: it fills the results panel from the row template as the reader
 * types, and focuses the field when the phone's search opens.
 */
function useStandInSearch(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const header = root.current;
    if (!header) return;
    const input = header.querySelector<HTMLInputElement>(
      '.sw-site-header-search-input',
    );
    const panel = header.querySelector<HTMLElement>('.sw-site-header-search');
    const results = header.querySelector<HTMLElement>(
      '.sw-site-header-search-results',
    );
    const status = header.querySelector<HTMLElement>(
      '.sw-site-header-search-status',
    );
    const list = header.querySelector<HTMLElement>(
      '.sw-site-header-search-list',
    );
    const row = header.querySelector<HTMLTemplateElement>(
      '.sw-site-header-search-row',
    );
    if (!input || !panel || !results || !status || !list || !row) return;
    const show = () => {
      const query = input.value.trim().toLowerCase();
      list.replaceChildren();
      results.hidden = query === '';
      if (query === '') return;
      const found = pages.filter((page) =>
        `${page.title} ${page.text}`.toLowerCase().includes(query),
      );
      status.textContent =
        found.length === 0 ? 'Nothing found' : `${found.length} found`;
      for (const page of found) {
        // A server render puts the row in the template's content; the
        // gallery's client render leaves it as the template's child.
        const source = row.content.firstElementChild ?? row.firstElementChild;
        const item = source!.cloneNode(true) as HTMLElement;
        item.querySelector('a')!.setAttribute('href', here);
        item.querySelector('.sw-site-header-search-result-title')!.textContent =
          page.title;
        item.querySelector('.sw-site-header-search-result-text')!.textContent =
          page.text;
        list.append(item);
      }
    };
    const focus = (event: Event) => {
      if ((event as ToggleEvent).newState === 'open') input.focus();
    };
    input.addEventListener('input', show);
    panel.addEventListener('toggle', focus);
    return () => {
      input.removeEventListener('input', show);
      panel.removeEventListener('toggle', focus);
    };
  }, [root]);
}

export function SiteHeaderSearchSection() {
  const root = useRef<HTMLDivElement>(null);
  useStandInSearch(root);
  return (
    <Section
      id="site-header-search"
      purpose="SiteHeader's search: from lg a search field in the bar, pushed to the end with the actions; below lg a search button beside the compact actions that opens the same form over the whole window as a native popover, with the field at the top, a close button and the results under it. Opening, Escape and the close button need no script, and the form submits to the site's results page with no script. Scalewing draws an empty results panel and a row template; the site's own script fills them (here a stand-in that searches four pages). Type “heron”."
      title="SiteHeader search"
      usage={`<SiteHeader
  …
  search={{
    action: '/docs/search/',
    label: 'Search the docs',
    placeholder: 'Search the docs',
    labels: { open: 'Search', close: 'Close search' },
    icon: <SearchIcon />,
  }}
/>`}
    >
      <Stack gap={3}>
        <div ref={root}>
          <SiteHeader
            brand={
              <a href={here} tabIndex={0}>
                <Text as="span" variant="title">
                  Wetland Trust
                </Text>
              </a>
            }
            closeIcon={<Glyph path={closePath} size={22} />}
            compactActions={
              <a href={here} hrefLang="es" lang="es" tabIndex={0}>
                Español
              </a>
            }
            items={[
              { id: 'marsh', label: 'Marsh', href: here },
              {
                id: 'guide',
                label: 'Field guide',
                href: here,
                current: 'page',
              },
              { id: 'visit', label: 'Visit', href: here },
            ]}
            actions={
              <a href={here} hrefLang="es" lang="es" tabIndex={0}>
                Español
              </a>
            }
            labels={{ openMenu: 'Open the menu', closeMenu: 'Close the menu' }}
            menuIcon={<Glyph path={menuPath} size={22} />}
            navLabel="Main"
            search={{
              action: here,
              label: 'Search the field guide',
              placeholder: 'Search the field guide',
              labels: { open: 'Search', close: 'Close search' },
              icon: <Glyph path={searchPath} size={18} />,
            }}
            sticky={false}
          />
        </div>
        <Text color="muted" variant="caption">
          The results drop down under the field on a laptop and fill the window
          on a phone. Enter goes to the results page.
        </Text>
      </Stack>
    </Section>
  );
}
