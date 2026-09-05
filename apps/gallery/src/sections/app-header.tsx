import {
  AppHeader,
  Box,
  Button,
  Field,
  Inline,
  Nav,
  SegmentedControl,
  Stack,
  Text,
} from '@scalewing/react';

import { Section } from '../layout/Section.js';
import { sampleRegions } from '../sample-copy.js';

export function AppHeaderSection() {
  return (
    <Section
      id="app-header"
      purpose="AppHeader is the sticky glass chrome for product title, compact Field, Nav, and filters. Nav marks the current page with aria-current. Native selects inherit canvas chevrons and accent focus. Do not restyle this in app CSS."
      title="AppHeader"
      usage={`<AppHeader>
  <Inline justify="between" wrap>
    <Text variant="title">Field Notes</Text>
    <Nav aria-label="Workspace">
      <Box as="a" href="#table" aria-current="page">Species</Box>
    </Nav>
  </Inline>
</AppHeader>`}
    >
      <AppHeader sticky={false}>
        <Stack gap={3}>
          <Inline align="center" gap={4} justify="between" wrap>
            <Inline align="center" gap={3} wrap>
              <Text variant="title">Field Notes</Text>
              <Field label="Region" labelVisuallyHidden size="xs">
                <select defaultValue="amazon" name="gallery-region">
                  {sampleRegions.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Box as="a" href="#app-header">
                Add habitat
              </Box>
            </Inline>
            <Inline align="center" gap={3} wrap>
              <Nav aria-label="Example workspace">
                <Box as="a" aria-current="page" href="#table">
                  Species
                </Box>
                <Box as="a" href="#badge">
                  Habitats
                </Box>
              </Nav>
              <Text color="muted" variant="caption">
                Last count: Sep 4, 3:11 PM UTC
              </Text>
              <Button onPress={() => undefined} size="xs" variant="secondary">
                Refresh census
              </Button>
            </Inline>
          </Inline>
          <Inline align="center" gap={3} wrap>
            <SegmentedControl
              aria-label="Example class"
              items={[
                { id: 'mammals', label: 'Mammals' },
                { id: 'birds', label: 'Birds' },
              ]}
              onChange={() => undefined}
              value="mammals"
            />
            <SegmentedControl
              aria-label="Example range"
              items={[
                { id: 'forest', label: 'Forest' },
                { id: 'savanna', label: 'Savanna' },
              ]}
              onChange={() => undefined}
              value="forest"
            />
          </Inline>
        </Stack>
      </AppHeader>
    </Section>
  );
}
