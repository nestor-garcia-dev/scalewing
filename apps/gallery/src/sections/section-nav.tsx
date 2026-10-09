import { Card, Grid, SectionNav, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const reserveSections = [
  {
    id: 'counts',
    label: 'Counts',
    note: 'Wader counts at high tide.',
    glyph: 'M3 13V9 M7 13V5 M11 13V7',
  },
  {
    id: 'rangers',
    label: 'Rangers',
    note: 'Who walks which transect.',
    glyph:
      'M8 7a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5z M3 14c0-3 2.2-5 5-5s5 2 5 5',
  },
  {
    id: 'hides',
    label: 'Hides',
    note: 'Opening times of the four hides.',
    glyph: 'M2 8l6-5 6 5 M4 7v7h8V7',
  },
] as const;

type ReserveSection = (typeof reserveSections)[number]['id'];

export function SectionNavSection() {
  const [section, setSection] = useState<ReserveSection>('counts');
  const [detail, setDetail] = useState(false);
  const items = reserveSections.map((item) => ({
    id: item.id,
    label: item.label,
    href: `#section-nav/${item.id}`,
    // A decorative glyph before the label; the label names the link.
    icon: <Glyph path={item.glyph} />,
    // A detail page inside a section keeps the section current.
    current:
      item.id === section
        ? detail
          ? ('location' as const)
          : ('page' as const)
        : false,
  }));
  const current = reserveSections.find((item) => item.id === section)!;

  return (
    <Section
      id="section-nav"
      purpose="SectionNav is the navigation between the sections of one area, such as a portal's pages: a labelled nav of links, quieter than the workspace's own navigation. The current item carries aria-current (page, or location on a page inside it) and is marked by an accent underline in a row, or, from verticalFrom up, by a bar at its start in a side list beside the content. onNavigate takes a plain press for a client router and leaves a press with a modifier key to the browser. An item's optional icon is a decorative glyph before its label. A coarse pointer gets 44 px targets. Use Tabs for panels on one page and Nav for a workspace's destinations."
      title="SectionNav"
      usage={`<SectionNav
  aria-label="Reserve office"
  verticalFrom="md"
  items={[
    { id: 'counts', label: 'Counts', href: '/office/counts', current: 'page', icon: <ChartGlyph /> },
    { id: 'rangers', label: 'Rangers', href: '/office/rangers' },
  ]}
  onNavigate={(item) => navigate(item.href)}
/>`}
    >
      <Grid columns={4} columnsBelow={{ md: 1 }} gap={4}>
        <SectionNav
          aria-label="Reserve office"
          items={items}
          onNavigate={(item) => {
            setSection(item.id as ReserveSection);
            setDetail(false);
          }}
          verticalFrom="md"
        />
        <Card columnSpan={3} padding={4}>
          <Stack gap={2}>
            <Text as="h3" variant="title">
              {detail ? `${current.label} · Today` : current.label}
            </Text>
            <Text>{current.note}</Text>
            <Text color="muted" variant="caption">
              <a
                href={`#section-nav/${section}/today`}
                onClick={(event) => {
                  event.preventDefault();
                  setDetail(true);
                }}
              >
                Open today&apos;s page
              </a>{' '}
              (the section stays current).
            </Text>
          </Stack>
        </Card>
      </Grid>
    </Section>
  );
}
