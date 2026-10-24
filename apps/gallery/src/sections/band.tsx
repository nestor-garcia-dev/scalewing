import { Band, Box, Button, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function BandSection() {
  return (
    <Section
      id="band"
      purpose="Band is a full-width stretch of the page in one fill, its content in a centred column with the page gutter. The inverse band is the dark one (a site footer, one closing section): words, muted words, links, the accent and a primary button inside it read in onInverse, so its content needs no band-aware variant. A brand moves it with a theme overlay of inverse."
      title="Band"
      usage={`<Band tone="inverse" aria-labelledby="closing-title">
  <Text id="closing-title" variant="title">Count with us</Text>
</Band>
<Band tone="subtle" width="reading">…</Band>`}
    >
      <Stack gap={3}>
        <Band aria-labelledby="band-inverse-title" paddingY={6} tone="inverse">
          <Stack gap={2}>
            <Text id="band-inverse-title" variant="title">
              Join the spring heron count
            </Text>
            <Text color="muted">
              Two mornings at the north hide, binoculars provided.
            </Text>
            <Text>
              Read the <a href="#band">field guide</a> before you come.
            </Text>
            <Box>
              <Button onPress={() => undefined}>Sign up for a morning</Button>
            </Box>
          </Stack>
        </Band>
        <Band
          aria-labelledby="band-subtle-title"
          paddingY={6}
          tone="subtle"
          width="reading"
        >
          <Stack gap={2}>
            <Text id="band-subtle-title" variant="title">
              Wetland notes
            </Text>
            <Text color="muted">
              A grey strip at the reading width between white sections.
            </Text>
          </Stack>
        </Band>
      </Stack>
    </Section>
  );
}
