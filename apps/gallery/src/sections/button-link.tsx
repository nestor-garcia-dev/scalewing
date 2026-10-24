import { ButtonLink, Inline, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function ButtonLinkSection() {
  return (
    <Section
      id="button-link"
      purpose="ButtonLink is a link drawn as a Button, for a destination that reads as an action (a site's Contact us or Sign in). It is a real link, so it can open in a new tab and works on a page rendered with no script. aria-current marks the one that is the current page with the pressed ring."
      title="ButtonLink"
      usage={`<ButtonLink href="/contact">Contact the rangers</ButtonLink>
<ButtonLink href="/sign-in" variant="neutral">Sign in</ButtonLink>
<ButtonLink aria-current="page" href="/contact">Contact the rangers</ButtonLink>`}
    >
      <Stack gap={4}>
        <Inline gap={3} wrap>
          <ButtonLink href="#button-link">Contact the rangers</ButtonLink>
          <ButtonLink href="#button-link" variant="neutral">
            Sign in
          </ButtonLink>
          <ButtonLink href="#button-link" variant="secondary">
            Visit the marsh
          </ButtonLink>
          <ButtonLink href="#button-link" size="sm" variant="ghost">
            Field guide
          </ButtonLink>
        </Inline>
        <Stack gap={2}>
          <Text color="muted" variant="caption">
            The current page
          </Text>
          <Inline gap={3} wrap>
            <ButtonLink aria-current="page" href="#button-link">
              Heron count
            </ButtonLink>
            <ButtonLink
              aria-current="page"
              href="#button-link"
              variant="neutral"
            >
              Owl count
            </ButtonLink>
          </Inline>
        </Stack>
        <ButtonLink href="#button-link" width="full">
          Join the spring count
        </ButtonLink>
      </Stack>
    </Section>
  );
}
