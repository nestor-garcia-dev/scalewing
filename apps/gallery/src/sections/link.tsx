import { Box, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function LinkSection() {
  return (
    <Section
      id="link"
      purpose='Box as="a" is a layout link with href. It is not a button. Next.js and other routers still own client navigation.'
      title="Link"
      usage={`<Box as="a" href="#button" padding={2}>
  Button
</Box>`}
    >
      <Stack gap={3}>
        <Box as="a" href="#button" padding={2}>
          Layout link to Button
        </Box>
        <Box as="a" href="#field">
          Layout link to Field
        </Box>
        <Text color="muted">
          Tab to a link to inspect the generated focus ring. Router Link
          components stay in the product; they should not nest another anchor
          inside Box as=&quot;a&quot;.
        </Text>
      </Stack>
    </Section>
  );
}
