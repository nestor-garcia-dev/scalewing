import { Box, Inline, Stack, Text } from '@scalewing/react';
import { utilityClassCatalog } from '@scalewing/tokens';

import { Section } from '../layout/Section.js';

const sampleLayoutClasses = [
  'sw-container',
  'sw-full-width',
  'sw-grow',
  'sw-wrap',
  'sw-padding-4',
  'sw-gap-3',
] as const;

export function LayoutSection() {
  return (
    <Section
      id="layout"
      purpose="Box is a semantic layout shell. Stack is a column. Inline is a row. Spacing step 4 is 16px, not 4px."
      title="Layout"
      usage={`<Stack gap={3}>
  <Inline gap={2} justify="between">
    <Box as="section" padding={4} radius="md" border>Panel</Box>
  </Inline>
</Stack>`}
    >
      <Stack gap={4}>
        <Inline gap={3} wrap>
          <Box as="section" background="surface" border padding={3} radius="md">
            <Text variant="label">section · surface · md</Text>
          </Box>
          <Box
            as="aside"
            background="background"
            border
            padding={3}
            radius="lg"
          >
            <Text variant="label">aside · background · lg</Text>
          </Box>
          <Box as="span" border padding={2} radius="pill">
            <Text variant="caption">span · pill</Text>
          </Box>
        </Inline>
        <Stack align="start" gap={2}>
          <Text variant="label">Stack gap 2, align start</Text>
          <Box background="surface" border padding={2} radius="sm">
            <Text variant="caption">One</Text>
          </Box>
          <Box background="surface" border padding={2} radius="sm">
            <Text variant="caption">Two</Text>
          </Box>
        </Stack>
        <Inline align="center" gap={2} justify="between" wrap>
          <Text variant="label">Inline between, align center</Text>
          <Text color="muted" variant="caption">
            wrap when narrow
          </Text>
        </Inline>
        <Stack gap={1}>
          <Text variant="label">Bounded generated classes</Text>
          {sampleLayoutClasses.map((name) => (
            <Text key={name} variant="caption">
              {name}
            </Text>
          ))}
          <Box background="surface" border className="sw-padding-4" radius="sm">
            <Text variant="caption">sw-padding-4 applied on Box</Text>
          </Box>
          <Text color="muted" variant="caption">
            Generated catalog has {utilityClassCatalog().length} class names.
          </Text>
        </Stack>
      </Stack>
    </Section>
  );
}
