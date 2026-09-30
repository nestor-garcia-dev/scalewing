import { Box, Button, Card, Inline, Stack, Text } from '@scalewing/react';
import { useEffect, useRef, useState } from 'react';

import { Section } from '../layout/Section.js';

/**
 * A notice a script focuses after a save: the whole card takes focus, so the
 * canvas's accent ring goes round it, not the browser's outline.
 */
function SavedNotice() {
  const [saved, setSaved] = useState(false);
  const notice = useRef<HTMLElement>(null);
  useEffect(() => {
    if (saved) notice.current?.focus();
  }, [saved]);
  return (
    <Stack gap={2}>
      <Inline gap={2} wrap>
        <Button onPress={() => setSaved(true)} size="sm" variant="secondary">
          Save den notes
        </Button>
        <Button onPress={() => setSaved(false)} size="sm" variant="ghost">
          Clear
        </Button>
      </Inline>
      {saved ? (
        <Box radius="lg" ref={notice} role="status" tabIndex={-1}>
          <Card padding={4} variant="outlined">
            <Text as="p">Den notes saved for the red fox burrow.</Text>
          </Card>
        </Box>
      ) : null}
    </Stack>
  );
}

export function CanvasSection() {
  return (
    <Section
      id="canvas"
      purpose="ThemeProvider writes data-theme. Generated CSS sets page background, type, links, native text controls, and the focus ring of a programmatic focus target (tabIndex -1). prefers-reduced-transparency falls back to solid surface."
      title="Canvas"
      usage={`<ThemeProvider colorScheme="system">
  <Box as="a" href="#layout">Layout</Box>
</ThemeProvider>

<Box ref={notice} tabIndex={-1} radius="lg">
  <Card variant="outlined">Den notes saved.</Card>
</Box>`}
    >
      <Stack gap={3}>
        <Text>
          Body copy uses the canvas type. Links in this gallery should not look
          like user-agent chrome.
        </Text>
        <Inline gap={3} wrap>
          <Box as="a" href="#layout">
            In-page canvas link
          </Box>
          <Box as="a" href="#button">
            Another canvas link
          </Box>
        </Inline>
        <Stack gap={2}>
          <input
            aria-label="Canvas text input"
            defaultValue="Native text control"
          />
          <select aria-label="Canvas select">
            <option>Native select</option>
            <option>Second option</option>
          </select>
        </Stack>
        <SavedNotice />
        <Text color="muted" variant="caption">
          A notice a script focuses after a save (tabIndex -1) takes the accent
          ring past the ring offset when the browser would show a ring, as after
          a keyboard press; give the Box the card&apos;s radius so the ring
          follows its corners.
        </Text>
        <Text color="muted" variant="caption">
          If the OS requests reduced transparency, glass fills become
          colors.surface and backdrop-filter is disabled.
        </Text>
      </Stack>
    </Section>
  );
}
