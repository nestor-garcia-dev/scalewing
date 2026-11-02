import {
  Button,
  Card,
  PageHeader,
  Stack,
  TabPanel,
  Tabs,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

const tabs = [
  { id: 'open', label: 'Open' },
  { id: 'counted', label: 'Counted' },
] as const;

export function PageHeaderSection() {
  const [tab, setTab] = useState('open');
  return (
    <Section
      id="page-header"
      purpose="PageHeader is a workspace page's opening: an optional link back, the title (its one h1, heading 28/34) with an optional muted subtitle (bodySm 15/22) under it, the page's actions at the title row's end and an optional row below, such as Tabs or FilterChips that switch the page. When the actions do not fit beside the words they move under them, and they wrap among themselves. Place it inside main, where a header is no banner landmark. back takes onNavigate for a client router; a press with a modifier key keeps the browser's own behaviour."
      title="PageHeader"
      usage={`<PageHeader
  title="Spring census"
  subtitle="Week 5 of 12, north reed bed"
  back={{ label: 'All surveys', href: '/surveys', onNavigate: () => navigate('/surveys') }}
  actions={<Button onPress={publish}>Publish</Button>}
  below={<Tabs id="census" aria-label="Census" items={tabs} value={tab} onChange={setTab} />}
/>`}
    >
      <Stack gap={4}>
        <Card padding={4} variant="outlined">
          <PageHeader
            actions={
              <>
                <Button onPress={() => undefined} variant="neutral">
                  Export
                </Button>
                <Button onPress={() => undefined}>Publish</Button>
              </>
            }
            back={{ href: '#page-header', label: 'All surveys' }}
            below={
              <Tabs
                aria-label="Census"
                id="page-header-tabs"
                items={tabs}
                onChange={setTab}
                value={tab}
              />
            }
            subtitle="Week 5 of 12, north reed bed"
            title="Spring census"
          />
          {tabs.map((each) => (
            <TabPanel
              id={each.id}
              key={each.id}
              tabsId="page-header-tabs"
              value={tab}
            >
              <Text variant="caption">{each.label} sightings go here.</Text>
            </TabPanel>
          ))}
        </Card>
        <Card padding={4} variant="outlined">
          <Stack gap={4}>
            <PageHeader title="Title alone, no slots" />
            <PageHeader
              actions={
                <Button onPress={() => undefined}>Log a sighting</Button>
              }
              subtitle="A title long enough to wrap keeps its words whole beside the action and moves the action under it when a narrow window leaves no room."
              title="The long-running survey of every wading bird on the northern reed beds and the salt marsh beyond them"
            />
          </Stack>
        </Card>
      </Stack>
    </Section>
  );
}
