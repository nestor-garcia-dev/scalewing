import { SiteFooter, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function SiteFooterSection() {
  return (
    <Section
      id="site-footer"
      purpose="SiteFooter is a public site's footer on the dark inverse band: the brand and a tagline, groups of links (each a nav named by its label), and a bottom row with the legal line and a language switch. Two columns of groups on a phone, one spread row from md."
      title="SiteFooter"
      usage={`<SiteFooter
  brand={<img alt="Wetland Trust" src="/logo-white.svg" />}
  tagline="Counting birds since 1990."
  groups={[{ id: 'visit', label: 'Visit', links: [{ id: 'marsh', label: 'North marsh', href: '/marsh' }] }]}
  legal="© Wetland Trust"
  end={<a href="/es" lang="es" hrefLang="es">Español</a>}
/>`}
    >
      <SiteFooter
        brand={
          <Text as="span" variant="title">
            Wetland Trust
          </Text>
        }
        end={
          <a href="#site-footer" hrefLang="es" lang="es" tabIndex={0}>
            Español
          </a>
        }
        groups={[
          {
            id: 'visit',
            label: 'Visit',
            links: [
              { id: 'marsh', label: 'North marsh', href: '#site-footer' },
              {
                id: 'hide',
                label: 'Heron hide',
                href: '#site-footer',
                current: true,
              },
              { id: 'trails', label: 'Trails', href: '#site-footer' },
            ],
          },
          {
            id: 'trust',
            label: 'The trust',
            links: [
              { id: 'team', label: 'Field team', href: '#site-footer' },
              { id: 'contact', label: 'Contact', href: '#site-footer' },
            ],
          },
          {
            id: 'legal',
            label: 'Legal',
            links: [
              { id: 'privacy', label: 'Privacy', href: '#site-footer' },
              { id: 'terms', label: 'Terms', href: '#site-footer' },
            ],
          },
        ]}
        legal="© Wetland Trust · wetlandtrust.org"
        tagline="Counting the birds of the north marsh since 1990."
      />
    </Section>
  );
}
