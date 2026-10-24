import { ButtonLink, SiteHeader, Stack, Text } from '@scalewing/react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const menuPath = 'M2 4h12 M2 8h12 M2 12h12';
const closePath = 'M4 4l8 8 M12 4l-8 8';

export function SiteHeaderSection() {
  return (
    <Section
      id="site-header"
      purpose="SiteHeader is a public site's header: the brand, the main destinations as a row of links from lg (the current one marked) and the bar's actions; below lg the compact actions and a menu button whose menu lists the destinations and the menu's actions under the bar. The menu is a native details, so it opens and closes with no script; script adds Escape and closes it when a link is chosen or focus leaves it. Narrow the window to see the menu."
      title="SiteHeader"
      usage={`<SiteHeader
  brand={<a href="/">Wetland Trust</a>}
  navLabel="Main"
  items={[{ id: 'marsh', label: 'Marsh', href: '/marsh', current: 'page' }]}
  actions={<ButtonLink href="/contact">Contact the rangers</ButtonLink>}
  compactActions={<a href="/es" lang="es" hrefLang="es">Español</a>}
  menuActions={<ButtonLink href="/contact" width="full">Contact the rangers</ButtonLink>}
  labels={{ openMenu: 'Open the menu', closeMenu: 'Close the menu' }}
  menuIcon={<MenuIcon />}
  closeIcon={<CloseIcon />}
/>`}
    >
      <Stack gap={3}>
        <SiteHeader
          actions={
            <>
              <a href="#site-header" hrefLang="es" lang="es">
                Español
              </a>
              <a href="#site-header">Sign in</a>
              <ButtonLink href="#site-header">Contact the rangers</ButtonLink>
            </>
          }
          brand={
            <a href="#site-header">
              <Text as="span" variant="title">
                Wetland Trust
              </Text>
            </a>
          }
          closeIcon={<Glyph path={closePath} size={22} />}
          compactActions={
            <a href="#site-header" hrefLang="es" lang="es">
              Español
            </a>
          }
          items={[
            { id: 'marsh', label: 'Marsh', href: '#site-header' },
            {
              id: 'hide',
              label: 'Heron hide',
              href: '#site-header',
              current: 'page',
            },
            { id: 'trails', label: 'Trails', href: '#site-header' },
            { id: 'visit', label: 'Visit', href: '#site-header' },
          ]}
          labels={{ openMenu: 'Open the menu', closeMenu: 'Close the menu' }}
          menuActions={
            <>
              <ButtonLink href="#site-header" width="full">
                Contact the rangers
              </ButtonLink>
              <ButtonLink href="#site-header" variant="neutral" width="full">
                Sign in
              </ButtonLink>
            </>
          }
          menuIcon={<Glyph path={menuPath} size={22} />}
          navLabel="Main"
          sticky={false}
        />
        <Text color="muted" variant="caption">
          The gallery keeps this header in the page flow (sticky=false); a
          site's header sticks to the window's top.
        </Text>
      </Stack>
    </Section>
  );
}
