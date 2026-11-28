import { Box, Inline, Stack, Text } from '@scalewing/react';
import { utilityClassCatalog } from '@scalewing/react';

import { Section } from '../layout/Section.js';

const sampleLayoutClasses = [
  'sw-container',
  'sw-container-reading',
  'sw-full-width',
  'sw-grow',
  'sw-no-shrink',
  'sw-wrap',
  'sw-padding-4',
  'sw-gap-3',
] as const;

export function LayoutSection() {
  return (
    <Section
      id="layout"
      purpose="Box is a semantic layout shell. Stack is a column. Inline is a row. Spacing step 4 is 16px, not 4px. border draws a solid hairline; border dashed marks a space to fill in by hand, such as a blank on a printed form. The sw-container class centres a page's column at the container width, and sw-container-reading at the narrower reading width, for a form or text. shrink false on any Box-based component keeps it at its natural size along its parent's main axis when a flex row or column is short of room: its siblings give way instead."
      title="Layout"
      usage={`<Stack gap={3}>
  <Inline gap={2} justify="between">
    <Box as="section" padding={4} radius="md" border>Panel</Box>
  </Inline>
  <Inline gap={3}>
    <Box>{longWords}</Box>
    <Box shrink={false}>Kept on one line</Box>
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
        <Stack data-testid="layout-dashed" gap={2}>
          <Text variant="label">border solid and dashed</Text>
          <Inline gap={3} wrap>
            <Box background="surface" border padding={3} radius="sm">
              <Text variant="caption">Species · Red fox</Text>
            </Box>
            <Box background="surface" border="dashed" padding={3} radius="sm">
              <Text color="muted" variant="caption">
                Observer · write it in by hand
              </Text>
            </Box>
          </Inline>
        </Stack>
        <Box className="sw-container-reading" data-testid="layout-reading">
          <Box border padding={3} radius="sm">
            <Text variant="caption">
              sw-container-reading: a centred column at the reading width, for a
              form such as a ranger&apos;s sighting report
            </Text>
          </Box>
        </Box>
        <Stack data-testid="layout-shrink" gap={2}>
          <Text variant="label">
            shrink false keeps a box&apos;s natural width
          </Text>
          <Inline align="center" gap={3}>
            <Box background="surface" border padding={2} radius="sm">
              <Text variant="caption">
                Wetland, woodland and coastal transects counted this week; this
                box gives way and wraps
              </Text>
            </Box>
            <Box
              background="surface"
              border
              padding={2}
              radius="sm"
              shrink={false}
            >
              <Text variant="caption">Kept on one line</Text>
            </Box>
          </Inline>
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
