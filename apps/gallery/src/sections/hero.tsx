import { Box, ButtonLink, Hero, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function HeroSection() {
  return (
    <Section
      id="hero"
      purpose="Hero is a public page's opening, a section named by its title: an eyebrow, the title in the hero size (the page's h1), a lead and actions, with an optional picture beside the words from md and under them on a phone, where the actions stack to the full width. With no picture the words keep the reading width."
      title="Hero"
      usage={`<Hero
  eyebrow="For birdwatchers"
  title="Every heron counted."
  lead="The north marsh in every season, from the hide to the shore."
  actions={<ButtonLink href="/visit">Plan a visit</ButtonLink>}
  media={<img alt="The heron hide at dawn" src="/hide.jpg" />}
/>`}
    >
      <Stack gap={8}>
        <Hero
          actions={
            <>
              <ButtonLink href="#hero" tabIndex={0}>
                Plan a visit
              </ButtonLink>
              <ButtonLink href="#hero" tabIndex={0} variant="neutral">
                See the trails
              </ButtonLink>
            </>
          }
          eyebrow="For birdwatchers"
          lead="The north marsh in every season, from the hide to the shore."
          media={
            <Box
              aria-label="This week at the hide"
              background="surface"
              padding={5}
              radius="lg"
              role="img"
            >
              <Stack gap={2}>
                <Text as="span" variant="title">
                  This week
                </Text>
                <Text color="muted">Grey herons: 14</Text>
                <Text color="muted">Little egrets: 6</Text>
              </Stack>
            </Box>
          }
          title="Every heron counted."
        />
        <Hero
          eyebrow="The trails"
          lead="Three marked walks from the car park, each with a hide at its end and a bench halfway."
          title="Walk the marsh at your own pace."
        />
      </Stack>
    </Section>
  );
}
