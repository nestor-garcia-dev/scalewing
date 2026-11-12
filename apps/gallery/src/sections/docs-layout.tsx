import { DocsLayout, SectionNav, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

const here = '#docs-layout';

const groups = [
  {
    id: 'start',
    label: 'Start here',
    items: [
      { id: 'guide', label: 'Field guide home', href: here },
      {
        id: 'first-count',
        label: 'Your first count',
        href: here,
        current: 'page' as const,
      },
      { id: 'kit', label: 'What to bring', href: here },
    ],
  },
  {
    id: 'birds',
    label: 'Birds',
    items: [
      { id: 'herons', label: 'Herons and egrets', href: here },
      { id: 'ducks', label: 'Ducks', href: here },
      {
        id: 'garzas',
        label: 'Garzas',
        href: here,
        lang: 'es',
        hrefLang: 'es',
      },
    ],
  },
  {
    id: 'habitats',
    label: 'Habitats',
    items: [
      { id: 'marsh', label: 'North marsh', href: here },
      { id: 'reedbed', label: 'Reed bed', href: here },
    ],
  },
];

const headings = [
  { id: 'docs-layout-before', label: 'Before you go' },
  { id: 'docs-layout-counting', label: 'Counting from the hide' },
  { id: 'docs-layout-sending', label: 'Sending your tally' },
];

function OnThisPage() {
  return (
    <SectionNav
      aria-label="On this page"
      items={headings.map((heading) => ({
        id: heading.id,
        label: heading.label,
        href: `#${heading.id}`,
      }))}
      verticalFrom="md"
    />
  );
}

export function DocsLayoutSection() {
  return (
    <Section
      id="docs-layout"
      purpose="DocsLayout is a docs page's frame on a public site, centred on SiteHeader's bar: from lg a side navigation of grouped links at the start (sticky below a sticky SiteHeader) beside the article at the reading width, and from 80rem an optional aside column at the end, such as an On this page SectionNav. Below lg the same navigation is a native details disclosure at the top of the article that opens with no script. The aside is not shown below 80rem, so the article keeps the same links. Put it inside the page's one main. Widen and narrow the window to see the three layouts."
      title="DocsLayout"
      usage={`<main id="main">
  <DocsLayout
    navLabel="Guide"
    groups={[{ id: 'start', label: 'Start here', items: [{ id: 'home', label: 'Field guide home', href: '/guide/', current: 'page' }] }]}
    labels={{ openNav: 'Browse the guide' }}
    aside={<SectionNav aria-label="On this page" items={headings} verticalFrom="md" />}
  >
    <article>…</article>
  </DocsLayout>
</main>`}
    >
      <DocsLayout
        aside={<OnThisPage />}
        groups={groups}
        labels={{ openNav: 'Browse the guide' }}
        navLabel="Guide"
      >
        <article>
          <Stack gap={4}>
            <Text as="h3" variant="headline">
              Your first count
            </Text>
            <Text variant="lead">
              A morning at the north marsh, a notebook and an hour in the heron
              hide: everything a new counter needs.
            </Text>
            <Text as="h4" id="docs-layout-before" variant="title">
              Before you go
            </Text>
            <Text>
              Check the tide table the night before. The herons feed on the
              falling tide, so plan to reach the hide an hour before low water,
              and bring a pencil: ink runs in the reed bed mist.
            </Text>
            <Text as="h4" id="docs-layout-counting" variant="title">
              Counting from the hide
            </Text>
            <Text>
              Count each species once from the left window to the right, then
              again on the way back. Write the larger of the two counts. Egrets
              stand still for minutes at a time; ducks do not, so count them in
              groups of five.
            </Text>
            <Text as="h4" id="docs-layout-sending" variant="title">
              Sending your tally
            </Text>
            <Text>
              Copy the tally into the shared sheet before noon so the rangers
              can compare it with the other hides. A blank row means you looked
              and saw none, which is worth knowing too.
            </Text>
          </Stack>
        </article>
      </DocsLayout>
    </Section>
  );
}
