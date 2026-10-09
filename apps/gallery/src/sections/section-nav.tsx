import { Card, Grid, SectionNav, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

const reserveSections = [
  { id: 'counts', label: 'Counts', note: 'Wader counts at high tide.' },
  { id: 'rangers', label: 'Rangers', note: 'Who walks which transect.' },
  { id: 'hides', label: 'Hides', note: 'Opening times of the four hides.' },
] as const;

type ReserveSection = (typeof reserveSections)[number]['id'];

export function SectionNavSection() {
  const [section, setSection] = useState<ReserveSection>('counts');
  const [detail, setDetail] = useState(false);
  const items = reserveSections.map((item) => ({
    id: item.id,
    label: item.label,
    href: `#section-nav/${item.id}`,
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
      purpose="SectionNav is the navigation between the sections of one area, such as a portal's pages: a labelled nav of links, quieter than the workspace's own navigation. The current item carries aria-current (page, or location on a page inside it) and is marked by an accent underline in a row, or, from verticalFrom up, by a bar at its start in a side list beside the content. onNavigate takes a plain press for a client router and leaves a press with a modifier key to the browser. A coarse pointer gets 44 px targets. Use Tabs for panels on one page and Nav for a workspace's destinations."
      title="SectionNav"
      usage={`<SectionNav
  aria-label="Reserve office"
  verticalFrom="md"
  items={[
    { id: 'counts', label: 'Counts', href: '/office/counts', current: 'page' },
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
