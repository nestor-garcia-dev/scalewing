import { Button, Card, EmptyState, Stack, Text } from '@scalewing/react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

/** A bird's nest, standing in for a consumer's Lucide glyph. */
const nest = 'M2 9c0 3 2.7 5 6 5s6-2 6-5M1 9h14M5 6a3 3 0 0 1 6 0';

export function EmptyStateSection() {
  return (
    <Section
      id="empty-state"
      purpose="EmptyState is where a list or a page has nothing yet: a centred panel on the surface with a dashed hairline edge, an optional decorative glyph (hidden from assistive technology), a title (h2, or h3 with titleAs inside a card under its own heading), a muted line and the actions that fill it, in a centred row that wraps. It fills its column, so it fits a page column or a Card. All words are yours; a blank title or description throws."
      title="EmptyState"
      usage={`<EmptyState
  icon={<Bird />}
  title="No nests counted yet"
  description="Bring back last spring's nests, or paste a list."
  actions={<>
    <Button onPress={copy}>Copy last spring's 12 nests</Button>
    <Button variant="neutral" onPress={paste}>Paste a list</Button>
  </>}
/>`}
    >
      <Stack gap={5}>
        <div data-testid="empty-state-page">
          <EmptyState
            actions={
              <>
                <Button onPress={() => {}}>
                  {"Copy last spring's 12 nests"}
                </Button>
                <Button onPress={() => {}} variant="neutral">
                  Paste a list
                </Button>
              </>
            }
            description="Bring back last spring's nests, or paste a list from your field notebook."
            icon={<Glyph path={nest} />}
            title="No nests counted on the north island yet"
          />
        </div>
        <Card padding={4}>
          <Stack gap={3}>
            <Text as="h2" variant="title">
              Otter sightings
            </Text>
            <div data-testid="empty-state-card">
              <EmptyState
                description="Sightings logged by rangers show up here."
                title="No otters seen this week"
                titleAs="h3"
              />
            </div>
          </Stack>
        </Card>
      </Stack>
    </Section>
  );
}
